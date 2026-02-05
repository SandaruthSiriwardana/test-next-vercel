import { NextResponse } from 'next/server'
import { sendExpiryEmail, renderVehicleExpiryTemplate } from '../../../../src/lib/mail'

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET
  const h = req.headers.get('x-cron-secret')
  console.log(`[Cron] Auth check - Header: ${h ? 'Found' : 'Missing'}, Config: ${secret ? 'Set' : 'Unset'}`)
  return secret && h === secret
}

// Keep all database calls inside the handler to avoid executing at build-time
export async function POST(req: Request) {
  try {
    console.log(`[${new Date().toISOString()}] [Cron] Daily cron job POST request received.`)
    if (!authorized(req)) {
      console.error(`[Cron] Unauthorized attempt at ${new Date().toISOString()}`)
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    console.log(`[${new Date().toISOString()}] [Cron] Daily cron job authorized and starting...`)

    const now = new Date()
    const oneDay = 24 * 3600 * 1000
    // 90 days, 30 days, 7 days, 1 day, 0 days (today)
    const targets = [
      90 * 24 * 3600 * 1000,
      30 * 24 * 3600 * 1000,
      7 * 24 * 3600 * 1000,
      1 * 24 * 3600 * 1000,
      0
    ]

    const maxWindow = new Date(now.getTime() + targets[0] + oneDay)

    // Import prisma and store at runtime
    let prisma: any;
    let store: any;
    try {
      const prismaMod = await import('../../../../src/lib/prisma')
      prisma = prismaMod.prisma
      store = await import('../../../../src/lib/store')
    } catch (e) {
      console.error("[Cron] Failed to import prisma/store:", e)
      return NextResponse.json({ error: 'Initialization failed' }, { status: 500 })
    }

    let vehicles: any[] = []
    try {
      vehicles = await prisma.vehicle.findMany({
        where: {
          OR: [
            { revenueLicenseExpiry: { gte: new Date(now.getTime() - oneDay), lte: maxWindow } },
            { insuranceExpiry: { gte: new Date(now.getTime() - oneDay), lte: maxWindow } }
          ]
        }
      })
    } catch (err) {
      console.log("[Cron] Database check failed, falling back to filesystem store.")
      const all = await store.getVehicles()
      vehicles = all.filter((v: any) => {
        const revDate = new Date(v.revenueLicenseExpiry)
        const insDate = new Date(v.insuranceExpiry)
        const minDate = new Date(now.getTime() - oneDay)
        return (revDate >= minDate && revDate <= maxWindow) || (insDate >= minDate && insDate <= maxWindow)
      })
    }

    for (const v of vehicles) {
      const checks = [
        { type: 'revenue', date: v.revenueLicenseExpiry },
        { type: 'insurance', date: v.insuranceExpiry }
      ]
      for (const c of checks) {
        const expiryDate = new Date(c.date)
        const diff = expiryDate.getTime() - now.getTime()

        for (const t of targets) {
          let match = false

          if (t === 0) {
            const expiryStr = expiryDate.toISOString().split('T')[0]
            const nowStr = now.toISOString().split('T')[0]
            if (expiryStr === nowStr) match = true
          } else {
            if (Math.abs(diff - t) < (oneDay / 2)) match = true
          }

          if (match) {
            let to = process.env.ADMIN_EMAIL || 'newsagarikadrivingschoolm@gmail.com'
            let subject = `Expiry reminder: ${v.vehicleNumber} - ${c.type} (${Math.round(t / oneDay / 1000 / 3600 / 24)} days remaining)`

            if (t === 0) {
              to = 'sandaruthsiriwardana@gmail.com'
              subject = `URGENT: Vehicle Expired Today - ${v.vehicleNumber} (${c.type})`
            }

            const html = renderVehicleExpiryTemplate(v as any, c.type)
            try {
              console.log(`[Cron] Sending email to ${to} for vehicle ${v.vehicleNumber}...`)
              await sendExpiryEmail(to, subject, html)
              console.log(`[Cron] Email sent successfully to ${to}`)
              try {
                await prisma.emailLog.create({ data: { to, subject, body: html } })
              } catch {
                await store.addEmailLog({ to, subject, body: html })
              }
            } catch (err: any) {
              console.error(`[Cron] Failed to send email to ${to}:`, err)
              const body = `FAILED: ${String(err?.message || err)}`
              try {
                await prisma.emailLog.create({ data: { to, subject, body } })
              } catch {
                await store.addEmailLog({ to, subject, body })
              }
            }
          }
        }
      }
    }

    console.log(`[${new Date().toISOString()}] [Cron] Daily cron job finished. Total vehicles checked: ${vehicles.length}`)
    return NextResponse.json({ ok: true, count: vehicles.length })
  } catch (globalErr: any) {
    console.error("[Cron] CRITICAL ERROR in handler:", globalErr)
    return NextResponse.json({ error: globalErr?.message || 'Internal Server Error' }, { status: 500 })
  }
}
