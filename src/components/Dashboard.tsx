"use client"
import React, { useEffect, useState } from "react"
import VehicleForm from "./VehicleForm"
import EmailLogs from "./EmailLogs"


type Vehicle = {
  id: string
  vehicleNumber: string
  category: string
  location: string
  revenueLicenseExpiry: string
  insuranceExpiry: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd}`
}

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/vehicles')
    const data = await res.json()
    setVehicles(data)
  }

  useEffect(() => { load() }, [])

  function handleEdit(v: Vehicle) {
    setEditingVehicle(v)
    setShowForm(true)
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await fetch(`/api/vehicles/${deleteId}`, { method: 'DELETE' })
      setDeleteId(null)
      load()
    } catch (e) {
      alert('Failed to delete')
    }
  }

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
          onClick={() => {
            setEditingVehicle(null)
            setShowForm(true)
          }}
          className="inline-flex items-center gap-2 px-3 py-2 font-medium text-sm rounded-md shadow-sm border border-[rgba(240,246,252,0.1)] transition-colors text-white bg-[#238636] hover:bg-[#2ea043]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add vehicle</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="font-semibold text-gray-100 mb-6 text-xl">{editingVehicle ? `Edit ${editingVehicle.vehicleNumber}` : 'Add vehicle'}</h2>

            <VehicleForm
              key={editingVehicle?.id || 'new'}
              initialData={editingVehicle}
              onSaved={() => { setShowForm(false); setEditingVehicle(null); load() }}
            />
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#161b22] rounded-md border border-[#30363d] shadow-sm text-gray-300">මුළු වාහන<br /><strong className="text-2xl text-white">{vehicles.length}</strong></div>
        <div className="p-4 bg-[#161b22] rounded-md border border-[#30363d] shadow-sm text-gray-300">මෙම මාසයේ කල් ඉකුත් වන<br /><strong className="text-2xl text-white">{expThisMonth.length}</strong></div>
        <div className="p-4 bg-[#161b22] rounded-md border border-[#30363d] shadow-sm text-gray-300">අද<br /><strong className="text-2xl text-white">{vehicles.filter(v => new Date(v.revenueLicenseExpiry).toDateString() === new Date().toDateString() || new Date(v.insuranceExpiry).toDateString() === new Date().toDateString()).length}</strong></div>
      </section>

      <section className="bg-[#161b22] rounded-md border border-[#30363d] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#30363d]">
          <h2 className="font-semibold text-gray-100 text-lg">වාහන ලැයිස්තුව</h2>
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
              <div key={v.id} className="p-4 bg-[#0d1117] rounded-md border border-[#30363d] shadow-sm relative">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xl font-bold text-white mb-1 tracking-tight">{v.vehicleNumber}</div>
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <span className="bg-[#21262d] px-2 py-0.5 rounded-full border border-[#30363d] text-xs text-gray-300">{v.category}</span>
                      <span className="text-gray-600">•</span>
                      <span>{v.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(v)} className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-[#21262d] rounded transition-colors" aria-label="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => setDeleteId(v.id)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-[#21262d] rounded transition-colors" aria-label="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#21262d]">
                  <div>
                    <div className={labelCls}>ආදායම් බලපත්‍රය</div>
                    <div className={`font-medium text-sm ${cls(rDiff)}`}>{formatDate(v.revenueLicenseExpiry)}</div>
                  </div>
                  <div className="text-right">
                    <div className={labelCls}>රක්ෂණය</div>
                    <div className={`font-medium text-sm ${cls(iDiff)}`}>{formatDate(v.insuranceExpiry)}</div>
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
                <th className="px-4 py-3 font-semibold">වාහනය</th>
                <th className="px-4 py-3 font-semibold">වර්ගය</th>
                <th className="px-4 py-3 font-semibold">ස්ථානය</th>
                <th className="px-4 py-3 font-semibold">ආදායම් බලපත්‍රය</th>
                <th className="px-4 py-3 font-semibold">රක්ෂණය</th>
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
                    <td className={`px-4 py-3 ${cls(rDiff)}`}>{formatDate(v.revenueLicenseExpiry)}</td>
                    <td className={`px-4 py-3 ${cls(iDiff)}`}>{formatDate(v.insuranceExpiry)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(v)} className="p-1.5 text-blue-500 hover:text-blue-400 hover:bg-[#30363d] rounded transition-colors" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteId(v.id)} className="p-1.5 text-red-500 hover:text-red-400 hover:bg-[#30363d] rounded transition-colors" title="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-100 mb-2">මකා දැමීම තහවුරු කරන්න</h3>
            <p className="text-gray-400 mb-6">ඔබට මෙම වාහනය මකා දැමීමට අවශ්‍ය බව විශ්වාසද? මෙය නැවත හැරවිය නොහැක.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-[#21262d] hover:bg-[#30363d] rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Logs Panel */}
      {/* @ts-ignore */}
      <EmailLogs />
    </div>
  )
}
