'use client'

import { useState } from 'react'
import { MessageSquare, Sparkles } from 'lucide-react'
import { MessageModal } from '@/components/message-modal'

interface GenerateMessageButtonProps {
    leadId: string
    leadName: string
}

export function GenerateMessageButton({ leadId, leadName }: GenerateMessageButtonProps) {
    const [open, setOpen] = useState(false)
    const [hasGenerated, setHasGenerated] = useState(false)

    function handleOpen() {
        setOpen(true)
        setHasGenerated(true)
    }

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
