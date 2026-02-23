import { createClient } from '@/lib/supabase/server'
import { LeadsTable } from './leads-table'

export default async function LeadsPage() {
    const supabase = await createClient()

    const { data: leads, error } = await supabase
        .from('leads')
        .select('id, business_name, contact_name, role, score, is_high_priority, status, website, campaigns(niche, country)')
        .order('score', { ascending: false, nullsFirst: false })

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Leads</h1>
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error.message}</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Leads</h1>
                <p className="text-slate-500">View and manage all prospects across your campaigns.</p>
            </div>
            <LeadsTable leads={(leads as any) ?? []} />
        </div>
    )
}
