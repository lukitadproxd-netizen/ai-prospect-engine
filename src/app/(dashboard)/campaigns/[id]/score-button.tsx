'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Brain, CheckCircle2 } from 'lucide-react'
import { useAsyncAction } from '@/hooks/use-async-action'
import { AsyncButton } from '@/components/ui/async-button'
import { SCORING_STEPS } from '@/components/ui/loading-steps'

// Lazy: step-by-step panel only loads when scoring starts
const LoadingSteps = dynamic(
    () => import('@/components/ui/loading-steps').then(m => ({ default: m.LoadingSteps })),
    { ssr: false, loading: () => null }
)

interface ScoreButtonProps {
    campaignId: string
    unscoredCount: number
}

export function ScoreButton({ campaignId, unscoredCount }: ScoreButtonProps) {
    const router = useRouter()

    const scoreAction = useCallback(async () => {
        const response = await fetch('/api/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ campaignId }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Scoring failed')
        }

        return data as { scored: number; errors: number }
    }, [campaignId])

    const { status, data, error, execute, isLoading, isSuccess } = useAsyncAction<{ scored: number; errors: number }>(
        scoreAction,
        {
            successResetMs: 4000,
            errorResetMs: 5000,
            onSuccess: () => router.refresh(),
        }
    )

    if (unscoredCount === 0 && status === 'idle') {
        return (
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                All leads scored
            </div>
        )
    }

    return (
        <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
                {isSuccess && data && (
                    <span className="text-sm text-emerald-600 font-medium animate-fade-in-up">
                        {data.scored} leads scored
                    </span>
                )}

                {status === 'error' && (
                    <span className="text-sm text-red-600 font-medium animate-fade-in-up max-w-xs truncate" title={error ?? undefined}>
                        {error}
                    </span>
                )}

                <AsyncButton
                    status={status}
                    onClick={() => execute()}
                    loadingText="Scoring with AI..."
                    successText={`${data?.scored ?? 0} scored!`}
                    errorText="Retry Score"
                    ariaLabel={`Score ${unscoredCount} leads using AI`}
                >
                    <Brain className="w-4 h-4" />
                    {isSuccess ? 'Re-score Leads' : `Score ${unscoredCount} Leads with AI`}
                </AsyncButton>
            </div>

            {isLoading && (
                <div className="w-80 card p-5 animate-fade-in-up">
                    <LoadingSteps
                        steps={SCORING_STEPS}
                        isActive={true}
                        title="AI Scoring Engine"
                        subtitle={`Analyzing ${unscoredCount} leads — ~${Math.ceil(unscoredCount * 1.5)}s`}
                    />
                </div>
            )}
        </div>
    )
}
