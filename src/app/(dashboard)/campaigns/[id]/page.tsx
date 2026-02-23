import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, ExternalLink, Mail, MessageSquare, Flame, ThermometerSun, Snowflake } from 'lucide-react'
import { ScoreButton } from './score-button'
import { GenerateMessageButton } from './generate-message-button'

export default async function CampaignDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single()

    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('campaign_id', id)
        .order('score', { ascending: false, nullsFirst: false })

    if (campaignError || !campaign) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <p className="text-slate-500">Campaign not found.</p>
                <a href="/campaigns" className="btn-secondary">Back to Campaigns</a>
            </div>
        )
    }

    const unscoredCount = leads?.filter(l => l.score === null).length ?? 0
    const highPriorityCount = leads?.filter(l => l.is_high_priority).length ?? 0

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <a href="/campaigns" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </a>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {campaign.niche} in {campaign.country}
                    </h1>
                    <p className="text-slate-500">
                        Targeting: {campaign.target_role} &bull; Created {new Date(campaign.created_at).toLocaleDateString()}
                    </p>
                </div>
                <ScoreButton campaignId={id} unscoredCount={unscoredCount} />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="card p-6 col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Value Proposition</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {campaign.value_proposition || "No value proposition defined."}
                    </p>
                </div>
                <div className="card p-6 space-y-4 bg-slate-50 border-none shadow-none">
                    <h2 className="text-lg font-bold text-slate-900">Campaign Stats</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Status</span>
                            <span className="font-medium capitalize">{campaign.status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Leads Found</span>
                            <span className="font-medium">{leads?.length || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Scored</span>
                            <span className="font-medium">{(leads?.length ?? 0) - unscoredCount} / {leads?.length ?? 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">High Priority</span>
                            <span className="font-medium text-orange-600 flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5" />
                                {highPriorityCount}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Identified Prospects</h2>
                <div className="grid gap-4">
                    {leads && leads.length > 0 ? (
                        leads.map((lead) => (
                            <div key={lead.id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-900 text-lg">{lead.business_name}</h3>
                                        {lead.is_high_priority && (
                                            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                <Flame className="w-3 h-3" /> Hot Lead
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <MessageSquare className="w-3.5 h-3.5" /> {lead.contact_name || lead.business_name} ({lead.role})
                                        </span>
                                        {lead.email && (
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3.5 h-3.5" /> {lead.email}
                                            </span>
                                        )}
                                        {lead.website && (
                                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                                                <ExternalLink className="w-3.5 h-3.5" /> Website
                                            </a>
                                        )}
                                    </div>
                                    {lead.score_reasoning && (
                                        <p className="text-xs text-slate-400 italic mt-1">{lead.score_reasoning}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-center min-w-[60px]">
                                        {lead.score !== null ? (
                                            <>
                                                <div className={`text-2xl font-black ${lead.score >= 80 ? 'text-orange-600' :
                                                    lead.score >= 50 ? 'text-blue-600' : 'text-slate-400'
                                                    }`}>
                                                    {lead.score}
                                                </div>
                                                <div className="mt-0.5">
                                                    {lead.score >= 80 ? (
                                                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-orange-600 uppercase">
                                                            <Flame className="w-3 h-3" /> Hot
                                                        </span>
                                                    ) : lead.score >= 50 ? (
                                                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600 uppercase">
                                                            <ThermometerSun className="w-3 h-3" /> Warm
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-400 uppercase">
                                                            <Snowflake className="w-3 h-3" /> Cold
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-2xl font-black text-slate-200">&mdash;</div>
                                                <div className="text-[10px] text-slate-300 font-bold uppercase">
                                                    Not scored
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <GenerateMessageButton leadId={lead.id} leadName={lead.business_name} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 py-8 text-center card bg-slate-50/50 border-dashed">
                            No leads found for this campaign.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
