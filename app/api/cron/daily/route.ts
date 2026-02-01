import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import { sendExpiryEmail, renderVehicleExpiryTemplate } from '../../../../src/lib/mail'

const CRON_SECRET = process.env.CRON_SECRET

function authorized(req: Request) {
  const h = req.headers.get('x-cron-secret')
  return CRON_SECRET && h === CRON_SECRET
}

async function handle() {
  const now = new Date()
  const oneDay = 24 * 3600 * 1000
  const targets = [30 * 24 * 3600 * 1000, 7 * 24 * 3600 * 1000, 1 * 24 * 3600 * 1000] // ms before: 30d,7d,1d

  // Query only vehicles with expiries within the largest target window
  const maxWindow = new Date(now.getTime() + targets[0] + oneDay)
  const vehicles = await prisma.vehicle.findMany({ where: {
    OR: [
      { revenueLicenseExpiry: { gte: now, lte: maxWindow } },
      { insuranceExpiry: { gte: now, lte: maxWindow } }
    ]
  }})

  for (const v of vehicles) {
    const checks = [
      { type: 'revenue', date: v.revenueLicenseExpiry },
      { type: 'insurance', date: v.insuranceExpiry }
    ]
    for (const c of checks) {
      const diff = new Date(c.date).getTime() - now.getTime()
      for (const t of targets) {
        // Match within half a day to compensate for cron schedule timing
        if (Math.abs(diff - t) < (oneDay / 2)) {
          const subject = `Expiry reminder: ${v.vehicleNumber} - ${c.type}`
          const html = renderVehicleExpiryTemplate(v as any, c.type)
          const to = process.env.ADMIN_EMAIL || process.env.SMTP_FROM || 'admin@example.com'
          try {
            await sendExpiryEmail(to, subject, html)
            await prisma.emailLog.create({ data: { to, subject, body: html } })
          } catch (err: any) {
            // Log failure
            await prisma.emailLog.create({ data: { to, subject, body: `FAILED: ${String(err?.message || err)}` } })
          }
        }
      }
    }
  }
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  await handle()
  return NextResponse.json({ ok: true })
}
