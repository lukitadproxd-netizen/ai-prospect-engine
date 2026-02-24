/**
 * Pure hook for computing credit status.
 * No API calls — receives the already-fetched credit values.
 */

// ─── Credit Packs catalog ────────────────────────────────────────────────────
// To integrate Stripe: populate stripe_price_id with the Price ID from your
// Stripe Dashboard (e.g., "price_1OxNzFLkj...") and route to Stripe Checkout.

export interface CreditPack {
    id: string
    amount: number
    price: number        // USD
    label: string
    badge?: string       // e.g. "Most Popular"
    pricePerCredit: number
    stripePriceId: string | null // null = Stripe not yet configured
}

export const CREDIT_PACKS: CreditPack[] = [
    {
        id: 'pack_50',
        amount: 50,
        price: 9,
        label: 'Starter Pack',
        pricePerCredit: 0.18,
        stripePriceId: null,
    },
    {
        id: 'pack_150',
        amount: 150,
        price: 19,
        label: 'Growth Pack',
        badge: 'Most Popular',
        pricePerCredit: 0.13,
        stripePriceId: null,
    },
    {
        id: 'pack_500',
        amount: 500,
        price: 49,
        label: 'Scale Pack',
        badge: 'Best Value',
        pricePerCredit: 0.10,
        stripePriceId: null,
    },
]

export type CreditTier = 'NORMAL' | 'WARNING' | 'LOCKED'


export interface CreditStatus {
    tier: CreditTier
    available: number
    total: number
    used: number
    /** 0–100, for rendering progress bars */
    usagePercent: number
    /** Human-readable label for the current tier */
    label: string
    isLocked: boolean
    isWarning: boolean
    isNormal: boolean
}

export function getCreditStatus(creditsTotal: number, creditsUsed: number): CreditStatus {
    const available = Math.max(0, creditsTotal - creditsUsed)
    const usagePercent = creditsTotal > 0 ? Math.round((creditsUsed / creditsTotal) * 100) : 100

    let tier: CreditTier
    if (available === 0) {
        tier = 'LOCKED'
    } else if (available <= 3) {
        tier = 'WARNING'
    } else {
        tier = 'NORMAL'
    }

    const labels: Record<CreditTier, string> = {
        NORMAL: `${available} AI generation${available === 1 ? '' : 's'} left this month`,
        WARNING: `Only ${available} AI generation${available === 1 ? '' : 's'} left — running low`,
        LOCKED: 'No AI generations left this month',
    }

    return {
        tier,
        available,
        total: creditsTotal,
        used: creditsUsed,
        usagePercent,
        label: labels[tier],
        isLocked: tier === 'LOCKED',
        isWarning: tier === 'WARNING',
        isNormal: tier === 'NORMAL',
    }
}
