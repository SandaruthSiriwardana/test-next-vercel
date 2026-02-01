import { NextResponse } from 'next/server'
import { prisma } from '../../../src/lib/prisma'
import * as store from '../../../src/lib/store'

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(vehicles)
  } catch (err) {
    // Fallback to filesystem store when database is not configured
    const vehicles = await store.getVehicles()
    return NextResponse.json(vehicles)
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  // Basic validation
  const vehicleNumber = String(body.vehicleNumber ?? '').trim()
  const category = String(body.category ?? '').trim()
  const location = String(body.location ?? '').trim()
  const revenueLicenseExpiryRaw = body.revenueLicenseExpiry
  const insuranceExpiryRaw = body.insuranceExpiry
  const notes = body.notes ?? null

  if (!vehicleNumber) return NextResponse.json({ error: 'vehicleNumber is required' }, { status: 400 })
  if (!category) return NextResponse.json({ error: 'category is required' }, { status: 400 })
  if (!location) return NextResponse.json({ error: 'location is required' }, { status: 400 })
  if (!revenueLicenseExpiryRaw) return NextResponse.json({ error: 'revenueLicenseExpiry is required' }, { status: 400 })
  if (!insuranceExpiryRaw) return NextResponse.json({ error: 'insuranceExpiry is required' }, { status: 400 })

  const revenueDate = new Date(revenueLicenseExpiryRaw)
  const insuranceDate = new Date(insuranceExpiryRaw)
  if (isNaN(revenueDate.getTime())) return NextResponse.json({ error: 'revenueLicenseExpiry is not a valid date' }, { status: 400 })
  if (isNaN(insuranceDate.getTime())) return NextResponse.json({ error: 'insuranceExpiry is not a valid date' }, { status: 400 })

  try {
    const data = {
      vehicleNumber,
      category,
      location,
      revenueLicenseExpiry: revenueDate,
      insuranceExpiry: insuranceDate,
      notes,
    }
    try {
      const v = await prisma.vehicle.create({ data })
      return NextResponse.json(v, { status: 201 })
    } catch (err) {
      // If prisma isn't configured, fall back to filesystem
      const v = await store.createVehicle({ ...data, revenueLicenseExpiry: revenueDate.toISOString(), insuranceExpiry: insuranceDate.toISOString() })
      return NextResponse.json(v, { status: 201 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Failed to create vehicle' }, { status: 500 })
  }
}
