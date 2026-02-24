import { Zap, AlertTriangle, Lock, ArrowRight } from 'lucide-react'
import type { CreditStatus } from '@/lib/credits'

interface CreditStatusBannerProps {
    status: CreditStatus
    /** Show an upgrade CTA. Default true. */
    showUpgrade?: boolean
    /** Compact mode for use inside headers/nav */
    compact?: boolean
}

const CONFIG = {
    NORMAL: {
        wrapper: 'bg-emerald-50 border-emerald-200',
        icon: 'text-emerald-500',
        text: 'text-emerald-800',
        sub: 'text-emerald-600',
        bar: 'bg-emerald-500',
        pill: 'bg-emerald-100 text-emerald-700',
        Icon: Zap,
    },
    WARNING: {
        wrapper: 'bg-amber-50 border-amber-200',
        icon: 'text-amber-500',
        text: 'text-amber-900',
        sub: 'text-amber-700',
        bar: 'bg-amber-400',
        pill: 'bg-amber-100 text-amber-800',
        Icon: AlertTriangle,
    },
    LOCKED: {
        wrapper: 'bg-red-50 border-red-200',
        icon: 'text-red-500',
        text: 'text-red-900',
        sub: 'text-red-600',
        bar: 'bg-red-400',
        pill: 'bg-red-100 text-red-700',
        Icon: Lock,
    },
} as const

export function CreditStatusBanner({
    status,
    showUpgrade = true,
    compact = false,
}: CreditStatusBannerProps) {
    const c = CONFIG[status.tier]
    const { Icon } = c

    // ── Compact pill for headers / navbars ──────────────────────────────
    if (compact) {
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${c.wrapper} ${c.pill}`}>
                <Icon className={`w-3.5 h-3.5 ${c.icon}`} />
                <span>
                    {status.isLocked
                        ? 'No credits left'
                        : `${status.available} / ${status.total} credits`}
                </span>
            </div>
        )
    }

    // ── Full banner ──────────────────────────────────────────────────────
    return (
        <div className={`rounded-xl border p-4 ${c.wrapper} animate-fade-in-up`}>
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`mt-0.5 flex-shrink-0 ${c.icon}`}>
                    <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <p className={`text-sm font-semibold ${c.text}`}>
                            {status.label}
                        </p>
                        {status.isLocked && showUpgrade && (
                            <a
                                href="/settings#upgrade"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 active:scale-[0.98] transition-all px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0"
                            >
                                Upgrade plan <ArrowRight className="w-3 h-3" />
                            </a>
                        )}
                        {status.isWarning && showUpgrade && (
                            <a
                                href="/settings#upgrade"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 active:scale-[0.98] transition-all px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0"
                            >
                                Upgrade <ArrowRight className="w-3 h-3" />
                            </a>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                        <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ease-out ${c.bar}`}
                                style={{ width: `${status.usagePercent}%` }}
                            />
                        </div>
                        <p className={`text-xs ${c.sub}`}>
                            {status.used} of {status.total} generations used
                            {status.isLocked && ' — existing leads and messages remain accessible'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
