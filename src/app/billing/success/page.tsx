import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPayPalAccessToken, PAYPAL_API_URL } from '@/lib/paypal'
import { CREDIT_PACKS } from '@/lib/credits'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, ArrowRight, Zap } from 'lucide-react'

export default async function BillingSuccessPage({
    searchParams
}: {
    searchParams: Promise<{ token?: string, PayerID?: string }>
}) {
    const { token } = await searchParams

    // PayPal returns "token" as the Order ID in the URL.
    if (!token) {
        redirect('/settings#credits')
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    let success = false
    let errorMessage = ''
    let packLabel = ''
    let addedCredits = 0

    try {
        const accessToken = await getPayPalAccessToken()

        // Capture the order directly against PayPal REST API
        const res = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        })

        const data = await res.json()

        if (data.status === 'COMPLETED') {
            const purchaseUnit = data.purchase_units[0]
            // Extract the metadata we embedded during order creation
            let packMetadata = { packId: '', userId: '' }
            try {
                // v2 custom_id is inside the capture or at the root of purchase_unit
                const customId = purchaseUnit.payments?.captures?.[0]?.custom_id || purchaseUnit.custom_id
                packMetadata = JSON.parse(customId)
            } catch (e) {
                console.error("Failed to parse custom_id", e)
            }

            // Security: ensure the payment was actually for this user
            if (packMetadata.userId === user.id) {
                const pack = CREDIT_PACKS.find(p => p.id === packMetadata.packId)
                if (pack) {
                    // Give credits
                    const { data: profile } = await supabase.from('users').select('credits_total').eq('id', user.id).single()
                    const newTotal = (profile?.credits_total || 20) + pack.amount

                    await supabase.from('users').update({ credits_total: newTotal }).eq('id', user.id)

                    success = true
                    packLabel = pack.label
                    addedCredits = pack.amount
                } else {
                    errorMessage = "Invalid credit pack detected in order."
                }
            } else {
                errorMessage = "Security check failed: order does not belong to your user."
            }
        }
        else if (data.details?.[0]?.issue === 'ORDER_ALREADY_CAPTURED' || data.message?.includes('ORDER_ALREADY_CAPTURED')) {
            // Handle page refresh gracefully
            success = true
            errorMessage = "Order was already processed successfully."
        }
        else if (data.name === 'INSTRUMENT_DECLINED') {
            errorMessage = "Payment instrument was declined."
        }
        else {
            console.error('PayPal Capture Error:', data)
            errorMessage = data.message || "Payment not completed or pending."
        }
    } catch (err: any) {
        console.error('PayPal Catch Block Error:', err)
        errorMessage = err.message || "An unexpected error occurred while processing your payment."
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="card max-w-md w-full p-8 text-center space-y-6 shadow-xl shadow-slate-200/50">
                {success ? (
                    <>
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-scaleIn">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-slate-900">Payment Successful!</h1>
                            <p className="text-slate-500">
                                {addedCredits > 0
                                    ? `You've successfully added ${addedCredits} AI credits to your account.`
                                    : errorMessage
                                }
                            </p>
                        </div>

                        {addedCredits > 0 && (
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-left">
                                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">Items Purchased</span>
                                <div className="flex items-center justify-between font-semibold text-slate-800">
                                    <span>{packLabel}</span>
                                    <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                        <Zap className="w-4 h-4" fill="currentColor" /> {addedCredits}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <Link href="/dashboard" className="btn-primary w-full justify-center group h-12 text-base">
                                Continue to Dashboard
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <AlertCircle className="w-8 h-8" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-slate-900">Payment Failed</h1>
                            <p className="text-slate-500 max-w-xs mx-auto">
                                {errorMessage}
                            </p>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Link href="/settings#credits" className="btn-secondary flex-1 justify-center h-12 text-base">
                                Try Again
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
