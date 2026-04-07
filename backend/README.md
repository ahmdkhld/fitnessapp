# NutriTrack Backend (NestJS)

REST API for the NutriTrack diet & supplement tracking app.

## Stack

- **NestJS 10** + TypeScript
- **Prisma** ORM with **PostgreSQL 16**
- **JWT** auth (access + refresh tokens)
- **Swagger** docs at `/api/docs`
- **@nestjs/schedule** for nightly generation + overdue/stock crons
- **Jest** for unit tests
- **Docker** for production build

## Module overview

| Module          | Responsibility                                              |
|-----------------|-------------------------------------------------------------|
| `auth`          | Register, login, refresh, JWT strategy                      |
| `users`         | Profile + body stats CRUD                                   |
| `diet-plans`    | Diet plans, meals, ingredients                              |
| `supplements`   | Supplement plans + scheduled supplements                    |
| `schedule`      | Daily timeline generation, status updates, nightly cron     |
| `tracking`      | Water logs, body logs, daily notes                          |
| `analytics`     | Adherence %, streaks, insights engine                       |
| `notifications` | Device registration, settings, overdue/stock/evening crons  |
| `plan-parser`   | Text parser for imported diet/supplement plans              |
| `export`        | Coach/doctor report over a date range                       |

## Setup

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

Or via Docker:

```bash
cd ..
docker compose up --build
```

API: `http://localhost:3000/api`
Swagger: `http://localhost:3000/api/docs`

## Tests

```bash
npm test
```

Covers the text parser, schedule generation logic and analytics adherence
calculation.

## Implementation status

Roadmap from [PLAN.md](../PLAN.md):

**Phase 1 — Foundation** ✅
- Auth, users, diet plans, supplements, schedule generation + cron, tracking,
  adherence analytics, notification settings.

**Phase 2 — Notifications & Tracking** ✅
- Overdue reminder cron, evening summary, stock alert cron, water/body/notes
  tracking endpoints, adherence + streak analytics.

**Phase 3 — Smart Features** ✅
- Text plan parser (meals + supplements with time/dosage extraction),
  insights engine (missed items, hydration, stock, adherence patterns),
  export report over arbitrary date range.

**Phase 4 — Polish & Launch** ⏳
- Dockerfile + docker-compose for local and prod parity ✅
- GitHub Actions CI ✅
- PDF rendering for export (deferred — JSON output is ready)
- APNs/FCM wiring (service skeleton ready, credentials deferred)
- Photo upload to S3 (endpoint exists, storage integration deferred)
- E2E tests against a disposable Postgres (deferred)
