# Contributing to NutriTrack

Thanks for taking the time to dig in. This file documents the day-to-day
workflow so new contributors aren't blocked on tribal knowledge.

## Repo layout

```
backend/   NestJS 10 + Prisma 5 API
mobile/    Flutter 3 (BLoC, go_router)
web/       Next.js 14 (App Router, server actions)
infra/     Terraform skeleton + docker-compose at the root
```

See [PLAN.md](./PLAN.md) for the architecture and roadmap, and
[README.md](./README.md) for the feature matrix.

## Local setup

The fastest path is Docker Compose at the root:

```bash
docker compose up --build
```

This runs Postgres, Redis and the API. Then bring up the web and
mobile apps from their own folders:

```bash
cd web && cp .env.example .env.local && npm install && npm run dev
cd mobile && flutter pub get && flutter run \
  --dart-define=API_BASE_URL=http://10.0.2.2:3000/api
```

Each app's README documents the specific commands.

## Branch naming

Default branch is `claude/nutritrack-full-stack-D8zvm`. Feature work
should land via short-lived branches:

```
feat/<area>-<thing>
fix/<area>-<thing>
chore/<area>-<thing>
```

## Commit messages

We follow a soft Conventional Commits style — short subject, blank
line, then a body that explains the *why* and notable choices.

```
Add coach portal read-only client summary

Coaches need a way to monitor adherence + workouts without granting
write access. New CoachModule introduces an invite/accept flow over
the new coach_links table and a clientSummary endpoint that the web
portal renders read-only.
```

## Tests before opening a PR

| App | Command |
|---|---|
| Backend unit | `cd backend && npm test` |
| Backend e2e (needs Postgres) | `cd backend && npm run test:e2e` |
| Mobile | `cd mobile && flutter test && flutter analyze` |
| Web | `cd web && npm run lint && npm test && npm run build` |

CI runs the same suites — the goal is for `git push` not to be a guess
about whether the workflow will go green.

## Database changes

Every schema change goes through Prisma:

```bash
cd backend
# Edit prisma/schema.prisma, then:
npx prisma migrate dev --name <descriptive-name>
```

Commit the generated `migrations/` folder along with the schema diff.
Never hand-edit migration SQL after it's been pushed to a deployed
environment.

## Adding endpoints

1. Add a DTO in `src/modules/<area>/dto/` with `class-validator` rules.
2. Add a method to the service.
3. Wire a controller route guarded by `JwtAuthGuard`.
4. Add a unit test next to the service if there's any logic worth
   covering — pure functions live in `calculators.ts`-style files for
   easy mocking.
5. Run `npm run openapi:export` and bump any generated client.

## Adding mobile screens

- New repository in `lib/features/<area>/repositories/`.
- Bloc + state + event in `bloc/`.
- Screen in `screens/`.
- Register the repository in `lib/core/di/injection.dart`.
- Add a route in `lib/navigation/app_router.dart`.
- Stub localized strings in both `lib/l10n/app_en.arb` and
  `lib/l10n/app_ar.arb`.

## Adding web pages

- Server-component pages live under `app/(dashboard)/dashboard/<area>/`.
- Mutations go in `actions.ts` next to the page, marked `'use server'`.
- Use `authedFetch` from `lib/server-fetch.ts` so the bearer token is
  attached automatically.

## Code review

We're a small team — every PR gets a review. Reviewers focus on:

- Does the change have tests where the logic is non-trivial?
- Are there hidden side effects on other modules (e.g. schedule,
  analytics, coach summary)?
- Is the smallest change possible? Refactors should be in their own
  commit.

## Reporting bugs / requesting features

File an issue with the steps to reproduce and the expected vs actual
behaviour. For features, link to the relevant PLAN.md section if there
is one.

## Code of conduct

Be kind. Assume good intent. We don't have a formal CoC document yet
but we expect contributors to behave like adults at a professional
workplace.
