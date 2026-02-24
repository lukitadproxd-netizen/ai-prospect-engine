import { Skeleton, SkeletonTableRow } from '@/components/ui/skeleton'

export default function LeadsLoading() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="space-y-2">
                <div className="h-7 w-28 rounded-lg bg-slate-100" />
                <div className="h-4 w-80 rounded-md bg-slate-50" />
            </div>

            {/* Search & Filters */}
            <div className="flex gap-3 items-center flex-wrap">
                <Skeleton className="h-11 flex-1 min-w-[200px] rounded-xl" />
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg">
                    {['All', 'Hot', 'Warm', 'Cold', '—'].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-14 rounded-md" />
                    ))}
                </div>
                <Skeleton className="h-11 w-32 rounded-full" />
            </div>

            {/* Count */}
            <Skeleton className="h-3 w-20" />

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Business / Contact</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Campaign</th>
                            <th className="px-6 py-4">Score</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <SkeletonTableRow cols={6} />
                        <SkeletonTableRow cols={6} />
                        <SkeletonTableRow cols={6} />
                        <SkeletonTableRow cols={6} />
                        <SkeletonTableRow cols={6} />
                        <SkeletonTableRow cols={6} />
                        <SkeletonTableRow cols={6} />
                        <SkeletonTableRow cols={6} />
                    </tbody>
                </table>
            </div>
        </div>
    )
}
