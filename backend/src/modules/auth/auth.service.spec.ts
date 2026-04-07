import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Pure-logic tests for refresh token rotation and reuse detection.
 * PrismaService and JwtService are replaced with in-memory fakes so the
 * suite runs without a database or JWT signing secret.
 */
describe('AuthService rotation', () => {
  const makeMailer = () =>
    ({
      sendPasswordReset: jest.fn(async () => undefined),
    }) as any;

  const makeJwt = (): jest.Mocked<JwtService> =>
    ({
      sign: jest.fn((payload, opts) =>
        JSON.stringify({ ...(payload as object), kind: opts ? 'refresh' : 'access' }),
      ),
      verify: jest.fn((token) => JSON.parse(token as string)),
    }) as unknown as jest.Mocked<JwtService>;

  const makePrisma = () => {
    const tokens: Array<{
      id: string;
      userId: string;
      tokenHash: string;
      expiresAt: Date;
      revokedAt: Date | null;
    }> = [];
    let idSeq = 1;

    return {
      store: tokens,
      user: {
        findUnique: jest.fn(),
        create: jest.fn(async ({ data }: any) => ({
          id: 'u1',
          email: data.email,
          passwordHash: data.passwordHash,
        })),
      },
      refreshToken: {
        create: jest.fn(async ({ data }: any) => {
          const row = { id: `t${idSeq++}`, ...data, revokedAt: null };
          tokens.push(row);
          return row;
        }),
        findFirst: jest.fn(async ({ where }: any) =>
          tokens.find(
            (t) =>
              t.userId === where.userId &&
              t.tokenHash === where.tokenHash &&
              t.revokedAt === null &&
              t.expiresAt > new Date(),
          ) ?? null,
        ),
        update: jest.fn(async ({ where, data }: any) => {
          const row = tokens.find((t) => t.id === where.id)!;
          Object.assign(row, data);
          return row;
        }),
        updateMany: jest.fn(async ({ where, data }: any) => {
          let count = 0;
          for (const t of tokens) {
            if (
              t.userId === where.userId &&
              (where.revokedAt === null ? t.revokedAt === null : true)
            ) {
              Object.assign(t, data);
              count++;
            }
          }
          return { count };
        }),
      },
    } as any;
  };

  it('refresh rotates the token and revokes the previous row', async () => {
    const prisma = makePrisma();
    const svc = new AuthService(prisma, makeJwt(), makeMailer());
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'a@b.com',
      // password hash for 'hunter22' pre-computed offline would be ideal;
      // we bypass bcrypt by short-circuiting login through issueTokens.
      passwordHash: '$2b$12$invalid',
    });

    // Call the private method via register path which skips bcrypt.
    prisma.user.findUnique.mockResolvedValueOnce(null);
    const first = await svc.register({
      email: 'a@b.com',
      password: 'hunter222',
    } as any);

    expect(prisma.store).toHaveLength(1);
    expect(prisma.store[0].revokedAt).toBeNull();

    const second = await svc.refresh(first.refreshToken);
    expect(prisma.store).toHaveLength(2);
    expect(prisma.store[0].revokedAt).not.toBeNull();
    expect(prisma.store[1].revokedAt).toBeNull();
    expect(second.refreshToken).not.toBe(first.refreshToken);
  });

  it('reusing a revoked refresh token revokes every session for the user', async () => {
    const prisma = makePrisma();
    const svc = new AuthService(prisma, makeJwt(), makeMailer());
    prisma.user.findUnique.mockResolvedValue(null);
    const first = await svc.register({ email: 'a@b.com', password: 'hunter222' } as any);
    await svc.refresh(first.refreshToken); // rotation

    await expect(svc.refresh(first.refreshToken)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(prisma.store.every((t) => t.revokedAt !== null)).toBe(true);
  });

  it('logout revokes the presented refresh token', async () => {
    const prisma = makePrisma();
    const svc = new AuthService(prisma, makeJwt(), makeMailer());
    prisma.user.findUnique.mockResolvedValue(null);
    const tokens = await svc.register({ email: 'a@b.com', password: 'hunter222' } as any);

    await svc.logout(tokens.refreshToken);
    expect(prisma.store[0].revokedAt).not.toBeNull();
  });
});
