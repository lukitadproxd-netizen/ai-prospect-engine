'use client'

import type { ReactNode } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import type { AsyncStatus } from '@/hooks/use-async-action'

interface AsyncButtonProps {
    status: AsyncStatus
    onClick: () => void
    /** Default (idle) content */
    children: ReactNode
    /** Text shown during loading */
    loadingText?: string
    /** Text shown on success */
    successText?: string
    /** Text shown on error */
    errorText?: string
    /** Additional CSS classes */
    className?: string
    /** Button variant */
    variant?: 'primary' | 'secondary'
    /** Accessible label */
    ariaLabel?: string
    /** Disable even when idle */
    disabled?: boolean
}

export function AsyncButton({
    status,
    onClick,
    children,
    loadingText = 'Processing...',
    successText = 'Done!',
    errorText = 'Failed',
    className = '',
    variant = 'primary',
    ariaLabel,
    disabled = false,
}: AsyncButtonProps) {
    const isDisabled = disabled || status === 'loading'
    const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'

    const statusStyles: Record<AsyncStatus, string> = {
        idle: '',
        loading: 'relative cursor-wait',
        success: variant === 'primary'
            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 hover:shadow-emerald-500/40'
            : 'border-emerald-200 text-emerald-700 bg-emerald-50',
        error: variant === 'primary'
            ? 'bg-red-600 hover:bg-red-700 shadow-red-500/25'
            : 'border-red-200 text-red-700 bg-red-50',
    }

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`${baseClass} flex items-center gap-2 transition-all duration-300 ${statusStyles[status]} ${className}`}
            aria-label={ariaLabel}
            aria-busy={status === 'loading'}
            aria-disabled={isDisabled}
        >
            {status === 'loading' && (
                <>
                    <div
                        className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin flex-shrink-0"
                        role="status"
                        aria-label="Loading"
                    />
                    <span className="truncate">{loadingText}</span>
                </>
            )}

            {status === 'success' && (
                <>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 animate-[scaleIn_0.3s_ease-out]" />
                    <span>{successText}</span>
                </>
            )}

            {status === 'error' && (
                <>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorText}</span>
                </>
            )}

            {status === 'idle' && children}
        </button>
    )
}
