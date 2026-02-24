export const PAYPAL_API_URL = process.env.PAYPAL_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

export async function getPayPalAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
        throw new Error('Missing PayPal credentials (PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET)')
    }

    const auth = Buffer.from(clientId + ':' + clientSecret).toString('base64');
    const res = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
        cache: 'no-store'
    })

    if (!res.ok) {
        const errorText = await res.text()
        console.error('PayPal token error:', errorText)
        throw new Error('Failed to retrieve PayPal access token')
    }

    const data = await res.json()
    return data.access_token as string
}
