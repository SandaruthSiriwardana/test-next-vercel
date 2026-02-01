import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams
  const where: any = {}
  const filters:any[] = []

  if (q.get('location')) filters.push({ location: q.get('location') })
  if (q.get('category')) filters.push({ category: q.get('category') })
  if (q.get('expiryMonth')) {
    const m = Number(q.get('expiryMonth'))
    if (!Number.isNaN(m)) {
      const now = new Date()
      const start = new Date(now.getFullYear(), m - 1, 1)
      const end = new Date(now.getFullYear(), m, 1)
      filters.push({ OR: [ { revenueLicenseExpiry: { gte: start, lt: end } }, { insuranceExpiry: { gte: start, lt: end } } ] })
    }
  }

  if (filters.length) where.AND = filters

  const order = q.get('order') === 'asc' ? 'asc' : 'desc'

  const vehicles = await prisma.vehicle.findMany({ where, orderBy: { createdAt: order } })
  return NextResponse.json(vehicles)
}
