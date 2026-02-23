import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'

export default async function CampaignsPage() {
    const supabase = await createClient()

    // Fetch campaigns for the user
    const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campaigns</h1>
                    <p className="text-slate-500">Manage your active prospecting campaigns.</p>
                </div>
                <a href="/campaigns/new" className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Campaign
                </a>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error.message}</div>
                </div>
            )}

            {campaigns && campaigns.length > 0 ? (
                <div className="grid gap-4">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} className="card p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-slate-900 leading-none">
                                    {campaign.niche} in {campaign.country}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Targeting: {campaign.target_role} • Created on {new Date(campaign.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                  ${campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                                        campaign.status === 'draft' ? 'bg-slate-100 text-slate-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {campaign.status}
                                </span>
                                <a
                                    href={`/campaigns/${campaign.id}`}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                >
                                    View Details
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 card border-dashed">
                    <p className="text-slate-600 mb-4 text-center">
                        You don't have any campaigns yet. Let's find your first leads!
                    </p>
                    <a href="/campaigns/new" className="btn-primary">
                        Create First Campaign
                    </a>
                </div>
            )}
        </div>
    )
}
