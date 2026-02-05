"use client"
import React, { useState } from "react"

type Props = {
  onSaved?: () => void
  initialData?: any
}

export default function VehicleForm({ onSaved, initialData }: Props) {
  const [form, setForm] = useState({
    vehicleNumber: initialData?.vehicleNumber || '',
    category: initialData?.category || 'Van',
    location: initialData?.location || 'Malkaduwawa',
    revenueLicenseExpiry: initialData?.revenueLicenseExpiry ? new Date(initialData.revenueLicenseExpiry).toISOString().split('T')[0] : '',
    insuranceExpiry: initialData?.insuranceExpiry ? new Date(initialData.insuranceExpiry).toISOString().split('T')[0] : ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const url = initialData?.id ? `/api/vehicles/${initialData.id}` : '/api/vehicles'
      const method = initialData?.id ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
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

      // Clear form on success only if adding new
      if (!initialData) {
        setForm({ vehicleNumber: '', category: 'Van', location: 'Malkaduwawa', revenueLicenseExpiry: '', insuranceExpiry: '' })
      }
      const serverMsg = initialData ? 'Vehicle updated successfully' : (data && typeof data === 'object' && data.id ? `Saved (id: ${String(data.id).slice(0, 6)})` : 'Saved successfully')
      setSuccess(serverMsg)

      // Delay closing to show success message
      setTimeout(() => {
        onSaved?.()
      }, 1000)
    } catch (err: any) {
      setError(err?.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full p-2.5 bg-[#0d1117] border border-[#30363d] rounded-md text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
  const labelClass = "block text-sm font-medium text-gray-300 mb-1"

  return (
    <form onSubmit={submit} className="space-y-4 w-full" aria-live="polite">
      <div>
        <label htmlFor="vehicleNumber" className={labelClass}>වාහන අංකය</label>
        <input id="vehicleNumber" value={form.vehicleNumber} onChange={e => setForm({ ...form, vehicleNumber: e.target.value })} className={inputClass} placeholder="උදා. ABC-1234" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className={labelClass}>වර්ගය</label>
          <select id="category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
            <option>Van</option>
            <option>Bike</option>
            <option>Threewheel</option>
            <option>Bus</option>
            <option>Custom</option>
          </select>
        </div>
        <div>
          <label htmlFor="location" className={labelClass}>ස්ථානය</label>
          <select id="location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputClass}>
            <option>Malkaduwawa</option>
            <option>Alawwa</option>
            <option>Polpithigama</option>
            <option>Siyablagaskothuwa</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="revenueLicenseExpiry" className={labelClass}>ආදායම් බලපත්‍ර කල් ඉකුත් වීම</label>
          <input id="revenueLicenseExpiry" type="date" value={form.revenueLicenseExpiry} onChange={e => setForm({ ...form, revenueLicenseExpiry: e.target.value })} className={inputClass} style={{ colorScheme: 'dark' }} />
        </div>
        <div>
          <label htmlFor="insuranceExpiry" className={labelClass}>රක්ෂණ කල් ඉකුත් වීම</label>
          <input id="insuranceExpiry" type="date" value={form.insuranceExpiry} onChange={e => setForm({ ...form, insuranceExpiry: e.target.value })} className={inputClass} style={{ colorScheme: 'dark' }} />
        </div>
      </div>

      <div className="pt-2">
        <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-md shadow disabled:opacity-60 transition-colors" aria-busy={loading}>
          {loading ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : null}
          <span>{loading ? 'Saving...' : (initialData ? 'Update Vehicle' : 'Save Vehicle')}</span>
        </button>
      </div>
      {error && <div className="p-3 bg-red-900/30 border border-red-800 text-sm text-red-200 rounded-md">{error}</div>}
      {success && <div className="p-3 bg-green-900/30 border border-green-800 text-sm text-green-200 rounded-md">{success}</div>}
    </form>
  )
}
