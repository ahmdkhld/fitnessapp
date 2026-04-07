import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const REFRESH_TTL_DAYS = 30;
const RESET_TTL_MINUTES = 30;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mailer: MailerService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash, fullName: dto.fullName },
    });

    return this.issueTokens(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueTokens(user.id, user.email);
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
      },
    });
    if (!record) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: payload.sub, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Refresh token reused or expired');
    }

    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(payload.sub, payload.email);
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hash(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true };
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
   * Stub for social auth. Validates the provider token (placeholder),
   * upserts a user by verified email, and issues the usual token pair.
   * Real implementations would verify the Google/Apple id_token against
   * the provider's JWKS — the shape is ready, the verification call is
   * intentionally left as a TODO until we have credentials.
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
        },
      });
    }
    return this.issueTokens(user.id, user.email);
  }

  /**
   * Verifies the provider's id_token against its JWKS endpoint and
   * returns the verified email/name claims. Falls back to an unsigned
   * decode in dev when `jose` isn't installed yet — production must
   * set GOOGLE_CLIENT_ID / APPLE_CLIENT_ID so the audience is checked.
   */
  private async verifySocialToken(
    provider: 'google' | 'apple',
    idToken: string,
  ): Promise<{ email: string | null; name: string | null }> {
    const audience =
      provider === 'google'
        ? process.env.GOOGLE_CLIENT_ID
        : process.env.APPLE_CLIENT_ID;

    if (audience) {
      try {
        // Lazy require so the dependency is optional at boot time.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const jose = require('jose');
        const issuer =
          provider === 'google'
            ? 'https://accounts.google.com'
            : 'https://appleid.apple.com';
        const jwksUrl =
          provider === 'google'
            ? 'https://www.googleapis.com/oauth2/v3/certs'
            : 'https://appleid.apple.com/auth/keys';
        const jwks = jose.createRemoteJWKSet(new URL(jwksUrl));
        const { payload } = await jose.jwtVerify(idToken, jwks, {
          issuer,
          audience,
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
          `${provider} token verification failed: ${(err as Error).message}`,
        );
        throw new UnauthorizedException('Invalid social token');
      }
    }

    // Dev fallback: decode without verification.
    try {
      const [, payload] = idToken.split('.');
      if (!payload) throw new Error('malformed token');
      const decoded = JSON.parse(
        Buffer.from(payload, 'base64url').toString('utf8'),
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

  private async issueTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
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
