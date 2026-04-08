import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

interface SmtpTransport {
  sendMail(opts: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<unknown>;
}

/**
 * Tiny mailer abstraction. Lazily loads `nodemailer` when SMTP_HOST is
 * configured; otherwise renders the email to the logger so dev + tests
 * can verify the templates without a real outbox.
 *
 * Templates are stored inline because we only have a handful — bring in
 * Handlebars or MJML once we cross the dozen-template mark.
 */
@Injectable()
export class MailerService implements OnModuleInit {
  private readonly logger = new Logger(MailerService.name);
  private transport: SmtpTransport | null = null;
  private from = 'NutriTrack <noreply@nutritrack.app>';

  async onModuleInit() {
    if (process.env.SMTP_FROM) this.from = process.env.SMTP_FROM;
    if (!process.env.SMTP_HOST) {
      this.logger.log('SMTP not configured — emails will be logged only');
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nodemailer = require('nodemailer');
      this.transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT ?? '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
      });
      this.logger.log(`SMTP transport ready (${process.env.SMTP_HOST})`);
    } catch (err) {
      this.logger.warn(`SMTP init failed: ${(err as Error).message}`);
    }
  }

  async sendPasswordReset(to: string, resetUrl: string) {
    const subject = 'Reset your NutriTrack password';
    const text =
      `Tap the link below to choose a new password. The link expires in 30 minutes.\n\n` +
      `${resetUrl}\n\n` +
      `If you didn't request this, ignore the email.`;
    const html = `
      <p>Tap the button below to choose a new password.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#2e7d5c;color:#fff;border-radius:6px;text-decoration:none">Reset password</a></p>
      <p>The link expires in 30 minutes. If you didn't request this, ignore the email.</p>
    `;
    return this.send({ to, subject, text, html });
  }

  async sendEmailVerification(to: string, verifyUrl: string) {
    const subject = 'Verify your NutriTrack email';
    const text =
      `Welcome to NutriTrack! Please verify your email address by visiting the link below.\n\n` +
      `${verifyUrl}\n\n` +
      `This link expires in 24 hours. If you didn't create an account, ignore this email.`;
    const html = `
      <p>Welcome to NutriTrack! Please verify your email address.</p>
      <p><a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background:#2e7d5c;color:#fff;border-radius:6px;text-decoration:none">Verify email</a></p>
      <p>This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
    `;
    return this.send({ to, subject, text, html });
  }

  async sendCoachInvite(to: string, coachName: string, acceptUrl: string) {
    const subject = `${coachName} invited you to NutriTrack coaching`;
    const text =
      `${coachName} would like to coach you on NutriTrack. ` +
      `Accept the invite to share read-only access to your progress.\n\n${acceptUrl}`;
    return this.send({ to, subject, text });
  }

  private async send(opts: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }) {
    if (!this.transport) {
      this.logger.log(
        `[email-stub:${opts.to}] ${opts.subject}\n${opts.text}`,
      );
      return { logged: true };
    }
    try {
      return await this.transport.sendMail({ from: this.from, ...opts });
    } catch (err) {
      this.logger.error(`Mail send failed: ${(err as Error).message}`);
      throw err;
    }
  }
}
