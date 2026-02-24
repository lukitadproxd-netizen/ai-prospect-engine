import { createCampaign } from '../actions'
import { SubmitButton } from './submit-button'
import { createClient } from '@/lib/supabase/server'
import { getCreditStatus } from '@/lib/credits'
import { CreditStatusBanner } from '@/components/ui/credit-status-banner'
import { Lock } from 'lucide-react'

export default async function NewCampaignPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = await searchParams

    // Fetch credits to determine if user can create a campaign
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: userProfile } = await supabase
        .from('users')
        .select('credits_total, credits_used')
        .eq('id', user?.id)
        .single()

    const creditsTotal = userProfile?.credits_total ?? 20
    const creditsUsed = userProfile?.credits_used ?? 0
    const creditStatus = getCreditStatus(creditsTotal, creditsUsed)

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Create New Campaign</h1>
                <p className="mt-2 text-slate-500">
                    Define your target B2B niche and geographic focus to start finding high-quality leads.
                </p>
            </div>

            {/* Credit status — always visible on this page */}
            <CreditStatusBanner status={creditStatus} showUpgrade={creditStatus.isLocked} />

            {error === 'db_error' && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                    Hubo un problema al crear la campaña. Por favor, verificá tu conexión o intentá de nuevo.
                </div>
            )}

            {error === 'no_credits' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm font-medium">
                    ⚠️ You&apos;ve used all your available credits. Upgrade your plan to create more campaigns.
                </div>
            )}

            {error === 'server_error' && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                    An unexpected error occurred. Please try again.
                </div>
            )}

            {/* LOCKED: show blocked state instead of the form */}
            {creditStatus.isLocked ? (
                <div className="card p-12 flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                        <Lock className="w-7 h-7 text-red-400" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-lg font-bold text-slate-900">
                            No AI generations left
                        </h2>
                        <p className="text-sm text-slate-500 max-w-sm">
                            You&apos;ve used all your credits for this month. Upgrade your plan to create more campaigns and keep finding leads.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <a href="/campaigns" className="btn-secondary text-sm">
                            View existing campaigns
                        </a>
                        <a href="/settings#upgrade" className="btn-primary text-sm">
                            Upgrade plan →
                        </a>
                    </div>
                </div>
            ) : (
                <div className="card p-8">
                    <form action={createCampaign} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="niche" className="block text-sm font-medium text-slate-700">
                                    Business Niche
                                </label>
                                <input
                                    type="text"
                                    id="niche"
                                    name="niche"
                                    required
                                    placeholder="e.g., Marketing Agencies, SaaS startups, Law firms"
                                    className="input-field mt-1"
                                />
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-slate-700">
                                    Target Country / Region
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    required
                                    placeholder="e.g., USA, UK, Australia"
                                    className="input-field mt-1"
                                />
                            </div>

                            <div>
                                <label htmlFor="target_role" className="block text-sm font-medium text-slate-700">
                                    Target Ideal Role
                                </label>
                                <input
                                    type="text"
                                    id="target_role"
                                    name="target_role"
                                    required
                                    placeholder="e.g., Founder, CEO, Marketing Director"
                                    className="input-field mt-1"
                                />
                            </div>

                            <div>
                                <label htmlFor="value_proposition" className="block text-sm font-medium text-slate-700">
                                    Your Value Proposition / Offer
                                </label>
                                <textarea
                                    id="value_proposition"
                                    name="value_proposition"
                                    rows={4}
                                    required
                                    placeholder="Briefly describe what you are offering and why they should care."
                                    className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 mt-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-end gap-3">
                                <a href="/campaigns" className="btn-secondary">
                                    Cancel
                                </a>
                            </div>
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
