"use client"
import React, { useEffect, useState } from "react"

type EmailLog = {
    id: string
    to: string
    subject: string
    sentAt: string
    body: string
}

export default function EmailLogs() {
    const [logs, setLogs] = useState<EmailLog[]>([])
    const [loading, setLoading] = useState(true)

    async function loadLogs() {
        setLoading(true)
        try {
            const res = await fetch('/api/email-logs')
            const data = await res.json()
            setLogs(data)
        } catch (err) {
            console.error("Failed to load logs:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadLogs()
        // Refresh every 30 seconds to show new logs automatically
        const interval = setInterval(loadLogs, 30000)
        return () => clearInterval(interval)
    }, [])

    function formatTime(dateStr: string) {
        const d = new Date(dateStr)
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    function formatDate(dateStr: string) {
        const d = new Date(dateStr)
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }

    return (
        <section className="bg-[#161b22] rounded-md border border-[#30363d] shadow-sm overflow-hidden mt-8">
            <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
                <h2 className="font-semibold text-gray-100 text-lg">පණිවිඩ ලොගය (Email Logs)</h2>
                <button
                    onClick={loadLogs}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-[#30363d] rounded transition-colors"
                    title="Refresh"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-auto text-left border-collapse">
                    <thead>
                        <tr className="bg-[#21262d] border-b border-[#30363d] text-gray-300 text-xs">
                            <th className="px-4 py-2 font-semibold">දිනය/වේලාව</th>
                            <th className="px-4 py-2 font-semibold">ලබන්නා (Recipient)</th>
                            <th className="px-4 py-2 font-semibold">විෂය (Subject)</th>
                            <th className="px-4 py-2 font-semibold">තත්ත්වය (Status)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#21262d]">
                        {loading && logs.length === 0 ? (
                            <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Loading logs...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">පණිවිඩ කිසිවක් නැත (No logs found)</td></tr>
                        ) : (
                            logs.map(log => {
                                const isFailed = log.body.startsWith('FAILED:')
                                return (
                                    <tr key={log.id} className="hover:bg-[#21262d] transition-colors group">
                                        <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                                            <span className="text-gray-300 font-medium">{formatDate(log.sentAt)}</span>
                                            <span className="ml-2 opacity-60">{formatTime(log.sentAt)}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-300">{log.to}</td>
                                        <td className="px-4 py-3 text-sm text-gray-400 group-hover:text-gray-200 truncate max-w-[200px]" title={log.subject}>
                                            {log.subject}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {isFailed ? (
                                                <span className="inline-flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs border border-red-400/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                                                    අසාර්ථකයි (Failed)
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2 py-0.5 rounded text-xs border border-green-400/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                    සාර්ථකයි (Sent)
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
