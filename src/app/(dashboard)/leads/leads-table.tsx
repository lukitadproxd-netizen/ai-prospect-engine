'use client'

import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Download, Search, Flame, ThermometerSun, Snowflake, X } from 'lucide-react'

// Lazy: only load the modal bundle when user clicks "Personalize"
const MessageModal = dynamic(
    () => import('@/components/message-modal').then(m => ({ default: m.MessageModal })),
    { ssr: false }
)

interface Lead {
    id: string
    business_name: string
    contact_name: string | null
    role: string
    score: number | null
    is_high_priority: boolean
    status: string
    website: string | null
    campaigns: { niche: string; country: string } | null
}

type FilterStatus = 'all' | 'hot' | 'warm' | 'cold' | 'unscored'

interface LeadsTableProps {
    leads: Lead[]
}

export function LeadsTable({ leads }: LeadsTableProps) {
    const [query, setQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
    const [selectedLead, setSelectedLead] = useState<{ id: string; name: string } | null>(null)

    const filtered = useMemo(() => {
        return leads.filter(lead => {
            const matchesQuery =
                !query ||
                lead.business_name.toLowerCase().includes(query.toLowerCase()) ||
                (lead.contact_name?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
                (lead.campaigns?.niche.toLowerCase().includes(query.toLowerCase()) ?? false)

            const matchesFilter =
                filterStatus === 'all' ||
                (filterStatus === 'hot' && (lead.score ?? 0) >= 80) ||
                (filterStatus === 'warm' && (lead.score ?? 0) >= 50 && (lead.score ?? 0) < 80) ||
                (filterStatus === 'cold' && (lead.score ?? 0) < 50 && lead.score !== null) ||
                (filterStatus === 'unscored' && lead.score === null)

            return matchesQuery && matchesFilter
        })
    }, [leads, query, filterStatus])

    const exportCSV = useCallback(() => {
        const headers = ['Business', 'Role', 'Campaign', 'Country', 'Score', 'Status', 'Website']
        const rows = filtered.map(l => [
            `"${l.business_name}"`,
            `"${l.role}"`,
            `"${l.campaigns?.niche ?? ''}"`,
            `"${l.campaigns?.country ?? ''}"`,
            l.score ?? '',
            l.score !== null ? (l.score >= 80 ? 'Hot' : l.score >= 50 ? 'Warm' : 'Cold') : 'Unscored',
            `"${l.website ?? ''}"`,
        ])

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }, [filtered])

    const filterOptions: { label: string; value: FilterStatus }[] = [
        { label: 'All', value: 'all' },
        { label: '🔥 Hot', value: 'hot' },
        { label: '☀️ Warm', value: 'warm' },
        { label: '❄️ Cold', value: 'cold' },
        { label: 'Unscored', value: 'unscored' },
    ]

    return (
        <div className="space-y-4">
            <div className="flex gap-3 items-center flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search business, campaign..."
                        className="input-field pl-10 pr-8"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {filterOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setFilterStatus(opt.value)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterStatus === opt.value
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 flex-shrink-0">
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            <div className="text-xs text-slate-500 font-medium">
                {filtered.length} lead{filtered.length !== 1 ? 's' : ''} {filterStatus !== 'all' || query ? `found` : 'total'}
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Business / Contact</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Campaign</th>
                            <th className="px-6 py-4">Score</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length > 0 ? (
                            filtered.map(lead => (
                                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{lead.business_name}</div>
                                        <div className="text-slate-500">{lead.contact_name || '—'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{lead.role}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-900">{lead.campaigns?.niche}</div>
                                        <div className="text-xs text-slate-500">{lead.campaigns?.country}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {lead.score !== null ? (
                                            <span className={`font-bold ${lead.score >= 80 ? 'text-orange-600' :
                                                lead.score >= 50 ? 'text-blue-600' : 'text-slate-400'
                                                }`}>
                                                {lead.score}
                                            </span>
                                        ) : (
                                            <span className="text-slate-300 font-medium">&mdash;</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {lead.score !== null ? (
                                            lead.score >= 80 ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                                    <Flame className="w-3 h-3" /> Hot
                                                </span>
                                            ) : lead.score >= 50 ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                    <ThermometerSun className="w-3 h-3" /> Warm
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                    <Snowflake className="w-3 h-3" /> Cold
                                                </span>
                                            )
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-400 capitalize">
                                                Unscored
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedLead({ id: lead.id, name: lead.business_name })}
                                            className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                                        >
                                            Personalize
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    {query || filterStatus !== 'all'
                                        ? 'No leads match your search or filters.'
                                        : 'No leads found yet. Create a campaign to start.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedLead && (
                <MessageModal
                    leadId={selectedLead.id}
                    leadName={selectedLead.name}
                    onClose={() => setSelectedLead(null)}
                />
            )}
        </div>
    )
}
