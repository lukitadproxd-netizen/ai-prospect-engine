import Link from 'next/link'
import { Home, Users, Settings, DatabaseBackup, LogOut, Sparkles } from 'lucide-react'
import { signout } from '@/app/login/actions'

export function Sidebar() {
    return (
        <div className="flex h-full w-64 flex-col bg-[#1e293b] text-white">
            {/* Brand */}
            <div className="flex h-16 shrink-0 items-center px-6">
                <Link href="/dashboard" className="flex items-center gap-2 mt-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        AI Prospect
                    </h1>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1.5 px-4 py-8">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                >
                    <Home className="h-5 w-5 text-slate-400" />
                    Overview
                </Link>

                <Link
                    href="/campaigns"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                >
                    <DatabaseBackup className="h-5 w-5 text-slate-400" />
                    Campaigns
                </Link>

                <Link
                    href="/leads"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                >
                    <Users className="h-5 w-5 text-slate-400" />
                    Scored Leads
                </Link>
            </nav>

            {/* Bottom Setup */}
            <div className="border-t border-slate-700/50 p-4 space-y-2">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                >
                    <Settings className="h-5 w-5 text-slate-400" />
                    Settings
                </Link>
                <form action={signout}>
                    <button
                        type="submit"
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="h-5 w-5 px-0.5 text-slate-400 group-hover:text-red-400" />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    )
}
