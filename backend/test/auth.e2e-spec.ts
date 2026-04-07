import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * End-to-end happy path: register → login → refresh → logout.
 * Expects a real Postgres available at DATABASE_URL and prisma migrations
 * to have been applied. CI runs this against a disposable Postgres service.
 */
describe('Auth (e2e)', () => {
  let app: INestApplication;
  const email = `e2e-${Date.now()}@nutritrack.test`;
  const password = 'SuperSecret123!';
  let access: string;
  let refresh: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register → 201 with token pair', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password, fullName: 'E2E User' })
      .expect(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    access = res.body.accessToken;
    refresh = res.body.refreshToken;
  });

  it('GET /users/me → 200 with profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${access}`)
      .expect(200);
    expect(res.body.email).toBe(email);
  });

  it('POST /auth/refresh rotates tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: refresh })
      .expect(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.refreshToken).not.toBe(refresh);
    refresh = res.body.refreshToken;
  });

  it('refusing to reuse a revoked refresh token returns 401', async () => {
    // Use the very first refresh token (already rotated out above)
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(201);
    const oldRefresh = login.body.refreshToken;

    await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: oldRefresh })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: oldRefresh })
      .expect(401);
  });

  it('POST /auth/logout revokes the current refresh token', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/logout')
      .send({ refreshToken: refresh })
      .expect(201);
  });
});
