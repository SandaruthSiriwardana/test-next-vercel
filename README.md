# NSDS Vehicle Expiry System

A comprehensive system for managing vehicle revenue licenses and insurance expiries for **New Sagarika Driving School**.

## Features

-   **Interactive Dashboard**:
    -   **One-Click Filtering**: Instantly filter by "Today", "This Month", or "Total" via interactive stats panels.
    -   **Smart Views**: Automatically highlights *exactly* which document (Revenue or Insurance) is expiring.
    -   **Premium UI**: Features `Inter` typography, smooth animations, and clean dark mode aesthetics.
    -   **Real-time Feedback**: Beautiful toast notifications for all actions.

-   **Automated Notifications**:
    -   **Daily Cron Job**: Checks for expired vehicles every day at 20:30 UTC.
    -   **Smart Alerts**: Sends emails for imminent expiries (90, 30, 7, 1 days) and immediate expiries.
    -   **Monthly Summaries**: detailed monthly report of all upcoming expiries.

-   **Tech Excellence**:
    -   **Framework**: Next.js 14 (App Router)
    -   **Database**: PostgreSQL / PrismaORM
    -   **Styling**: Tailwind CSS + Framer Motion
    -   **Deployment**: Vercel Serverless

## Getting Started

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/SandaruthSiriwardana/test-next-vercel.git
    cd test-next-vercel
    npm install
    ```

2.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Visit [http://localhost:3000](http://localhost:3000).

3.  **Test Email**:
    -   Click the "Test Email" button on the dashboard to verify your email configuration locally.

## Deployment on Vercel

The project is optimized for Vercel.
-   **Cron Jobs**: Automatically configured via `vercel.json`.
-   **Environment**: ensuring `DATABASE_URL` and `RESEND_API_KEY` are set in Vercel Project Settings.

---
**Version 1.0.0** | Developed by Sandaruth Siriwardana
