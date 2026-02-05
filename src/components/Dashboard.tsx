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
      setLogs(ld.slice(0, 10))
    } catch { }
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
          className="inline-flex items-center gap-2 px-3 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-medium text-sm rounded-md shadow-sm border border-[rgba(240,246,252,0.1)] transition-colors"
        >
          {/* plus icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>{showForm ? 'Close' : 'Add vehicle'}</span>
        </button>
      </div>
      {showForm && (
        <section className="bg-[#161b22] rounded-md border border-[#30363d] p-4 shadow-sm">
          <h2 className="font-semibold text-gray-100 mb-4">Add vehicle</h2>
          <VehicleForm onSaved={() => { setShowForm(false); load() }} />
        </section>
      )}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#161b22] rounded-md border border-[#30363d] shadow-sm text-gray-300">Total vehicles<br /><strong className="text-2xl text-white">{vehicles.length}</strong></div>
        <div className="p-4 bg-[#161b22] rounded-md border border-[#30363d] shadow-sm text-gray-300">Expiring this month<br /><strong className="text-2xl text-white">{expThisMonth.length}</strong></div>
        <div className="p-4 bg-[#161b22] rounded-md border border-[#30363d] shadow-sm text-gray-300">Today<br /><strong className="text-2xl text-white">{vehicles.filter(v => new Date(v.revenueLicenseExpiry).toDateString() === new Date().toDateString() || new Date(v.insuranceExpiry).toDateString() === new Date().toDateString()).length}</strong></div>
      </section>

      <section className="bg-[#161b22] rounded-md border border-[#30363d] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#30363d]">
          <h2 className="font-semibold text-gray-100 text-lg">Vehicles</h2>
        </div>

        {/* Mobile: stacked cards */}
        <div className="space-y-3 sm:hidden p-4">
          {vehicles.map(v => {
            const now = Date.now()
            const rDiff = new Date(v.revenueLicenseExpiry).getTime() - now
            const iDiff = new Date(v.insuranceExpiry).getTime() - now
            const cls = (d: number) => d < 0 ? 'text-[#ff7b72]' : d < 7 * 24 * 3600 * 1000 ? 'text-[#d29922]' : d < 30 * 24 * 3600 * 1000 ? 'text-[#eac54f]' : 'text-[#3fb950]'
            const labelCls = "text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5"
            return (
              <div key={v.id} className="p-4 bg-[#0d1117] rounded-md border border-[#30363d] shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xl font-bold text-white mb-1 tracking-tight">{v.vehicleNumber}</div>
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <span className="bg-[#21262d] px-2 py-0.5 rounded-full border border-[#30363d] text-xs text-gray-300">{v.category}</span>
                      <span className="text-gray-600">•</span>
                      <span>{v.location}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#21262d]">
                  <div>
                    <div className={labelCls}>Revenue Lic.</div>
                    <div className={`font-medium text-sm ${cls(rDiff)}`}>{new Date(v.revenueLicenseExpiry).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className={labelCls}>Insurance</div>
                    <div className={`font-medium text-sm ${cls(iDiff)}`}>{new Date(v.insuranceExpiry).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop/tablet: table view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full table-auto min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="bg-[#21262d] border-b border-[#30363d] text-gray-300 text-sm">
                <th className="px-4 py-3 font-semibold">Vehicle</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Revenue Expiry</th>
                <th className="px-4 py-3 font-semibold">Insurance Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {vehicles.map(v => {
                const now = Date.now()
                const rDiff = new Date(v.revenueLicenseExpiry).getTime() - now
                const iDiff = new Date(v.insuranceExpiry).getTime() - now
                const cls = (d: number) => d < 0 ? 'text-[#ff7b72] font-semibold' : d < 7 * 24 * 3600 * 1000 ? 'text-[#d29922] font-medium' : d < 30 * 24 * 3600 * 1000 ? 'text-[#eac54f]' : 'text-[#3fb950]'
                return (
                  <tr key={v.id} className="hover:bg-[#21262d] transition-colors group">
                    <td className="px-4 py-3 font-medium text-gray-100 group-hover:text-white">{v.vehicleNumber}</td>
                    <td className="px-4 py-3 text-gray-400">{v.category}</td>
                    <td className="px-4 py-3 text-gray-400">{v.location}</td>
                    <td className={`px-4 py-3 ${cls(rDiff)}`}>{new Date(v.revenueLicenseExpiry).toLocaleDateString()}</td>
                    <td className={`px-4 py-3 ${cls(iDiff)}`}>{new Date(v.insuranceExpiry).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-[#161b22] rounded-md border border-[#30363d] p-4 shadow-sm">
        <h2 className="font-semibold text-gray-100 mb-2">Recent email log</h2>
        <ul className="text-sm space-y-1">
          {logs.length === 0 && <li className="text-gray-500 italic">No email activity yet</li>}
          {logs.map(l => <li key={l.id} className="text-gray-400"><span className="text-gray-500">[{new Date(l.sentAt).toLocaleString()}]</span> — <span className="text-gray-300">{l.subject}</span></li>)}
        </ul>
      </section>
    </div>
  )
}
