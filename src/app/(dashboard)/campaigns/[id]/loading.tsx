import { Skeleton } from '@/components/ui/skeleton'

export default function CampaignDetailLoading() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-11 w-52 rounded-full" />
            </div>

            {/* Stats grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="card p-6 col-span-2 space-y-4">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="card p-6 space-y-4">
                    <Skeleton className="h-5 w-32" />
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-10" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Leads list */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-44" />
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-44" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-3 w-72" />
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <Skeleton className="h-8 w-10 mx-auto" />
                                <Skeleton className="h-3 w-8 mx-auto mt-1" />
                            </div>
                            <Skeleton className="h-9 w-28 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
