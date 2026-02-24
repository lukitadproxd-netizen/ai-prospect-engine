'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { MessageSquare, Sparkles } from 'lucide-react'

// Lazy: modal code only loaded on first click, not on page load
const MessageModal = dynamic(
    () => import('@/components/message-modal').then(m => ({ default: m.MessageModal })),
    { ssr: false }
)

interface GenerateMessageButtonProps {
    leadId: string
    leadName: string
}

export function GenerateMessageButton({ leadId, leadName }: GenerateMessageButtonProps) {
    const [open, setOpen] = useState(false)
    const [hasGenerated, setHasGenerated] = useState(false)

    const handleOpen = useCallback(() => {
        setOpen(true)
        setHasGenerated(true)
    }, [])

    return (
        <>
            <button
                onClick={handleOpen}
                className={`btn-secondary flex items-center gap-2 whitespace-nowrap group transition-all duration-200 ${hasGenerated && !open
                    ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    : ''
                    }`}
                aria-label={`Generate personalized message for ${leadName}`}
            >
                {hasGenerated && !open ? (
                    <>
                        <Sparkles className="w-4 h-4" />
                        View Message
                    </>
                ) : (
                    <>
                        <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        Generate Message
                    </>
                )}
            </button>

            {open && (
                <MessageModal
                    leadId={leadId}
                    leadName={leadName}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    )
}
