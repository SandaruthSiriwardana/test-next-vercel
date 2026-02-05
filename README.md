# NSDS Vehicle Expiry System

A comprehensive system for managing vehicle revenue licenses and insurance expiries for **New Sagarika Driving School**.

## Features

- **Dashboard**: 
  - View all vehicles and their expiry statuses at a glance.
  - Color-coded indicators (Green = Safe, Yellow = Warning, Red = Expired).
  - Add, Edit, and Delete vehicle records.
- **Automated Notifications**:
  - Daily Cron Job checks for expired vehicles.
  - Sends email alerts to the administrator for:
    - Imminent expiries (90, 30, 7, 1 days remaining).
    - Expired items (0 days / Today).
- **Responsive UI**:
  - Dark mode design inspired by modern development tools.
  - Fully responsive for Mobile, Tablet, and Desktop.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PrismaORM (Supports PostgreSQL / SQLite)
- **Deployment**: [Vercel](https://vercel.com/)
- **Email**: Resend (with SMTP fallback)

## Getting Started

### Prerequisites

- Node.js 18+ installed.
- A Vercel account (for deployment).

### Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/SandaruthSiriwardana/test-next-vercel.git
    cd test-next-vercel
    ```

2.  **Install dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Configure Environment Variables**:
    Copy `.env.example` to `.env.local` and set the following:
    ```env
    # Database
    DATABASE_URL="postgresql://..." # Or use local SQLite for dev

    # Email (Resend Recommended)
    RESEND_API_KEY="re_..."
    ADMIN_EMAIL="your-email@example.com"
    
    # Cron Security
    CRON_SECRET="your_random_secret_string"
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

1.  **Push to GitHub**: Ensure your code is pushed to your repository.
2.  **Import to Vercel**: Connect your GitHub repo in Vercel.
3.  **Environment Variables**: Add the variables from your `.env.local` to the Project Settings > Environment Variables.
4.  **Cron Jobs**:
     - The cron schedule is defined in `vercel.json`.
     - Vercel automatically detects this configuration upon deployment.
     - **Default Schedule**: Daily at 02:00 AM Sri Lanka Time (`30 20 * * *` UTC).

## Troubleshooting Emails

If emails are not sending:
1.  Check the **Vercel Function Logs** for `api/cron/daily`.
2.  Verify `RESEND_API_KEY` or SMTP settings are correct.
3.  Ensure the **Cron Job** ran successfully (Status 200).
4.  Check Spam/Junk folders.

## Credits

Developed by **Sandaruth Siriwardana**.
Version 0.1.0
