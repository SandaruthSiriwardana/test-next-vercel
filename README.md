Vehicle Expiry Management - New Sagarika Driving School

- Tech: Next.js 14 (App Router), TypeScript, Tailwind, Prisma + Postgres, NextAuth, Nodemailer/Resend
- Deploy: Vercel. Use Vercel Cron to hit `/api/cron/daily` (daily) and `/api/cron/monthly` (1st of month)

Key files:
- prisma/schema.prisma - database models
- app/ - Next.js app router frontend + API routes
- src/lib/mail.ts - email sending logic (Resend preferred, fallback to SMTP)
- app/api/cron - endpoints used by Vercel Cron

Setup:
1. Copy `.env.example` to `.env` and set values (DATABASE_URL, NEXTAUTH_SECRET, SMTP or RESEND key, CRON_SECRET).
2. Run `pnpm install` or `npm install`.
3. Run `npx prisma migrate dev --name init` and `npx prisma generate`.
4. `npm run dev` to start locally.

Vercel deployment:
- Push to GitHub and import to Vercel.
- Configure environment variables in Vercel from `.env`.
- Add two Vercel Cron jobs:
  - Daily: request to `https://<YOUR_URL>/api/cron/daily` every 24 hours
  - Monthly summary: request to `https://<YOUR_URL>/api/cron/monthly` on 1st of month
  - Include header `x-cron-secret: <CRON_SECRET>` in both
