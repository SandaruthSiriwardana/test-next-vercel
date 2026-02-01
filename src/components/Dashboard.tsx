"use client"
import React, { useEffect, useState } from "react"
import VehicleForm from "./VehicleForm"

type Vehicle = {
  id: string
  vehicleNumber: string
  category: string
  location: string
  revenueLicenseExpiry: string
  insuranceExpiry: string
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [logs, setLogs] = useState<{ id: string; subject: string; sentAt: string }[]>([])
  const [showForm, setShowForm] = useState(false)

  async function load() {
    const res = await fetch('/api/vehicles')
    const data = await res.json()
    setVehicles(data)
    // Load email logs for quick visibility
    try {
      const lres = await fetch('/api/email-logs')
      const ld = await lres.json()
      setLogs(ld.slice(0,10))
    } catch {}
  }

  useEffect(() => { load() }, [])

  const thisMonth = new Date().getMonth()
  const expThisMonth = vehicles.filter(v => {
    const r = new Date(v.revenueLicenseExpiry).getMonth()
    const i = new Date(v.insuranceExpiry).getMonth()
    return r === thisMonth || i === thisMonth
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowForm(s => !s)}
          aria-label={showForm ? 'Close add vehicle form' : 'Add vehicle'}
          className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded shadow"
        >
          {/* plus icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>{showForm ? 'Close' : 'Add vehicle'}</span>
        </button>
      </div>
      {showForm && (
        <section className="bg-white rounded shadow p-4">
          <h2 className="font-medium mb-2">Add vehicle</h2>
          <VehicleForm onSaved={() => { setShowForm(false); load() }} />
        </section>
      )}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3 sm:p-4 bg-white rounded shadow">Total vehicles<br/><strong>{vehicles.length}</strong></div>
        <div className="p-3 sm:p-4 bg-white rounded shadow">Expiring this month<br/><strong>{expThisMonth.length}</strong></div>
        <div className="p-3 sm:p-4 bg-white rounded shadow">Today<br/><strong>{vehicles.filter(v=>new Date(v.revenueLicenseExpiry).toDateString()===new Date().toDateString()||new Date(v.insuranceExpiry).toDateString()===new Date().toDateString()).length}</strong></div>
      </section>

      <section className="bg-white rounded shadow p-4">
        <h2 className="font-medium mb-2">Vehicles</h2>

        {/* Mobile: stacked cards */}
        <div className="space-y-3 sm:hidden">
          {vehicles.map(v => {
            const now = Date.now()
            const rDiff = new Date(v.revenueLicenseExpiry).getTime() - now
            const iDiff = new Date(v.insuranceExpiry).getTime() - now
            const cls = (d:number) => d < 0 ? 'text-red-400' : d < 7*24*3600*1000 ? 'text-orange-400' : d < 30*24*3600*1000 ? 'text-yellow-300' : 'text-green-300'
            return (
              <div key={v.id} className="p-3 bg-slate-900 rounded border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-slate-400">{v.id.slice(0,6)}</div>
                  <div className="text-xs text-slate-400">{v.location}</div>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-lg font-medium text-white">{v.vehicleNumber}</div>
                    <div className="text-sm text-slate-300">{v.category}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className={`${cls(rDiff)}`}>R: {new Date(v.revenueLicenseExpiry).toLocaleDateString()}</div>
                    <div className={`${cls(iDiff)}`}>I: {new Date(v.insuranceExpiry).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop/tablet: table view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full table-auto min-w-[640px]">
            <thead>
              <tr className="text-left">
                <th className="p-2">#</th>
                <th className="p-2">Vehicle</th>
                <th className="p-2">Category</th>
                <th className="p-2">Location</th>
                <th className="p-2">Revenue Expiry</th>
                <th className="p-2">Insurance Expiry</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => {
                const now = Date.now()
                const rDiff = new Date(v.revenueLicenseExpiry).getTime() - now
                const iDiff = new Date(v.insuranceExpiry).getTime() - now
                const cls = (d:number) => d < 0 ? 'text-red-600' : d < 7*24*3600*1000 ? 'text-orange-600' : d < 30*24*3600*1000 ? 'text-yellow-700' : 'text-green-600'
                return (
                  <tr key={v.id} className="border-t">
                    <td className="p-2">{v.id.slice(0,6)}</td>
                    <td className="p-2">{v.vehicleNumber}</td>
                    <td className="p-2">{v.category}</td>
                    <td className="p-2">{v.location}</td>
                    <td className={`p-2 ${cls(rDiff)}`}>{new Date(v.revenueLicenseExpiry).toLocaleDateString()}</td>
                    <td className={`p-2 ${cls(iDiff)}`}>{new Date(v.insuranceExpiry).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded shadow p-4">
        <h2 className="font-medium mb-2">Recent email log</h2>
        <ul className="text-sm">
          {logs.length === 0 && <li className="text-gray-500">No email activity yet</li>}
          {logs.map(l => <li key={l.id}>{new Date(l.sentAt).toLocaleString()} — {l.subject}</li>)}
        </ul>
      </section>
    </div>
  )
}
