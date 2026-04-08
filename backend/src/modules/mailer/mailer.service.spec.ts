import { MailerService } from './mailer.service';

describe('MailerService', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('falls back to logger when SMTP_HOST is not set', async () => {
    delete process.env.SMTP_HOST;
    const svc = new MailerService();
    await svc.onModuleInit();
    const result = await svc.sendPasswordReset('a@b.com', 'https://example/r');
    expect(result).toEqual({ logged: true });
  });

  it('reads SMTP_FROM override from env', async () => {
    process.env.SMTP_FROM = 'Custom <c@d.com>';
    const svc = new MailerService();
    await svc.onModuleInit();
    expect((svc as any).from).toBe('Custom <c@d.com>');
  });

  it('renders coach invite content via the stub path', async () => {
    delete process.env.SMTP_HOST;
    const svc = new MailerService();
    await svc.onModuleInit();
    const result = await svc.sendCoachInvite(
      'a@b.com',
      'Coach Carter',
      'https://example/accept/1',
    );
    expect(result).toEqual({ logged: true });
  });
});
