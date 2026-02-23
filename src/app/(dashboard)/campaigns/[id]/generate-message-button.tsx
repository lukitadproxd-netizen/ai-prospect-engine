'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { MessageModal } from '@/components/message-modal'

interface GenerateMessageButtonProps {
    leadId: string
    leadName: string
}

export function GenerateMessageButton({ leadId, leadName }: GenerateMessageButtonProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="btn-secondary flex items-center gap-2 whitespace-nowrap"
            >
                <MessageSquare className="w-4 h-4" />
                Generate Message
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
