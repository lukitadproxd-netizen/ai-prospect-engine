'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

export function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            className="btn-primary"
            disabled={pending}
        >
            {pending ? (
                <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Buscando Leads en Google Maps...</span>
                </span>
            ) : (
                <span>Create Campaign & Find Leads</span>
            )}
        </button>
    )
}
