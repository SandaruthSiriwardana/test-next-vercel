import { NextResponse } from 'next/server'
import { prisma } from '../../../../src/lib/prisma'
import * as store from '../../../../src/lib/store'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const body = await request.json()

  // Basic validation and formatting similar to POST
  const vehicleNumber = body.vehicleNumber ? String(body.vehicleNumber).trim() : undefined
  const category = body.category ? String(body.category).trim() : undefined
  const location = body.location ? String(body.location).trim() : undefined
  const revenueLicenseExpiryRaw = body.revenueLicenseExpiry
  const insuranceExpiryRaw = body.insuranceExpiry
  const notes = body.notes

  const data: any = {}
  if (vehicleNumber !== undefined) data.vehicleNumber = vehicleNumber
  if (category !== undefined) data.category = category
  if (location !== undefined) data.location = location
  if (notes !== undefined) data.notes = notes

  if (revenueLicenseExpiryRaw) {
    const d = new Date(revenueLicenseExpiryRaw)
    if (!isNaN(d.getTime())) data.revenueLicenseExpiry = d
  }

  if (insuranceExpiryRaw) {
    const d = new Date(insuranceExpiryRaw)
    if (!isNaN(d.getTime())) data.insuranceExpiry = d
  }

  try {
    try {
      const updated = await prisma.vehicle.update({
        where: { id },
        data,
      })
      return NextResponse.json(updated)
    } catch (dbError) {
      // Fallback to store if prisma fails (e.g. not configured)
      // Convert dates back to strings for JSON store if needed, or store handles generic partials?
      // store.updateVehicle expects Partial<Vehicle> where dates are strings
      const storeData: any = { ...data }
      if (data.revenueLicenseExpiry) storeData.revenueLicenseExpiry = data.revenueLicenseExpiry.toISOString()
      if (data.insuranceExpiry) storeData.insuranceExpiry = data.insuranceExpiry.toISOString()

      const updated = await store.updateVehicle(id, storeData)
      if (!updated) {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
      }
      return NextResponse.json(updated)
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update vehicle' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    try {
      await prisma.vehicle.delete({ where: { id } })
      return NextResponse.json({ success: true })
    } catch (dbError) {
      // Fallback
      const deleted = await store.deleteVehicle(id)
      if (!deleted) {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete vehicle' }, { status: 500 })
  }
}
