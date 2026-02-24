'use client'

import { useFormStatus } from 'react-dom'
import { Rocket } from 'lucide-react'
import { LoadingSteps, CAMPAIGN_STEPS } from '@/components/ui/loading-steps'

export function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <div className="w-full space-y-4">
            <button
                type="submit"
                className="btn-primary w-full"
                disabled={pending}
            >
                {pending ? (
                    <span className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Creating campaign...</span>
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Rocket className="w-4 h-4" />
                        Create Campaign & Find Leads
                    </span>
                )}
            </button>

            {pending && (
                <div className="card p-6 animate-fade-in-up">
                    <LoadingSteps
                        steps={CAMPAIGN_STEPS}
                        isActive={pending}
                        title="Building your pipeline"
                        subtitle="This usually takes 15–30 seconds"
                    />
                </div>
            )}
        </div>
    )
}
