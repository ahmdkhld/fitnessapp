# Free deployment guide

Walks you from a fresh GitHub push to a live NutriTrack test environment
for **$0/month**. Expect 30-45 minutes end-to-end.

## What you get

- `https://nutritrack-api.onrender.com/api` — NestJS API (Render)
- `https://nutritrack.vercel.app` — Next.js dashboard (Vercel)
- Neon Postgres (0.5 GB free, auto-pauses when idle)
- The mobile app pointed at the Render URL for local testing
- Optional extras: SMTP (Resend), FCM, Sentry, R2

All services have generous free tiers and need nothing more than a
credit-card-free signup.

## Prerequisites

- A GitHub account with the repo pushed (or a fork)
- 30-45 minutes
- No credit card required for any of the steps below

## 1. Create the Postgres database (Neon) — 5 min

1. Go to https://console.neon.tech and sign up with GitHub.
2. Create a project called `nutritrack` in the region closest to you.
3. In the dashboard, copy the **pooled** connection string. It looks like:
   ```
   postgresql://user:pass@ep-xxx-pooler.neon.tech/nutritrack?sslmode=require
   ```
4. Keep this open in a tab — you'll paste it into Render next.

> **Why pooled?** Neon scales down to zero when idle. The pooled endpoint
> handles the wake-up gracefully; the direct endpoint will time out while
> the compute is cold.

## 2. Deploy the backend (Render) — 10 min

1. Go to https://dashboard.render.com and sign up with GitHub.
2. Click **Blueprints** → **New Blueprint Instance**.
3. Connect your repo. Render reads `render.yaml` and shows one service.
4. When prompted, paste the environment values:
   - `DATABASE_URL` → the Neon pooled connection string from step 1
   - `APP_URL` → leave blank for now, we'll fill it in after Vercel
5. Click **Apply**. The first build takes 4-6 minutes.

The service is live at `https://nutritrack-api-<hash>.onrender.com`.
Verify with:

```bash
curl https://nutritrack-api-<hash>.onrender.com/api/health
```

You should see `{"status":"ok",...}` after a few seconds (cold start).

### Run the initial Prisma migration

Render free tier doesn't let you exec into the container, so we run
migrations via a **Shell** in the Render dashboard:

1. Open the nutritrack-api service → **Shell** tab.
2. Run:
   ```bash
   npx prisma migrate deploy
   ```
3. This applies the baseline migration in `backend/prisma/migrations/`.
4. Optional: seed the workouts by running the service once with
   `SKIP_WORKOUT_SEED=false` (already the default), then look for
   "Seeded 100 library exercises" in the logs.

### Promote yourself to admin

The first admin user is set by hand via Neon's SQL editor. The backend
also requires verified emails — until you wire up Resend (step 6),
the verification link only lives in the Render logs, so mark your own
row verified in the same query:

1. Register a user through the web app (after step 3 below).
2. In the Neon dashboard → **SQL Editor**, run:
   ```sql
   UPDATE users
   SET role = 'admin',
       email_verified = true,
       email_verify_token = NULL,
       email_verify_expires = NULL
   WHERE email = 'you@yourco.com';
   ```

Once Resend is wired, new signups receive a real verification email
and can click through themselves — only the first admin needs the SQL
shortcut.

## 3. Deploy the web dashboard (Vercel) — 10 min

1. Go to https://vercel.com/new and import the same repo.
2. Set the **Root Directory** to `web`.
3. Framework preset: **Next.js** (auto-detected).
4. Add environment variables (Production + Preview):
   ```
   API_BASE_URL=https://nutritrack-api-<hash>.onrender.com/api
   ```
5. Click **Deploy**. First build takes ~2 minutes.
6. Grab the Vercel URL (e.g. `https://nutritrack.vercel.app`).

### Wire the two together

Now that you have the Vercel URL, update Render:

1. Render dashboard → nutritrack-api → **Environment**.
2. Set `APP_URL` to the Vercel URL.
3. Save — Render redeploys automatically (another ~3 minutes).

## 4. Point the mobile app at the Render URL

No app store submission needed for testing — you run the app on your
own device directly.

### Android (fastest)

```bash
cd mobile
flutter pub get
flutter run \
  --dart-define=API_BASE_URL=https://nutritrack-api-<hash>.onrender.com/api
```

With a device plugged in via USB and developer mode enabled, the app
installs and runs. Every subsequent `flutter run` picks up code changes
with hot reload.

### iOS (also fast, needs a Mac)

Same `flutter run` command. First launch prompts you to trust the
developer profile in Settings → General → Device Management.

### Distributing to testers (Android APK via Firebase App Distribution)

Completely free, no Apple/Google developer account needed:

1. Go to https://console.firebase.google.com, create a project called
   `nutritrack`.
2. Add an Android app with package name `com.example.nutritrack`
   (or rename in `mobile/android/app/build.gradle`).
3. Download `google-services.json` → `mobile/android/app/`.
4. Install the Firebase CLI: `npm i -g firebase-tools`.
5. Build a release APK:
   ```bash
   flutter build apk --release \
     --dart-define=API_BASE_URL=https://nutritrack-api-<hash>.onrender.com/api
   ```
6. Upload to App Distribution:
   ```bash
   firebase appdistribution:distribute \
     build/app/outputs/flutter-apk/app-release.apk \
     --app <firebase-app-id> \
     --groups "testers" \
     --release-notes "First test build"
   ```
7. Add tester emails in the Firebase console. They get an email with
   an install link.

iOS distribution requires a $99/year Apple Developer account — not free.
Stick with Android for free testing.

## 5. Keep the backend warm (optional, 2 min)

Render free tier spins the service down after 15 minutes of inactivity.
Cold starts are ~30 seconds, which is fine for you but annoying for
testers.

