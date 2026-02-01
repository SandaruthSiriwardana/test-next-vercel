import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import * as store from '../../../../src/lib/store'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const v = await prisma.vehicle.findUnique({ where: { id: params.id } })
    if (!v) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json(v)
  } catch (err) {
    const v = await store.getVehicle(params.id)
    if (!v) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json(v)
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const data = {
    vehicleNumber: body.vehicleNumber,
    category: body.category,
    location: body.location,
    revenueLicenseExpiry: new Date(body.revenueLicenseExpiry),
    insuranceExpiry: new Date(body.insuranceExpiry),
    notes: body.notes || null
  }
  try {
    const v = await prisma.vehicle.update({ where: { id: params.id }, data })
    return NextResponse.json(v)
  } catch (err) {
    const v = await store.updateVehicle(params.id, { ...data, revenueLicenseExpiry: data.revenueLicenseExpiry.toISOString(), insuranceExpiry: data.insuranceExpiry.toISOString() })
    if (!v) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json(v)
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.vehicle.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const ok = await store.deleteVehicle(params.id)
    if (!ok) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  }
}
