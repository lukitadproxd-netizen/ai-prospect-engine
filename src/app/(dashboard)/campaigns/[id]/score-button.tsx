'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, CheckCircle2, AlertCircle } from 'lucide-react'
import { LoadingSteps, SCORING_STEPS } from '@/components/ui/loading-steps'

interface ScoreButtonProps {
    campaignId: string
    unscoredCount: number
}

export function ScoreButton({ campaignId, unscoredCount }: ScoreButtonProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [result, setResult] = useState<{ scored: number; errors: number; lastError?: string } | null>(null)
    const router = useRouter()

    if (unscoredCount === 0 && status === 'idle') {
        return (
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                All leads scored
            </div>
        )
    }

    async function handleScore() {
        setStatus('loading')
        try {
            const response = await fetch('/api/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ campaignId }),
            })

            const data = await response.json()

            if (!response.ok) {
                setStatus('error')
                setResult({ scored: 0, errors: 1, lastError: data.error })
                return
            }

            setResult(data)
            setStatus('success')
            router.refresh()
        } catch {
            setStatus('error')
            setResult({ scored: 0, errors: 1, lastError: 'Network error' })
        }
    }

    return (
        <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
                {status === 'success' && result && (
                    <span className="text-sm text-emerald-600 font-medium animate-fade-in-up">
                        {result.scored} leads scored
                    </span>
                )}
                {status === 'error' && (
                    <span className="flex items-center gap-1 text-sm text-red-600 font-medium max-w-xs truncate animate-fade-in-up" title={result?.lastError}>
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {result?.lastError || 'Scoring failed'}
                    </span>
                )}
                <button
                    onClick={handleScore}
                    disabled={status === 'loading'}
                    className={`btn-primary flex items-center gap-2 ${status === 'loading'
                            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25 hover:shadow-indigo-500/40'
                            : ''
                        }`}
                >
                    {status === 'loading' ? (
                        <>
                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Scoring with AI...
                        </>
                    ) : (
                        <>
                            <Brain className="w-4 h-4" />
                            {status === 'success' ? 'Re-score Leads' : `Score ${unscoredCount} Leads with AI`}
                        </>
                    )}
                </button>
            </div>

            {status === 'loading' && (
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
