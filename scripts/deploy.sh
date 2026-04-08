#!/usr/bin/env bash
set -euo pipefail

# ── NutriTrack Deployment Script ─────────────────────────
# Run from repo root:  bash scripts/deploy.sh
#
# Reads credentials from scripts/.env.deploy (gitignored).
# Copy scripts/.env.deploy.example and fill in your values.
#
# Prerequisites: npm i -g vercel, Node.js >= 18

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.deploy"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found."
  echo "Copy scripts/.env.deploy.example → scripts/.env.deploy and fill in values."
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

: "${RENDER_URL:?Set RENDER_URL in .env.deploy}"
: "${NEON_URL:?Set NEON_URL in .env.deploy}"
: "${VERCEL_TOKEN:?Set VERCEL_TOKEN in .env.deploy}"

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║     NutriTrack Deployment                     ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# ── Step 1: Run Prisma migrations against Neon ──────────
echo "▸ Step 1/3: Running Prisma migrations..."
cd backend
npm install --silent
DATABASE_URL="$NEON_URL" npx prisma migrate deploy
echo "  ✓ Migrations applied"
cd ..

# ── Step 2: Deploy web to Vercel ────────────────────────
echo ""
echo "▸ Step 2/3: Deploying web dashboard to Vercel..."
cd web
npm install --silent

# Link project (first time creates it)
vercel link --yes --token "$VERCEL_TOKEN" 2>/dev/null || true

# Set environment variables
vercel env rm API_BASE_URL production --yes --token "$VERCEL_TOKEN" 2>/dev/null || true
echo "${RENDER_URL}/api" | vercel env add API_BASE_URL production --token "$VERCEL_TOKEN"

# Deploy to production
vercel --prod --yes --token "$VERCEL_TOKEN"
echo "  ✓ Web deployed"
cd ..

# ── Step 3: Render env vars reminder ────────────────────
echo ""
echo "▸ Step 3/3: Render backend configuration"
echo ""
echo "  Set these environment variables in the Render dashboard"
echo "  (https://dashboard.render.com → fitnessapp → Environment):"
echo ""
echo "  DATABASE_URL  = <your Neon connection string>"
echo "  CORS_ORIGINS  = <your Vercel URL>"
echo "  APP_URL       = <your Vercel URL>"
echo ""
echo "  Then trigger a manual deploy in Render."
echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║  Deployment complete!                         ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "  1. Set Render env vars (Step 3 above)"
echo "  2. Visit ${RENDER_URL}/api/health/live to wake the backend"
echo "  3. Open your Vercel URL to use the app"
echo "  4. Create first admin: see DEPLOY.md"
