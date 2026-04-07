# NutriTrack

Cross-platform diet & supplement tracking app with daily schedule,
adherence analytics, and coach-ready exports.

- `backend/` — NestJS + Prisma + PostgreSQL API
- `mobile/` — Flutter (iOS/Android) app
- `web/` — Next.js 14 dashboard

See [PLAN.md](./PLAN.md) for the full architecture and phased roadmap.

## Quick start

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev
```

API runs at `http://localhost:3000`. Swagger docs at `/api/docs`.

### Web dashboard

```bash
cd web
cp .env.example .env.local
npm install
npm run dev
```

Runs at `http://localhost:3001`.

### Mobile app

```bash
cd mobile
flutter pub get
flutter run
```
