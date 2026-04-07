# Changelog

All notable changes to NutriTrack will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added — Admin & coaching

- Admin role plus `/api/admin/users`, `/api/admin/users/:id/role`, and
  `/api/admin/stats` endpoints. New `/dashboard/admin` page to promote
  users to coach or admin and view platform totals.
- Coach role with the new `coach_links` table; `CoachModule` exposes
  `invite`, `accept`, `clients`, `coaches` and a read-only client
  summary endpoint with last-14-days adherence + workout aggregates.
  New `/dashboard/coach` and `/dashboard/coach/[clientId]` pages.

### Added — Auth

- `POST /auth/forgot-password` issuing a single-use 30-minute reset
  token, `POST /auth/reset-password` that rotates the password and
  revokes every active session.
- `POST /auth/social/:provider` for Google and Apple sign-in. Verifies
  against the provider's JWKS endpoint via `jose` when the audience
  client id is configured; falls back to a dev-only unsigned decode
  otherwise.
- `PATCH /users/me/goal` distinct endpoint.

### Added — Workouts

- Six new Prisma tables (`exercises`, `workout_plans`, `workout_days`,
  `workout_day_exercises`, `workout_sessions`, `workout_sets`,
  `personal_records`).
- 100 seeded library exercises across push/pull/legs/core/cardio/
  mobility/full_body, 6 seeded plan templates (Full Body 3×, PPL 6×,
  Upper/Lower 4×, Starting Strength, 5/3/1 BBB, Bodyweight at Home).
- Auto-progression logic, PR detector for N-RM / estimated 1RM /
  max-volume / cardio max-distance.
- First-class cardio with duration + distance fields.
- Mobile + web workout home, plans list, templates browser, plan
  detail, plan editor, session active screen, session history,
  exercise library, analytics with volume bar chart and PR list.
- Workouts emitted into the daily timeline; coach report PDF gains a
  workouts page.

### Added — Tracking

- Body log photo capture via `image_picker` and S3 presigned upload
  flow on mobile.
- Onboarding now collects body stats (height, weight, gender, DOB,
  activity, kg/lbs).
- Web pages for water, body log, daily notes, notification settings.

### Added — Plan parser

- `POST /plan-parser/upload-pdf` accepts a multipart PDF upload, runs
  the extracted text through the existing `TextParser`.

### Added — Operations

- Mailer module with SMTP transport (lazily loaded `nodemailer`),
  password-reset and coach-invite email templates. Logs to console
  when SMTP isn't configured.
- Health endpoint, Sentry exception filter, refresh-token rotation,
  rate limiting and Dependabot config (carried over from earlier
  phases but listed here for completeness).
- Terraform skeleton for VPC + RDS + S3 + ECS Fargate behind an ALB.
- GitHub Actions: backend unit + e2e against Postgres, mobile flutter
  analyze + test, web Vitest build.

### Tests

- Backend Jest: text parser, schedule generation, analytics,
  insights, export aggregation, auth rotation + reuse + logout,
  workout calculators, workout sessions PR detection +
  auto-progression.
- Backend e2e: register → me → rotate → reuse-detect → logout against
  Postgres in CI.
- Mobile: `ScheduleItem` parser, `UnitConverter`.
- Web: Vitest tests for `WeeklyAdherenceChart`, `pivotVolume` helper
  and `authedFetch` wrapper.
