import { NextResponse } from 'next/server'
import { sendExpiryEmail, renderVehicleExpiryTemplate } from '../../../../src/lib/mail'

function authorized(req: Request) {
  // Vercel cron jobs send x-vercel-cron: 1
  const vercelCron = req.headers.get('x-vercel-cron')
  if (vercelCron === '1') {
    console.log('[Cron] Authorized via Vercel cron header')
    return true
  }

  // Fallback for manual testing with secret
  const secret = process.env.CRON_SECRET
  const h = req.headers.get('x-cron-secret')
  return secret && h === secret
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Send a monthly summary of expiries this month
  const start = new Date()
  start.setDate(1); start.setHours(0, 0, 0, 0)
  const end = new Date(start); end.setMonth(start.getMonth() + 1)

  // Import prisma at runtime to avoid initializing the PrismaClient during build
  const { prisma } = await import('../../../../src/lib/prisma')
  const vehicles = await prisma.vehicle.findMany({
    where: {
      OR: [
        { revenueLicenseExpiry: { gte: start, lt: end } },
        { insuranceExpiry: { gte: start, lt: end } }
      ]
    }
  })

  const lines = vehicles.map(v => `- ${v.vehicleNumber} | ${v.category} | ${v.location} | R:${v.revenueLicenseExpiry.toISOString().slice(0, 10)} I:${v.insuranceExpiry.toISOString().slice(0, 10)}`)
  const body = `<h3>Monthly expiry summary</h3><pre>${lines.join('\n')}</pre>`
  const to = 'sandaruthsiriwardana@gmail.com'
  await sendExpiryEmail(to, 'Monthly expiry summary', body)

  return NextResponse.json({ ok: true, count: vehicles.length })
}
