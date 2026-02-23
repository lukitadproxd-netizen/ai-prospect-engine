'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Optionally log to error reporting service
    }, [error])

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Something went wrong
                </h2>
                <p className="text-slate-500 mb-8">
                    An unexpected error occurred. Please try again or contact support if the problem persists.
                </p>
                <button
                    onClick={reset}
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        </div>
    )
}
