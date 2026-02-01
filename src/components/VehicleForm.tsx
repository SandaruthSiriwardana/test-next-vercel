"use client"
import React, { useState } from "react"

type Props = { onSaved?: ()=>void }

export default function VehicleForm({ onSaved }: Props) {
  const [form, setForm] = useState({ vehicleNumber: '', category: 'Van', location: 'Malkaduwawa', revenueLicenseExpiry: '', insuranceExpiry: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      // Try to parse JSON response when available
      const contentType = res.headers.get('content-type') || ''
      let data: any = null
      if (contentType.includes('application/json')) {
        data = await res.json()
      } else {
        data = await res.text()
      }

      if (!res.ok) {
        const msg = data && typeof data === 'object' ? (data.error || data.message || JSON.stringify(data)) : String(data || `Request failed: ${res.status}`)
        throw new Error(msg)
      }

      // Clear form on success
      setForm({ vehicleNumber: '', category: 'Van', location: 'Malkaduwawa', revenueLicenseExpiry: '', insuranceExpiry: '' })
      const serverMsg = data && typeof data === 'object' && data.id ? `Saved (id: ${String(data.id).slice(0,6)})` : 'Saved successfully'
      setSuccess(serverMsg)
      onSaved?.()
    } catch (err: any) {
      // If server returned a JSON error payload this surfaces it nicely
      setError(err?.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2 max-w-md" aria-live="polite">
      <div>
        <label htmlFor="vehicleNumber" className="block text-sm">Vehicle number</label>
        <input id="vehicleNumber" value={form.vehicleNumber} onChange={e=>setForm({...form, vehicleNumber:e.target.value})} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm">Category</label>
        <select id="category" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="w-full p-2 border rounded">
          <option>Van</option>
          <option>Bike</option>
          <option>Threewheel</option>
          <option>Bus</option>
          <option>Custom</option>
        </select>
      </div>
      <div>
        <label htmlFor="location" className="block text-sm">Location</label>
        <select id="location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} className="w-full p-2 border rounded">
          <option>Malkaduwawa</option>
          <option>Alawwa</option>
          <option>Polpithigama</option>
          <option>Siyablagaskothuwa</option>
        </select>
      </div>
      <div>
        <label htmlFor="revenueLicenseExpiry" className="block text-sm">Revenue license expiry</label>
        <input id="revenueLicenseExpiry" type="date" value={form.revenueLicenseExpiry} onChange={e=>setForm({...form, revenueLicenseExpiry:e.target.value})} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label htmlFor="insuranceExpiry" className="block text-sm">Insurance expiry</label>
        <input id="insuranceExpiry" type="date" value={form.insuranceExpiry} onChange={e=>setForm({...form, insuranceExpiry:e.target.value})} className="w-full p-2 border rounded" />
      </div>
      <div>
        <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-60" aria-busy={loading}>
          {loading ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : null}
          <span>{loading ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}
    </form>
  )
}
