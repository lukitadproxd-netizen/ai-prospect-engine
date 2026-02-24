import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CREDIT_PACKS } from '@/lib/credits'
import { getPayPalAccessToken, PAYPAL_API_URL } from '@/lib/paypal'

export async function POST(req: Request) {
    try {
        const { packId } = await req.json()

        const pack = CREDIT_PACKS.find(p => p.id === packId)
        if (!pack) {
            return NextResponse.json({ error: 'Invalid pack ID' }, { status: 400 })
        }

        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const accessToken = await getPayPalAccessToken()
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        const payload = {
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: `${pack.id}_${user.id}_${Date.now()}`,
                custom_id: JSON.stringify({ packId: pack.id, userId: user.id }),
                amount: {
                    currency_code: 'USD',
                    value: pack.price.toString()
                },
                description: `AI Prospect Engine - ${pack.label} (${pack.amount} Credits)`
            }],
            payment_source: {
                paypal: {
                    experience_context: {
                        payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                        brand_name: 'AI Prospect Engine',
                        user_action: 'PAY_NOW',
                        return_url: `${appUrl}/billing/success`,
                        cancel_url: `${appUrl}/settings#credits`
                    }
                }
            }
        }

        const res = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })

        const order = await res.json()

        if (!res.ok) {
            console.error('PayPal Order Error:', order)
            return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
        }

        // Find the approval URL (PayPal docs use 'approve' or 'payer-action')
        const approveLink = order.links?.find((link: any) => link.rel === 'payer-action' || link.rel === 'approve')?.href

        if (!approveLink) {
            return NextResponse.json({ error: 'No approval link returned from PayPal' }, { status: 500 })
        }

        return NextResponse.json({ checkoutUrl: approveLink })

    } catch (e: any) {
        console.error('Error creating PayPal order:', e)
        return NextResponse.json({ error: 'Internal server error', details: e.message }, { status: 500 })
    }
}
