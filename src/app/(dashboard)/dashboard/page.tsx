import { createClient } from '@/lib/supabase/server'
import { PlusCircle, Clock, User, Trophy, Flame, Building2, ThermometerSun, Snowflake } from 'lucide-react'

export default async function DashboardOverview() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    const { data: userProfile } = await supabase
        .from('users')
        .select('credits_total, credits_used')
        .eq('id', user?.id)
        .single()

    const { count: activeCampaigns } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })

    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

    const { count: highPriorityCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('is_high_priority', true)

    const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

    const creditsTotal = userProfile?.credits_total ?? 20
    const creditsUsed = userProfile?.credits_used ?? 0
    const creditsAvailable = creditsTotal - creditsUsed

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Overview
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Here&apos;s what&apos;s happening with your campaigns today.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-blue-100">
                        {creditsAvailable} / {creditsTotal} credits available
                    </div>
                    <a href="/campaigns/new" className="btn-primary shadow-sm shadow-blue-600/20">
                        <PlusCircle className="w-4 h-4 mr-2" /> New Campaign
                    </a>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="card p-6 flex flex-col items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm font-medium text-slate-500">Active Campaigns</span>
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{activeCampaigns || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="card p-6 flex flex-col items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <User className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm font-medium text-slate-500">Total Leads Found</span>
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{leadsCount || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="card p-6 flex flex-col items-start gap-4 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 relative z-10">
                        <span className="text-sm font-medium text-slate-500">High Priority Leads</span>
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{highPriorityCount}</span>
                        </div>
                    </div>
                    <Flame className="absolute -bottom-4 -right-4 w-32 h-32 text-orange-500/10 -rotate-12" />
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Recent Leads</h3>
                        <p className="text-sm text-slate-500">Latest prospects across all your campaigns.</p>
                    </div>
                    <a href="/leads" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all leads &rarr;</a>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4 rounded-tl-lg">Business</th>
                                <th scope="col" className="px-6 py-4">Role</th>
                                <th scope="col" className="px-6 py-4">AI Score</th>
                                <th scope="col" className="px-6 py-4 rounded-tr-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {leads && leads.length > 0 ? (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                    <Building2 className="w-3 h-3 text-slate-500" />
                                                </div>
                                                <span className="font-medium text-slate-700">{lead.business_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{lead.role}</td>
                                        <td className="px-6 py-4">
                                            {lead.score !== null ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full max-w-[124px] bg-slate-100 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className={`h-2 rounded-full ${lead.score >= 80 ? 'bg-orange-500' :
                                                                lead.score >= 50 ? 'bg-blue-500' : 'bg-slate-300'
                                                                }`}
                                                            style={{ width: `${lead.score}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="font-semibold text-slate-700 tabular-nums">{lead.score}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 font-medium">&mdash;</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {lead.score !== null ? (
                                                lead.score >= 80 ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-100 text-orange-700 uppercase tracking-tight">
                                                        <Flame className="w-3 h-3" /> Hot
                                                    </span>
                                                ) : lead.score >= 50 ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 uppercase tracking-tight">
                                                        <ThermometerSun className="w-3 h-3" /> Warm
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 uppercase tracking-tight">
                                                        <Snowflake className="w-3 h-3" /> Cold
                                                    </span>
                                                )
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-400 uppercase tracking-tight">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3 text-slate-400">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-900">No leads found yet</h3>
                                        <p className="text-sm text-slate-500 mt-1 mb-4">Create a campaign to let our AI find your ideal prospects.</p>
                                        <a href="/campaigns/new" className="btn-secondary text-xs px-3 h-8">Go to Campaigns</a>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
