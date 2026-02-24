/**
 * Skeleton primitives — the atomic building blocks for all skeleton screens.
 * Zero dependencies. Pure CSS shimmer animation defined in globals.css.
 */

interface SkeletonProps {
    className?: string
}

/** A single animated block (rectangle, circle, pill, etc.) */
export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`relative overflow-hidden rounded-md bg-slate-100 ${className}`}
            aria-hidden="true"
        >
            <div className="absolute inset-0 animate-shimmer" />
        </div>
    )
}

/** A stat card skeleton — matches the Overview dashboard metric cards */
export function SkeletonCard() {
    return (
        <div className="card p-6 flex flex-col items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2 w-full">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-16" />
            </div>
        </div>
    )
}

/** A table row skeleton — matches the leads table rows */
export function SkeletonTableRow({ cols = 4 }: { cols?: number }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        {i === 0 && <Skeleton className="w-6 h-6 rounded" />}
                        <Skeleton className={`h-4 ${i === 0 ? 'w-32' : i === 2 ? 'w-24' : 'w-16'}`} />
                    </div>
                </td>
            ))}
        </tr>
    )
}

/** A campaign list item skeleton — matches the campaigns page cards */
export function SkeletonCampaignItem() {
    return (
        <div className="card p-6 flex items-center justify-between">
            <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3 w-64" />
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
    )
}
