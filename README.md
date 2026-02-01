NSDS Vehicle Expiry — Ready for GitHub & Vercel

What this repository contains
- Next.js 14 (App Router) TypeScript app for managing vehicle expiries for New Sagarika Driving School
- Tailwind CSS UI (mobile-first)
- Simple filesystem fallback store (no DB required) plus Prisma-ready schema if you opt for Postgres
- Resend (preferred) with Nodemailer SMTP fallback for sending emails
- Vercel Cron endpoints: `/api/cron/daily` and `/api/cron/monthly`

Quick start (local)
1. Copy environment variables: `cp .env.example .env.local` and edit values.
2. Install dependencies: `npm install --legacy-peer-deps`
3. Run dev server: `npm run dev` and open `http://localhost:3000` (or port shown).

Notes about persistence and production
- This repo includes a filesystem-based store (`data/vehicles.json`) used when no `DATABASE_URL` is configured. This is convenient for demos but NOT suitable for production on Vercel (serverless instances are ephemeral).
- For production use, provision a Postgres database (Vercel Postgres recommended), set `DATABASE_URL`, and run Prisma migrations:
  - `npx prisma migrate deploy`
  - `npx ts-node --esm prisma/seed.ts` (optional seed)

Environment variables
Create these in Vercel dashboard or local `.env.local`:
- DATABASE_URL (optional; set for Postgres in production)
- RESEND_API_KEY (recommended) — if present Resend is used
- SMTP_URL (fallback) — e.g. `smtp://user:pass@smtp.example.com:587`
- SMTP_FROM (optional) — email from address
- ADMIN_EMAIL — recipient for cron notifications
- CRON_SECRET — secret value sent in `x-cron-secret` header for cron endpoints
- NEXTAUTH_URL, NEXTAUTH_SECRET (not required unless enabling auth)

Vercel deployment & Cron Jobs
1. Import this GitHub repo into Vercel. Set the environment variables above in the Vercel project settings.
2. Configure two Vercel Cron Jobs (in Vercel dashboard -> Cron Jobs):
   - Daily job: POST to `https://<your-deployment>/api/cron/daily` every day at 00:05 with header `x-cron-secret: <CRON_SECRET>`.
   - Monthly job: POST to `https://<your-deployment>/api/cron/monthly` on the 1st of month at 00:10 with the same header.

Preparing to push
1. Check files and run tests locally: `npm test` (CI runs tests on push).
2. Commit and push:
   - git add .
   - git commit -m "chore: prepare repo for deployment"
   - git push origin main

CI
- A GitHub Actions workflow is included at `.github/workflows/ci.yml` which runs `npm ci` and `npm test` on push and PR.

Security
- Protect your `CRON_SECRET` and email API keys. Rotate keys if compromised.

If you prefer, I can:
1) Create the Git commit and push to a repository you provide access to (you must give a remote URL), or
2) Guide you through the exact git commands to run locally.
