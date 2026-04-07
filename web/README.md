# NutriTrack Web (Next.js 14)

Web dashboard and (eventually) coach portal for NutriTrack.

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Runs on `http://localhost:3001`. Talks to the NestJS API at
`http://localhost:3000/api` by default.

## App router layout

```
app/
├── layout.tsx
├── page.tsx                    # marketing/landing
├── (auth)/login/page.tsx
└── (dashboard)/
    ├── layout.tsx              # sidebar nav
    └── dashboard/
        ├── page.tsx            # overview
        └── timeline/page.tsx
```

## Status

Phase 1 scaffolding only — pages render placeholder content. The next step is
wiring a typed API client and rendering live schedule + analytics data from the
NestJS backend.
