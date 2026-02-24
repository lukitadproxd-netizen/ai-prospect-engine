import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CREDIT_PACKS } from '@/lib/credits'

export async function POST(req: Request) {
    try {
        const { packId } = await req.json()

        // 1. Validate the pack exists
        const pack = CREDIT_PACKS.find(p => p.id === packId)
        if (!pack) {
            return NextResponse.json({ error: 'Invalid pack ID' }, { status: 400 })
        }

        // 2. Authenticate
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // ── Stripe integration point ──────────────────────────────────────────
        // When Stripe is configured (pack.stripePriceId !== null):
        //
        // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
        // const session = await stripe.checkout.sessions.create({
        //     payment_method_types: ['card'],
        //     line_items: [{ price: pack.stripePriceId, quantity: 1 }],
        //     mode: 'payment',
        //     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?credits=success&pack=${packId}`,
        //     cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings#credits`,
        //     metadata: { userId: user.id, packId, amount: pack.amount },
        //     customer_email: user.email,
        // })
        // return NextResponse.json({ checkoutUrl: session.url })
        //
        // Then handle payment confirmation in a Stripe webhook route.
        // ─────────────────────────────────────────────────────────────────────

        // 3. Fetch current credits_total (use select to get current value)
        const { data: profile, error: fetchError } = await supabase
            .from('users')
            .select('credits_total')
            .eq('id', user.id)
            .single()

        if (fetchError || !profile) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
        }

        // 4. Increment credits_total by pack.amount
        //    credits_used is NOT touched — only the total ceiling grows
        const newTotal = profile.credits_total + pack.amount

        const { error: updateError } = await supabase
            .from('users')
            .update({ credits_total: newTotal })
            .eq('id', user.id)

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            pack: pack.id,
            creditsAdded: pack.amount,
            newTotal,
        })

    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
