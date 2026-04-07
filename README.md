# NutriTrack

Cross-platform diet & supplement tracking app with daily timelines,
adherence analytics, insights, and coach-ready PDF exports.

- `backend/` — NestJS 10 + Prisma + PostgreSQL 16
- `mobile/` — Flutter 3 (iOS + Android) with offline-first timeline
- `web/` — Next.js 14 dashboard + coach portal
- `infra/terraform/` — AWS ECS + RDS + S3 skeleton

See [PLAN.md](./PLAN.md) for the full architecture and phase roadmap.

## Quick start

### Everything together (Docker)

```bash
docker compose up --build
```

Postgres, Redis and the API come up on ports 5432 / 6379 / 3000.
API + Swagger: `http://localhost:3000/api/docs`
Health check: `http://localhost:3000/api/health`

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev          # watches + reloads
npm test                   # unit tests
npm run test:e2e           # requires Postgres
npm run openapi:export     # writes openapi.json
```

### Web dashboard

```bash
cd web
cp .env.example .env.local
npm install
npm run dev                # http://localhost:3001
npm test                   # Vitest
```

### Mobile app

```bash
cd mobile
flutter pub get
flutter run \
  --dart-define=API_BASE_URL=http://10.0.2.2:3000/api
```

## Feature highlights

| Feature | Backend | Mobile | Web |
|---|---|---|---|
| Auth with refresh token rotation + reuse detection | ✅ | ✅ | ✅ |
| Diet plans, meals, ingredients CRUD | ✅ | ✅ | ✅ |
| Supplement plans with custom-day frequency + stock tracking | ✅ | ✅ | ✅ |
| Daily timeline generation (nightly cron + on-demand) | ✅ | ✅ | ✅ |
| Offline-first timeline with queue flush on reconnect | — | ✅ | — |
| Water, body log, daily notes tracking | ✅ | ✅ | ✅ |
| Adherence + streak + insights analytics | ✅ | ✅ | ✅ |
| Text plan parser (import from paste) | ✅ | ✅ | ✅ |
| Coach report — JSON + PDF | ✅ | — | ✅ (download + print) |
| Local notification scheduling | — | ✅ | — |
| Push notifications (FCM) | ✅ | — | — |
| Overdue + stock alert crons | ✅ | — | — |
| Rate limiting + Sentry error tracking | ✅ | ✅ | ✅ |
| EN + AR localization with RTL | — | ✅ | — |
| S3 presigned uploads for photos | ✅ | — | — |

## Deployment

Terraform skeleton in `infra/terraform/` provisions a minimal VPC,
RDS Postgres, S3 uploads bucket and ECS Fargate service behind an ALB.
See [infra/terraform/README.md](./infra/terraform/README.md) for gaps
to close before running `apply` against a real account.
