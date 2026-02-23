import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface ScoreResult {
    score: number
    confidence_level: number
    score_reasoning: string
    is_high_priority: boolean
}

async function scoreLead(
    lead: { id: string; business_name: string; website: string | null; role: string; niche: string; country: string },
    campaign: { niche: string; country: string; target_role: string; value_proposition: string },
    apiKey: string,
    supabase: Awaited<ReturnType<typeof createClient>>
): Promise<{ success: boolean; error?: string }> {
    const prompt = `You are a ruthlessly honest B2B sales analyst. Score this lead 0-100 with STRICT criteria. Most leads should score 40-75. Only truly exceptional matches score 80+.

CAMPAIGN CONTEXT:
- Niche: ${campaign.niche}
- Target Role: ${campaign.target_role}
- Country: ${campaign.country}
- Value Proposition: ${campaign.value_proposition}

LEAD DATA:
- Business: ${lead.business_name}
- Website: ${lead.website || 'None found'}
- Contact Role: ${lead.role}

SCORING CRITERIA (be harsh):
1. Exact Niche Match (0-20): Is this EXACTLY the right industry? Tangential = max 10.
2. Company Size Signals (0-20): Name suggests established company with budget? Generic/small = max 8.
3. Decision Maker Fit (0-15): Is "${lead.role}" the actual decision maker for this purchase?
4. Pain Point Alignment (0-20): Would they clearly need "${campaign.value_proposition}"?
5. Geographic Match (0-10): Correct country/region?
6. Digital Presence (0-15): Has website? Name suggests professional operation?

SCORE GUIDE:
- 90-100: Perfect match, clear budget, exact niche, verified decision maker
- 70-89: Strong match with 1-2 unknowns
- 50-69: Decent relevance but unclear fit or missing signals
- 30-49: Tangential match, unlikely to convert
- 0-29: Wrong niche, wrong role, or no data

Respond ONLY with JSON, no markdown:
{"score": <number>, "confidence_level": <0-100>, "score_reasoning": "<2 sentences explaining WHY this specific score, referencing concrete signals>", "is_high_priority": <true if score >= 80>}`

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 200,
                    thinkingConfig: { thinkingBudget: 0 },
                },
            }),
        }
    )

    if (!response.ok) {
        const errorBody = await response.text()
        return { success: false, error: `Gemini ${response.status}: ${errorBody.slice(0, 150)}` }
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!text) {
        return { success: false, error: 'Empty Gemini response' }
    }

    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result: ScoreResult = JSON.parse(cleanText)

    const score = Math.max(0, Math.min(100, Math.round(result.score)))
    const confidence = Math.max(0, Math.min(100, Math.round(result.confidence_level)))

    await supabase
        .from('leads')
        .update({
            score,
            confidence_level: confidence,
            score_reasoning: result.score_reasoning || '',
            is_high_priority: score >= 80,
            last_scored_at: new Date().toISOString(),
        })
        .eq('id', lead.id)

    return { success: true }
}

export async function POST(request: NextRequest) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { campaignId } = await request.json()

    if (!campaignId) {
        return NextResponse.json({ error: 'Missing campaignId' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
        return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const { data: campaign } = await supabase
        .from('campaigns')
        .select('niche, country, target_role, value_proposition')
        .eq('id', campaignId)
        .single()

    if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const { data: leads } = await supabase
        .from('leads')
        .select('id, business_name, website, role, niche, country')
        .eq('campaign_id', campaignId)
        .is('score', null)

    if (!leads || leads.length === 0) {
        return NextResponse.json({ scored: 0, message: 'All leads already scored' })
    }

    // Process in batches of 5 concurrent requests
    const BATCH_SIZE = 5
    let scoredCount = 0
    let errorCount = 0
    let lastError = ''

    for (let i = 0; i < leads.length; i += BATCH_SIZE) {
        const batch = leads.slice(i, i + BATCH_SIZE)
        const results = await Promise.allSettled(
            batch.map(lead => scoreLead(lead, campaign, apiKey, supabase))
        )

        for (const result of results) {
            if (result.status === 'fulfilled' && result.value.success) {
                scoredCount++
            } else {
                errorCount++
                if (result.status === 'fulfilled' && result.value.error) {
                    lastError = result.value.error
                } else if (result.status === 'rejected') {
                    lastError = result.reason?.message || 'Unknown error'
                }
            }
        }
    }

    return NextResponse.json({
        scored: scoredCount,
        errors: errorCount,
        total: leads.length,
        ...(errorCount > 0 && { lastError }),
    })
}
