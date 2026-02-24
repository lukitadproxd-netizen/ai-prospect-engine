import { createClient } from '@/lib/supabase/server'
import { User, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { CreditPacks } from '@/components/ui/credit-packs'
import { getCreditStatus } from '@/lib/credits'

export default async function SettingsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single()

    const creditsTotal = profile?.credits_total ?? 20
    const creditsUsed = profile?.credits_used ?? 0
    const creditsAvailable = creditsTotal - creditsUsed
    const creditStatus = getCreditStatus(creditsTotal, creditsUsed)
    const usagePercentage = creditStatus.usagePercent

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Manage your account details, billing, API usage, and preferences.
                </p>
            </div>

            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <a href="#" className="border-blue-600 text-blue-600 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4" /> My Profile
                    </a>
                </nav>
            </div>

            {/* Profile Section */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-bold leading-6 text-slate-900">Profile Information</h2>
                    <p className="mt-1 text-sm text-slate-500">Update your account details and contact information.</p>
                </div>

                <div className="card p-6 space-y-4 max-w-2xl">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                            <input
                                type="text"
                                defaultValue={profile?.full_name || ""}
                                className="input-field"
                                placeholder="E.g. Elon Musk"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="input-field bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="pt-2">
                        <button className="btn-primary">Save Changes</button>
                    </div>
                </div>
            </div>

            {/* Usage & Plan (Simplified) */}
            <div className="space-y-6 pt-6">
                <div>
                    <h2 className="text-lg font-bold leading-6 text-slate-900">Account Usage</h2>
                    <p className="mt-1 text-sm text-slate-500">View your current plan and generation limits.</p>
                </div>

                <div className="card p-6 max-w-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 font-semibold text-slate-900">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span>Current Plan: <span className="text-blue-600">Basic (Trial)</span></span>
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                            {creditsAvailable} / {creditsTotal} available
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                        You are currently on a limited trial account. Reach out to support to expand your lead generation limits.
                    </p>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${creditStatus.isLocked ? 'bg-red-500' :
                                    creditStatus.isWarning ? 'bg-amber-400' : 'bg-blue-600'
                                }`}
                            style={{ width: `${usagePercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Credit Packs */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
                <CreditPacks currentTotal={creditsTotal} currentUsed={creditsUsed} />
            </div>

            {/* Danger Zone */}
            <div className="space-y-6 pt-10 border-t border-slate-200 mt-10">
                <div>
                    <h2 className="text-lg font-bold leading-6 text-red-600 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Danger Zone
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">Irreversible destructive actions for your account.</p>
                </div>

                <div className="card p-6 max-w-2xl border-red-100 bg-red-50/30 flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">Delete Account</h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm">
                            Permanently delete your account, active campaigns, and discovered leads. This cannot be undone.
                        </p>
                    </div>
                    <button className="px-4 py-2 font-semibold text-sm rounded-md border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    )
}
