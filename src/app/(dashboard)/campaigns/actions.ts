'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { searchPlaces, type GooglePlace } from '@/lib/google/places'

export async function createCampaign(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const niche = formData.get('niche') as string
    const country = formData.get('country') as string
    const target_role = formData.get('target_role') as string
    const value_proposition = formData.get('value_proposition') as string

    try {
        // 0. Check credits before creating
        const { data: profile } = await supabase
            .from('users')
            .select('credits_total, credits_used')
            .eq('id', user.id)
            .single()

        const creditsAvailable = (profile?.credits_total ?? 20) - (profile?.credits_used ?? 0)

        if (creditsAvailable <= 0) {
            redirect('/campaigns/new?error=no_credits')
        }

        // 1. Create the campaign initially as generating
        const { data: campaign, error: campaignError } = await supabase
            .from('campaigns')
            .insert([
                {
                    user_id: user.id,
                    niche,
                    country,
                    target_role,
                    value_proposition,
                    status: 'generating',
                },
            ])
            .select()
            .single()

        if (campaignError) {
            redirect('/campaigns/new?error=db_error')
        }

        // 2. Decrement credits (atomic increment)
        const { error: creditError } = await supabase.rpc('increment_credits_used', { user_id_input: user.id })
        if (creditError) {
            // Fallback: direct update if RPC doesn't exist yet
            await supabase
                .from('users')
                .update({ credits_used: (profile?.credits_used ?? 0) + 1 })
                .eq('id', user.id)
        }

        // 3. Fetch leads via Google Places API
        const searchQuery = `${niche} in ${country}`

        let googlePlaces: GooglePlace[] = []
        try {
            googlePlaces = await searchPlaces(searchQuery, 20)
        } catch {
            // Google Places failed silently, campaign still created
        }

        // 4. Batch insert the discovered places
        if (googlePlaces && googlePlaces.length > 0) {
            const rawLeads = googlePlaces.map(place => ({
                campaign_id: campaign.id,
                business_name: place.displayName?.text || 'Unknown Business',
                role: target_role,
                website: place.websiteUri || null,
                source: 'Google Places API',
                niche: niche,
                country: country,
                status: 'new'
            }))

            await supabase.from('leads').insert(rawLeads)
        }

        // 5. Update campaign status and finalize
        await supabase
            .from('campaigns')
            .update({ status: 'active' })
            .eq('id', campaign.id)

        revalidatePath('/campaigns')
        revalidatePath('/dashboard')
        redirect(`/campaigns/${campaign.id}`)

    } catch (error) {
        if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
            throw error
        }
        redirect('/campaigns/new?error=server_error')
    }
}
