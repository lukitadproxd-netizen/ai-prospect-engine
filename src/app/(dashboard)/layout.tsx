import { Sidebar } from '@/components/layout/sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // Ensure the user is actually authenticated
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto px-8 py-8 w-full">
                {children}
            </main>
        </div>
    )
}
