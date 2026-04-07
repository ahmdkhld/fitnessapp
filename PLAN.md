# NutriTrack — Full Development Plan

## Technology Stack

| Layer               | Technology                            | Purpose                                           |
|---------------------|---------------------------------------|---------------------------------------------------|
| Mobile App          | Flutter (Dart)                        | Cross-platform iOS & Android                      |
| Web Dashboard       | Next.js 14 (App Router)               | Admin panel, coach portal, web access             |
| Backend API         | NestJS (TypeScript)                   | REST + WebSocket API                              |
| Database            | PostgreSQL 16                         | Primary data store                                |
| ORM                 | Prisma                                | Type-safe DB access from NestJS                   |
| Cache               | Redis                                 | Session store, rate limiting, notification queues |
| Object Storage      | S3 / Cloudflare R2                    | Meal photos, body progress images, PDF uploads    |
| Push Notifications  | Firebase Cloud Messaging (FCM) + APNs | Remote push for both platforms                    |
| Local Notifications | flutter_local_notifications           | Offline-first reminders                           |
| Auth                | JWT + Refresh Tokens (NestJS Passport)| Stateless auth                                    |
| CI/CD               | GitHub Actions                        | Automated build, test, deploy                     |
| Hosting             | AWS (ECS or EC2) or Railway           | Backend + DB hosting                              |

See full plan sections: Architecture, DB Schema, Modules, Phases, Risks, MoSCoW.
This document is the source of truth for scope. Implementation lives under
`backend/`, `mobile/`, and `web/`.

## Repository Layout

```
fitnessapp/
├── PLAN.md            # this file
├── README.md
├── backend/           # NestJS API + Prisma
├── mobile/            # Flutter app
└── web/               # Next.js 14 dashboard
```

## MVP Feature Priority (MoSCoW)

**Must Have (Phase 1–2):** Diet plan CRUD, supplement plan CRUD, daily
timeline, status logging, local notifications, basic dashboard with adherence %,
user auth.

**Should Have (Phase 3):** Plan upload + parsing, water tracking, body weight
logging, insights, stock alerts.

**Could Have (Phase 4+):** Workout/rest day modes, coach export PDF, symptom
tracking, smart insights.

**Won't Have (v1):** AI meal suggestions, barcode scanning, social features,
wearable integration.

## Implementation status

| Phase | Status   | Notes |
|-------|----------|-------|
| 1 — Foundation | ✅ complete | Auth + refresh rotation, users, plans, schedule engine, timeline UI, onboarding, bottom-nav shell |
| 2 — Notifications & Tracking | ✅ complete | Overdue + evening + stock crons, water/body/notes endpoints + screens, adherence + streak analytics, notification settings UI |
| 3 — Smart Features | ✅ complete | Text plan parser (with mobile + web upload screens), insights engine, coach export report, stock alerts |
| 4 — Polish & Launch | ✅ mostly complete | Docker + CI, e2e tests, throttling, presigned S3 uploads, Sentry, EN+AR localization, refresh-token rotation, web recharts. Deferred: real FCM/APNs creds, app-store submission, Drift full offline sync |
