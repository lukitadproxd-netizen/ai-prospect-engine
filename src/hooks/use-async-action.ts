'use client'

import { useState, useCallback, useRef } from 'react'

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseAsyncActionOptions {
    /** Reset to idle after success (ms). 0 = never reset */
    successResetMs?: number
    /** Reset to idle after error (ms). 0 = never reset */
    errorResetMs?: number
    /** Callback when action completes successfully */
    onSuccess?: (data: unknown) => void
    /** Callback when action fails */
    onError?: (error: string) => void
}

interface UseAsyncActionReturn<T = unknown> {
    /** Current status of the async action */
    status: AsyncStatus
    /** Whether the action is currently running */
    isLoading: boolean
    /** Whether the action completed successfully */
    isSuccess: boolean
    /** Whether the action failed */
    isError: boolean
    /** Whether the action is idle (not started or reset) */
    isIdle: boolean
    /** Error message if the action failed */
    error: string | null
    /** Result data from a successful action */
    data: T | null
    /** Execute the async action. Prevents concurrent calls automatically. */
    execute: (...args: unknown[]) => Promise<void>
    /** Manually reset to idle state */
    reset: () => void
    /** Elapsed time in seconds since the action started (updates on complete) */
    elapsed: number
}

export function useAsyncAction<T = unknown>(
    action: (...args: unknown[]) => Promise<T>,
    options: UseAsyncActionOptions = {}
): UseAsyncActionReturn<T> {
    const {
        successResetMs = 3000,
        errorResetMs = 5000,
        onSuccess,
        onError,
    } = options

    const [status, setStatus] = useState<AsyncStatus>('idle')
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<T | null>(null)
    const [elapsed, setElapsed] = useState(0)

    // Guard against concurrent executions
    const isRunningRef = useRef(false)
    const startTimeRef = useRef(0)

    const reset = useCallback(() => {
        setStatus('idle')
        setError(null)
        setData(null)
        setElapsed(0)
        isRunningRef.current = false
    }, [])

    const execute = useCallback(async (...args: unknown[]) => {
        // Prevent double-clicks / concurrent calls
        if (isRunningRef.current) return
        isRunningRef.current = true

        setStatus('loading')
        setError(null)
        setData(null)
        startTimeRef.current = Date.now()

        try {
            const result = await action(...args)
            const elapsedSec = Math.round((Date.now() - startTimeRef.current) / 1000)
            setElapsed(elapsedSec)
            setData(result)
            setStatus('success')
            onSuccess?.(result)

            if (successResetMs > 0) {
                setTimeout(reset, successResetMs)
            }
        } catch (err) {
            const elapsedSec = Math.round((Date.now() - startTimeRef.current) / 1000)
            setElapsed(elapsedSec)
            const message = err instanceof Error ? err.message : 'Something went wrong'
            setError(message)
            setStatus('error')
            onError?.(message)

            if (errorResetMs > 0) {
                setTimeout(reset, errorResetMs)
            }
        } finally {
            isRunningRef.current = false
        }
    }, [action, onSuccess, onError, successResetMs, errorResetMs, reset])

    return {
        status,
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error',
        isIdle: status === 'idle',
        error,
        data,
        execute,
        reset,
        elapsed,
    }
}
