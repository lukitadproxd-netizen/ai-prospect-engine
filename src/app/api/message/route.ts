import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { leadId, type = 'email' } = await request.json()

    if (!leadId) {
        return NextResponse.json({ error: 'Missing leadId' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    // Fetch lead + campaign data
    const { data: lead } = await supabase
        .from('leads')
        .select('*, campaigns(niche, country, target_role, value_proposition)')
        .eq('id', leadId)
        .single()

    if (!lead) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const campaign = lead.campaigns as {
        niche: string
        country: string
        target_role: string
        value_proposition: string
    }

    const isEmail = type === 'email'

    const prompt = isEmail
        ? `You are an expert B2B cold email copywriter. Write a short, high-converting cold email to the CEO/founder of this company.

Company: ${lead.business_name}
Industry: ${lead.niche || campaign.niche}
Country: ${lead.country || campaign.country}
Website: ${lead.website || 'N/A'}
AI Score: ${lead.score}/100 (${lead.score_reasoning || ''})

Our Offer: ${campaign.value_proposition}
Target Role: ${campaign.target_role}

RULES:
- Subject line: sharp, specific, no clickbait (max 8 words)
- Body: 3 short paragraphs max
- First line: reference something specific about their business
- Second: make the connection to their pain point
- Third: single clear CTA (reply, quick call)
- Tone: direct, peer-to-peer, no corporate fluff
- NO generic openers like "I hope this finds you well"
- Sign as "{{YOUR_NAME}}" with "{{YOUR_COMPANY}}" placeholders

Respond in this exact JSON format (no markdown):
{"subject": "...", "body": "..."}`
        : `You are an expert B2B LinkedIn message copywriter. Write a short LinkedIn connection request note + follow-up message for this prospect.

Company: ${lead.business_name}
Industry: ${lead.niche || campaign.niche}
Country: ${lead.country || campaign.country}
Website: ${lead.website || 'N/A'}
AI Score: ${lead.score}/100 (${lead.score_reasoning || ''})

Our Offer: ${campaign.value_proposition}
Target Role: ${campaign.target_role}

RULES:
- Connection note: max 300 chars, feel natural and human (no pitch yet)
- Follow-up: 2 short paragraphs, reference their work, pitch briefly, CTA
- Tone: conversational, not salesy
- Sign as "{{YOUR_NAME}}" placeholder

Respond in this exact JSON format (no markdown):
{"connection_note": "...", "follow_up": "..."}`

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 600,
                    thinkingConfig: { thinkingBudget: 0 },
                },
            }),
        }
    )

    if (!response.ok) {
        const err = await response.text()
        return NextResponse.json({ error: `Gemini error: ${err.slice(0, 200)}` }, { status: 502 })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!text) {
        return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 502 })
    }

    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result = JSON.parse(cleanText)

    return NextResponse.json({ type, lead: lead.business_name, ...result })
}
