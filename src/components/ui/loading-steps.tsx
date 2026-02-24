'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Loader2, Circle } from 'lucide-react'

export interface LoadingStep {
    label: string
    duration: number // ms to wait before moving to next step
}

interface LoadingStepsProps {
    steps: LoadingStep[]
    isActive: boolean
    onComplete?: () => void
    title?: string
    subtitle?: string
}

type StepStatus = 'pending' | 'active' | 'done'

export function LoadingSteps({ steps, isActive, onComplete, title, subtitle }: LoadingStepsProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
        steps.map(() => 'pending')
    )

    useEffect(() => {
        if (!isActive) {
            setCurrentStep(0)
            setStepStatuses(steps.map(() => 'pending'))
            return
        }

        // Activate first step immediately
        setStepStatuses(prev => {
            const next = [...prev]
            next[0] = 'active'
            return next
        })
    }, [isActive, steps.length])

    useEffect(() => {
        if (!isActive || currentStep >= steps.length) return

        const timer = setTimeout(() => {
            setStepStatuses(prev => {
                const next = [...prev]
                next[currentStep] = 'done'
                if (currentStep + 1 < steps.length) {
                    next[currentStep + 1] = 'active'
                }
                return next
            })

            if (currentStep + 1 < steps.length) {
                setCurrentStep(prev => prev + 1)
            } else {
                onComplete?.()
            }
        }, steps[currentStep].duration)

        return () => clearTimeout(timer)
    }, [isActive, currentStep, steps, onComplete])

    if (!isActive) return null

    return (
        <div className="w-full space-y-4">
            {title && (
                <div className="text-center space-y-1 mb-6">
                    <h3 className="text-base font-bold text-slate-900">{title}</h3>
                    {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
                </div>
            )}

            <div className="space-y-3">
                {steps.map((step, i) => {
                    const status = stepStatuses[i]

                    return (
                        <div
                            key={i}
                            className={`flex items-center gap-3 transition-all duration-500 ${status === 'pending'
                                    ? 'opacity-40'
                                    : 'opacity-100'
                                }`}
                        >
                            {/* Step indicator */}
                            <div className="flex-shrink-0">
                                {status === 'done' ? (
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center animate-[scaleIn_0.3s_ease-out]">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                ) : status === 'active' ? (
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Circle className="w-3 h-3 text-slate-300" />
                                    </div>
                                )}
                            </div>

                            {/* Step label */}
                            <span className={`text-sm transition-all duration-300 ${status === 'done'
                                    ? 'text-emerald-700 font-medium'
                                    : status === 'active'
                                        ? 'text-slate-900 font-semibold'
                                        : 'text-slate-400'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                    style={{
                        width: `${((stepStatuses.filter(s => s === 'done').length) / steps.length) * 100}%`,
                    }}
                />
            </div>
        </div>
    )
}

// Pre-defined step sets for common flows
export const CAMPAIGN_STEPS: LoadingStep[] = [
    { label: 'Validating campaign parameters...', duration: 1500 },
    { label: 'Searching Google Maps for businesses...', duration: 3000 },
    { label: 'Extracting lead data & contact info...', duration: 2500 },
    { label: 'Saving leads to your dashboard...', duration: 1500 },
]

export const SCORING_STEPS: LoadingStep[] = [
    { label: 'Loading lead profiles...', duration: 1200 },
    { label: 'Analyzing niche relevance with Gemini AI...', duration: 4000 },
    { label: 'Scoring decision-maker fit...', duration: 3000 },
    { label: 'Calculating priority rankings...', duration: 2000 },
    { label: 'Finalizing scores & insights...', duration: 1500 },
]

export const MESSAGE_STEPS: LoadingStep[] = [
    { label: 'Analyzing lead profile & website...', duration: 1500 },
    { label: 'Crafting personalized angle...', duration: 2500 },
    { label: 'Generating outreach copy...', duration: 2000 },
]
