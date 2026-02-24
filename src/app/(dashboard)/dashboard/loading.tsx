import { SkeletonCard, SkeletonTableRow } from '@/components/ui/skeleton'

export default function DashboardLoading() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-32 rounded-lg bg-slate-100" />
                    <div className="h-4 w-64 rounded-md bg-slate-50" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-10 w-48 rounded-full bg-blue-50/60" />
                    <div className="h-11 w-40 rounded-full bg-slate-100" />
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>

            {/* Recent Leads Table */}
            <div className="card overflow-hidden">
                <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-5 w-28 rounded-md bg-slate-100" />
                        <div className="h-3 w-52 rounded-md bg-slate-50" />
                    </div>
                    <div className="h-4 w-24 rounded-md bg-slate-50" />
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Business</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">AI Score</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <SkeletonTableRow cols={4} />
                        <SkeletonTableRow cols={4} />
                        <SkeletonTableRow cols={4} />
                        <SkeletonTableRow cols={4} />
                        <SkeletonTableRow cols={4} />
                    </tbody>
                </table>
            </div>
        </div>
    )
}
