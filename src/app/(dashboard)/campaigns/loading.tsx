import { SkeletonCampaignItem } from '@/components/ui/skeleton'

export default function CampaignsLoading() {
    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-7 w-36 rounded-lg bg-slate-100" />
                    <div className="h-4 w-72 rounded-md bg-slate-50" />
                </div>
                <div className="h-11 w-40 rounded-full bg-slate-100" />
            </div>

            {/* Campaign List */}
            <div className="grid gap-4">
                <SkeletonCampaignItem />
                <SkeletonCampaignItem />
                <SkeletonCampaignItem />
            </div>
        </div>
    )
}
