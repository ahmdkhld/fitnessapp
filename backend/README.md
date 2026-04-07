# NutriTrack Backend (NestJS)

REST API for the NutriTrack diet & supplement tracking app.

## Stack

- **NestJS 10** + TypeScript
- **Prisma** ORM with **PostgreSQL 16**
- **JWT** auth (access + refresh tokens)
- **Swagger** docs at `/api/docs`
- **@nestjs/schedule** for nightly schedule generation cron

## Module overview

| Module          | Responsibility                                              |
|-----------------|-------------------------------------------------------------|
| `auth`          | Register, login, refresh, JWT strategy                      |
| `users`         | Profile + body stats CRUD                                   |
| `diet-plans`    | Diet plans, meals, ingredients                              |
| `supplements`   | Supplement plans + scheduled supplements                    |
| `schedule`      | Daily timeline generation, status updates, nightly cron     |
| `tracking`      | Water logs, body logs, daily notes                          |
| `analytics`     | Adherence %, streaks                                        |
| `notifications` | Device registration, settings, push delivery (stub)         |

## Setup

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

API: `http://localhost:3000/api`
Swagger: `http://localhost:3000/api/docs`

## Implementation status

Phase 1 of [PLAN.md](../PLAN.md) is scaffolded:
- [x] Auth (register/login/refresh)
- [x] Users + profiles
- [x] Diet plans + meals + ingredients
- [x] Supplement plans + supplements
- [x] Schedule generation + status updates + nightly cron
- [x] Water/body/notes tracking
- [x] Adherence + streak analytics
- [x] Notification settings (FCM delivery is a stub)
- [ ] Plan parser (Phase 3)
- [ ] PDF export (Phase 3)
- [ ] Insights engine (Phase 3)