1. Sign up at https://uptimerobot.com (free, 50 monitors).
2. Create an HTTP(s) monitor:
   - URL: `https://nutritrack-api-<hash>.onrender.com/api/health/live`
   - Interval: 5 minutes
3. The service stays warm forever.

Also gives you free uptime alerts if Render hiccups.

## 6. Optional paid-feature-for-free extras

### Email (password reset, coach invites) — Resend

Free: 100 emails/day, 3000/month. No card.

1. Sign up at https://resend.com.
2. Add and verify your domain (or use `onresend.com` subdomain for testing).
3. Generate an API key.
4. In Render, add env vars:
   ```
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=resend
   SMTP_PASS=<api-key>
   SMTP_FROM=NutriTrack <onboarding@resend.dev>
   ```
5. Save. Password reset emails + coach invites now deliver for real.

### File uploads (body log photos) — Cloudflare R2

Free: 10 GB storage, 1M writes/month, zero egress fees.

1. Sign up at https://dash.cloudflare.com → **R2**.
2. Create a bucket called `nutritrack-uploads`.
3. **Settings** → **CORS Policy** → paste:
   ```json
   [
     {
       "AllowedOrigins": ["https://nutritrack.vercel.app", "*"],
       "AllowedMethods": ["PUT", "GET"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```
4. **R2 API Tokens** → create a token scoped to the bucket.
5. In Render, add:
   ```
   S3_BUCKET=nutritrack-uploads
   S3_REGION=auto
   S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
   AWS_ACCESS_KEY_ID=<access-key>
   AWS_SECRET_ACCESS_KEY=<secret-key>
   S3_PUBLIC_BASE=https://pub-<hash>.r2.dev
   ```
6. Enable the R2 public bucket URL so photos are readable.

### Push notifications — Firebase FCM

Free forever.

1. Still in the Firebase project from step 4, enable **Cloud Messaging**.
2. **Project Settings** → **Service Accounts** → **Generate new private key**.
3. Open the JSON, copy these three values into Render:
   ```
   FCM_PROJECT_ID=<project_id>
   FCM_CLIENT_EMAIL=<client_email>
   FCM_PRIVATE_KEY=<private_key with literal \n escapes>
   ```
   Wrap the private key in double quotes in the Render UI so the `\n`
   survive. The backend replaces `\\n` with real newlines at boot.
4. Register devices from the mobile app (the repository already calls
   `/notifications/register-device` on login).

### Crash reporting — Sentry

Free: 5K events/month across all three projects.

1. https://sentry.io/signup → create three projects: backend (Node.js),
   web (Next.js), mobile (Flutter).
2. Copy each DSN.
3. Render env: `SENTRY_DSN=<backend-dsn>`.
4. Vercel env: `SENTRY_DSN=<web-dsn>` + `NEXT_PUBLIC_SENTRY_DSN=<web-dsn>`.
5. Mobile: add `--dart-define=SENTRY_DSN=<mobile-dsn>` to your
   `flutter run` / `flutter build` commands.

## Troubleshooting

### "Service failed to bind to port" on Render
The Dockerfile exposes 3000 but Render passes a different `PORT`. The
backend already reads `process.env.PORT` — nothing to fix. If you see
this on a fresh deploy, double-check the blueprint applied cleanly.

### First request takes 30+ seconds
Render free tier cold start. Set up UptimeRobot (step 5) to keep it
warm.

### Neon "database is starting" errors
Neon auto-pauses after ~5 min idle. The pooled connection string
handles wake-up gracefully; if you're using the **direct** string you'll
see these. Swap to the pooled endpoint.

### Prisma migrate fails with "pgcrypto extension not found"
Neon preinstalls `pgcrypto` in the `public` schema. The baseline
migration uses `CREATE EXTENSION IF NOT EXISTS pgcrypto`, which
succeeds on a fresh Neon project. If you hit this, open the Neon SQL
editor and run the `CREATE EXTENSION` statement manually once.

### Web login says "API 401"
The Vercel proxy route uses `process.env.API_BASE_URL`. Make sure it's
set in **both** Production and Preview environments in Vercel, and that
it ends with `/api`.

### Mobile can't reach the backend from a real device
Android emulator uses `10.0.2.2` to reach the host machine's localhost,
but a real phone needs the public Render URL. Always pass
`--dart-define=API_BASE_URL=https://...` for device testing.

### CI is failing on Dependabot PRs
Dependabot opens update branches against the default branch. The
backend workflow runs migrations + tests against a real Postgres; if a
Prisma bump changes the client, the migrations need regenerating. Merge
or close the Dependabot PR and re-run the workflow.

## When you outgrow the free tier

| Bottleneck | Next step | Cost |
|---|---|---|
| Cold starts annoying testers | Render Starter plan ($7/mo) | — |
| Neon 0.5 GB full | Neon Scale ($19/mo) | — |
| Vercel bandwidth | Vercel Pro ($20/mo) | Unlikely at this scale |
| 100 emails/day cap | Resend Pro ($20/mo) for 50K | — |
| iOS testers | Apple Developer ($99/year) | Required for TestFlight |
| Real domain | Namecheap ~$10/year | Optional |

Everything else (FCM, R2, Sentry, Firebase App Distribution) stays free
well past a few thousand test users.

## TL;DR

```
Neon  →  create project, copy pooled URL
Render → blueprint deploy, paste DATABASE_URL, wait 5 min
Vercel → import repo with root = web/, paste API_BASE_URL, deploy
Render → set APP_URL to Vercel URL, save
Render shell → npx prisma migrate deploy
Neon SQL editor → UPDATE users SET role='admin' WHERE email='you@...'
Phone → flutter run --dart-define=API_BASE_URL=https://.../api
```

Done.
