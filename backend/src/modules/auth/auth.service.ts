import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { PrismaService } from '../../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const REFRESH_TTL_DAYS = 30;
const RESET_TTL_MINUTES = 30;
const VERIFY_TTL_HOURS = 24;
const RESEND_COOLDOWN_MS = 60_000; // 1 minute between resend attempts

/** Apple JWKS is cached per jose best practice (createRemoteJWKSet handles rotation). */
const APPLE_JWKS = createRemoteJWKSet(
  new URL('https://appleid.apple.com/auth/keys'),
);

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailer: MailerService,
  ) {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    this.googleClient = new OAuth2Client(googleClientId);
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Generate email verification token
    const rawVerifyToken = crypto.randomBytes(32).toString('hex');
    const emailVerifyToken = this.hash(rawVerifyToken);
    const emailVerifyExpires = new Date();
    emailVerifyExpires.setUTCHours(emailVerifyExpires.getUTCHours() + VERIFY_TTL_HOURS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        emailVerified: false,
        emailVerifyToken,
        emailVerifyExpires,
      },
    });

    // Send verification email (fire-and-forget so registration isn't blocked)
    const frontendUrl = process.env.FRONTEND_URL ?? 'https://app.nutritrack.app';
    const verifyUrl = `${frontendUrl}/verify-email?token=${rawVerifyToken}`;
    this.mailer
      .sendEmailVerification(user.email, verifyUrl)
      .catch((err) =>
        this.logger.error(`Verification email failed: ${(err as Error).message}`),
      );

    return this.issueTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueTokens(user.id, user.email, user.role);
  }

  /**
   * Rotation: verify the refresh token, check it matches a stored
   * un-revoked row, revoke it and issue a new pair. Re-use of a revoked
   * token revokes every session for the user.
   */
  async refresh(refreshToken: string) {
    let payload: { sub: string; email: string };
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenHash = this.hash(refreshToken);
    const record = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
        // Defence-in-depth: never let a row written by the password
        // reset flow be exchanged for a new access token, even though
        // those rows store random hex (not signed JWTs) and would fail
        // the JWT verify above. Belt + suspenders.
        NOT: { userAgent: 'password-reset' },
      },
    });
    if (!record) {
      await this.prisma.refreshToken.updateMany({
        where: {
          userId: payload.sub,
          revokedAt: null,
          NOT: { userAgent: 'password-reset' },
        },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Refresh token reused or expired');
    }

    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { role: true },
    });
    return this.issueTokens(payload.sub, payload.email, user?.role ?? 'user');
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hash(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
        NOT: { userAgent: 'password-reset' },
      },
      data: { revokedAt: new Date() },
    });
    return { success: true };
  }

  /**
   * Verifies a user's email by matching the hashed token and checking
   * that it has not expired. Clears the token fields on success.
   */
  async verifyEmail(rawToken: string) {
    const tokenHash = this.hash(rawToken);
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerifyToken: tokenHash,
        emailVerifyExpires: { gt: new Date() },
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }
    if (user.emailVerified) {
      return { success: true, message: 'Email already verified' };
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });

    return { success: true, message: 'Email verified successfully' };
  }

  /**
   * Generates a new verification token and re-sends the verification
   * email. Rate-limited to one request per minute to prevent abuse.
   */
  async resendVerification(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    if (user.emailVerified) {
      return { success: true, message: 'Email already verified' };
    }

    // Rate-limit: if a token was issued less than RESEND_COOLDOWN_MS ago, reject
    if (
      user.emailVerifyExpires &&
      user.emailVerifyExpires.getTime() >
        Date.now() + (VERIFY_TTL_HOURS * 3600_000 - RESEND_COOLDOWN_MS)
    ) {
      throw new ForbiddenException(
        'Please wait at least one minute before requesting another verification email',
      );
    }

    const rawVerifyToken = crypto.randomBytes(32).toString('hex');
    const emailVerifyToken = this.hash(rawVerifyToken);
    const emailVerifyExpires = new Date();
    emailVerifyExpires.setUTCHours(emailVerifyExpires.getUTCHours() + VERIFY_TTL_HOURS);

    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerifyToken, emailVerifyExpires },
    });

    const frontendUrl = process.env.FRONTEND_URL ?? 'https://app.nutritrack.app';
    const verifyUrl = `${frontendUrl}/verify-email?token=${rawVerifyToken}`;
    await this.mailer.sendEmailVerification(user.email, verifyUrl);

    return { success: true, message: 'Verification email sent' };
  }

  /**
   * Generates a single-use reset token, persists its hash on the user
   * record and logs the email that would be sent. The actual email
   * delivery is intentionally left as a TODO — wire it up to SES/
   * SendGrid when credentials are available. Always returns success so
   * callers can't enumerate registered email addresses.
   */
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setUTCMinutes(expiresAt.getUTCMinutes() + RESET_TTL_MINUTES);
      // Reuses the refresh_tokens table with a sentinel user_agent so we
      // don't need another migration for the reset token.
      await this.prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: this.hash(rawToken),
          expiresAt,
          userAgent: 'password-reset',
        },
      });
      const resetUrl =
        `${process.env.APP_URL ?? 'https://app.nutritrack.app'}` +
        `/reset?token=${rawToken}`;
      await this.mailer.sendPasswordReset(email, resetUrl);
    }
    return { success: true };
  }

  /**
   * Changes the password for an authenticated user. Verifies the current
   * password, hashes the new one, updates the user record, and revokes
   * all existing refresh tokens to force re-login on other devices.
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) throw new BadRequestException('Current password is incorrect');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      // Revoke all refresh tokens — forces re-login on every device
      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { success: true };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = this.hash(token);
    const record = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        userAgent: 'password-reset',
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    if (!record) throw new UnauthorizedException('Invalid or expired token');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      this.prisma.refreshToken.update({
        where: { id: record.id },
        data: { revokedAt: new Date() },
      }),
      // Kill every active session too — password change invalidates them
      this.prisma.refreshToken.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return { success: true };
  }

  /**
   * Social auth login. Verifies the provider's id_token cryptographically
   * (Google via google-auth-library, Apple via jose + JWKS), upserts a
   * user by verified email, and issues the usual token pair.
   */
  async socialLogin(provider: 'google' | 'apple', idToken: string, fullName?: string) {
    const claims = await this.verifySocialToken(provider, idToken);
    if (!claims.email) {
      throw new UnauthorizedException('Social provider did not return an email');
    }

    let user = await this.prisma.user.findUnique({
      where: { email: claims.email },
    });
    if (!user) {
      // Random password — user can reset later via forgot-password flow
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await this.prisma.user.create({
        data: {
          email: claims.email,
          passwordHash: await bcrypt.hash(randomPassword, 12),
          fullName: fullName ?? claims.name ?? claims.email,
          emailVerified: true, // Social provider already verified the email
        },
      });
    } else if (!user.emailVerified) {
      // Existing user logging in via social — trust the provider's verification
      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true, emailVerifyToken: null, emailVerifyExpires: null },
      });
    }
    return this.issueTokens(user.id, user.email, user.role);
  }

  /**
   * Dispatches to the provider-specific verification method.
   * Both Google and Apple paths perform full cryptographic verification
   * of the id_token signature, expiry, issuer, and audience.
   *
   * In non-production environments where the client ID is not configured,
   * an unsigned decode fallback is allowed so local development works
   * without real provider credentials. This fallback is blocked entirely
   * in production.
   */
  private async verifySocialToken(
    provider: 'google' | 'apple',
    idToken: string,
  ): Promise<{ email: string | null; name: string | null }> {
    if (provider === 'google') {
      return this.verifyGoogleToken(idToken);
    }
    return this.verifyAppleToken(idToken);
  }

  /**
   * Verifies a Google ID token using google-auth-library.
   * This validates the token signature against Google's JWKS, checks
   * expiry, and verifies the audience matches GOOGLE_CLIENT_ID.
   */
  private async verifyGoogleToken(
    idToken: string,
  ): Promise<{ email: string | null; name: string | null }> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return this.devFallbackDecode('google', idToken);
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Google token payload is empty');
      }
      if (!payload.email_verified) {
        throw new Error('Google email is not verified');
      }
      return {
        email: payload.email ?? null,
        name: payload.name ?? payload.given_name ?? null,
      };
    } catch (err) {
      this.logger.warn(
        `Google token verification failed: ${(err as Error).message}`,
      );
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  /**
   * Verifies an Apple ID token using jose against Apple's JWKS endpoint.
   * This validates the token signature, expiry, issuer
   * (https://appleid.apple.com), and audience (APPLE_CLIENT_ID).
   */
  private async verifyAppleToken(
    idToken: string,
  ): Promise<{ email: string | null; name: string | null }> {
    const clientId = process.env.APPLE_CLIENT_ID;
    if (!clientId) {
      return this.devFallbackDecode('apple', idToken);
    }

    try {
      const { payload } = await jwtVerify(idToken, APPLE_JWKS, {
        issuer: 'https://appleid.apple.com',
        audience: clientId,
      });
      return {
        email: (payload.email as string | undefined) ?? null,
        name:
          (payload.name as string | undefined) ??
          (payload.given_name as string | undefined) ??
          null,
      };
    } catch (err) {
      this.logger.warn(
        `Apple token verification failed: ${(err as Error).message}`,
      );
      throw new UnauthorizedException('Invalid Apple token');
    }
  }

  /**
   * Decodes a JWT payload WITHOUT signature verification.
   * Only allowed in development/test environments. In production this
   * throws immediately so that a missing client ID config does not
   * silently disable token verification.
   */
  private devFallbackDecode(
    provider: string,
    idToken: string,
  ): { email: string | null; name: string | null } {
    const env = process.env.NODE_ENV ?? 'development';
    if (env === 'production') {
      this.logger.error(
        `${provider.toUpperCase()}_CLIENT_ID is not configured — ` +
          `social login is disabled in production without it.`,
      );
      throw new UnauthorizedException(
        `${provider} login is not configured on this server`,
      );
    }

    this.logger.warn(
      `[DEV ONLY] Decoding ${provider} token without signature verification. ` +
        `Set ${provider.toUpperCase()}_CLIENT_ID to enable proper verification.`,
    );

    try {
      const [, payloadB64] = idToken.split('.');
      if (!payloadB64) throw new Error('malformed token');
      const decoded = JSON.parse(
        Buffer.from(payloadB64, 'base64url').toString('utf8'),
      );
      return {
        email: decoded.email ?? null,
        name: decoded.name ?? decoded.given_name ?? null,
      };
    } catch {
      throw new UnauthorizedException(
        `Could not decode ${provider} id token`,
      );
    }
  }

  private async issueTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? `${REFRESH_TTL_DAYS}d`,
    });

    const expiresAt = new Date();
    expiresAt.setUTCDate(expiresAt.getUTCDate() + REFRESH_TTL_DAYS);
    await this.prisma.refreshToken.create({
      data: { userId, tokenHash: this.hash(refreshToken), expiresAt },
    });

    return { accessToken, refreshToken };
  }

  private hash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
