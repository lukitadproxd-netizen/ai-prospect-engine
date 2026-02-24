'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Star, Rocket, CheckCircle2 } from 'lucide-react'
import { useAsyncAction } from '@/hooks/use-async-action'
import { AsyncButton } from '@/components/ui/async-button'
import { CREDIT_PACKS, type CreditPack } from '@/lib/credits'

// Icon per pack — ordered to match CREDIT_PACKS array
const PACK_ICONS = [Zap, Star, Rocket]

const PACK_FEATURES: Record<string, string[]> = {
    pack_50: [
        '50 AI lead searches',
        '50 message generations',
        'Never expires',
    ],
    pack_150: [
        '150 AI lead searches',
        '150 message generations',
        'Priority AI scoring',
        'Never expires',
    ],
    pack_500: [
        '500 AI lead searches',
        '500 message generations',
        'Priority AI scoring',
        'Bulk CSV exports',
        'Never expires',
    ],
}

function PackCard({ pack, index }: { pack: CreditPack; index: number }) {
    const router = useRouter()
    const Icon = PACK_ICONS[index]
    const features = PACK_FEATURES[pack.id] ?? []
    const isPopular = pack.badge === 'Most Popular'
    const isBestValue = pack.badge === 'Best Value'

    const purchaseAction = useCallback(async () => {
        const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ packId: pack.id }),
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Checkout failed to start')

        // Redirect to PayPal
        window.location.href = data.checkoutUrl

        // Hang the promise so the button stays in spinning "Processing..." state
        // until the browser fully unloads to navigate to PayPal.
        return new Promise(() => { })
    }, [pack.id])

    const { status, execute } = useAsyncAction<any>(
        purchaseAction,
        {
            successResetMs: 0,
            onSuccess: () => { }, // Handled by navigation to PayPal
        }
    )

    return (
        <div className={`relative flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden
            ${isPopular
                ? 'border-blue-300 shadow-lg shadow-blue-100 scale-[1.02]'
                : isBestValue
                    ? 'border-violet-200 shadow-md shadow-violet-50'
                    : 'border-slate-200 shadow-sm'
            }`}
        >
            {/* Badge */}
            {pack.badge && (
                <div className={`text-center py-1.5 text-xs font-bold uppercase tracking-wider
                    ${isPopular ? 'bg-blue-600 text-white' : 'bg-violet-600 text-white'}`}
                >
                    {pack.badge}
                </div>
            )}

            <div className="flex flex-col flex-1 p-6 gap-5 bg-white">
                {/* Header */}
                <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                        ${isPopular ? 'bg-blue-50 text-blue-600' : isBestValue ? 'bg-violet-50 text-violet-600' : 'bg-slate-50 text-slate-600'}`}
                    >
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{pack.label}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            ${pack.pricePerCredit.toFixed(2)} per credit
                        </p>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        ${pack.price}
                    </span>
                    <span className="text-sm text-slate-400">one-time</span>
                </div>

                {/* Amount */}
                <div className={`rounded-lg px-4 py-3 text-center font-bold
                    ${isPopular ? 'bg-blue-50 text-blue-700' : isBestValue ? 'bg-violet-50 text-violet-700' : 'bg-slate-50 text-slate-700'}`}
                >
                    {pack.amount} AI Credits
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-1">
                    {features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            {f}
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                {status === 'success' ? (
                    <div className="flex items-center justify-center gap-2 h-11 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        {pack.amount} credits added!
                    </div>
                ) : (
                    <AsyncButton
                        status={status}
                        onClick={() => execute()}
                        loadingText="Processing..."
                        errorText="Try again"
                        variant={isPopular || isBestValue ? 'primary' : 'secondary'}
                        className="w-full justify-center"
                        ariaLabel={`Buy ${pack.amount} credits for $${pack.price}`}
                    >
                        Buy {pack.amount} Credits
                    </AsyncButton>
                )}
            </div>
        </div>
    )
}

interface CreditPacksProps {
    /** Current credits_total for context display */
    currentTotal: number
    /** Current credits_used */
    currentUsed: number
}

export function CreditPacks({ currentTotal, currentUsed }: CreditPacksProps) {
    const available = Math.max(0, currentTotal - currentUsed)

    return (
        <div className="space-y-6" id="credits">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Buy Credits</h2>
                <p className="text-sm text-slate-500 mt-1">
                    One-time credit packs. Credits are added to your account instantly and never expire.
                    You currently have <span className="font-semibold text-slate-700">{available} credits</span> remaining.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {CREDIT_PACKS.map((pack, i) => (
                    <PackCard key={pack.id} pack={pack} index={i} />
                ))}
            </div>

            <p className="text-xs text-slate-400 text-center">
                Secure checkout · Credits added instantly · Cancel anytime
            </p>
        </div>
    )
}
