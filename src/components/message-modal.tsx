'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Mail, Linkedin, Copy, CheckCheck, RefreshCw, AlertCircle } from 'lucide-react'
import { LoadingSteps, MESSAGE_STEPS } from '@/components/ui/loading-steps'

interface MessageModalProps {
    leadId: string
    leadName: string
    onClose: () => void
}

type MsgType = 'email' | 'linkedin'

interface EmailResult { subject: string; body: string }
interface LinkedInResult { connection_note: string; follow_up: string }
type MsgResult = EmailResult | LinkedInResult

function isEmail(r: MsgResult): r is EmailResult {
    return 'subject' in r
}

export function MessageModal({ leadId, leadName, onClose }: MessageModalProps) {
    const [msgType, setMsgType] = useState<MsgType>('email')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<MsgResult | null>(null)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        generate('email')
    }, [])

    async function generate(type: MsgType) {
        setLoading(true)
        setResult(null)
        setError('')
        setCopied(false)

        try {
            const res = await fetch('/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId, type }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Error generating message')
                return
            }
            setResult(data)
            setMsgType(type)
        } catch {
            setError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    function getFullText(): string {
        if (!result) return ''
        if (isEmail(result)) {
            return `Subject: ${result.subject}\n\n${result.body}`
        }
        return `Connection Note:\n${result.connection_note}\n\nFollow-up:\n${result.follow_up}`
    }

    async function handleCopy() {
        await navigator.clipboard.writeText(getFullText())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    function handleOverlayClick(e: React.MouseEvent) {
        if (e.target === overlayRef.current) onClose()
    }

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">AI Message Generator</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Personalized outreach for <span className="font-semibold text-slate-700">{leadName}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Type selector */}
                <div className="flex gap-2 p-4 border-b border-slate-100">
                    <button
                        onClick={() => generate('email')}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${msgType === 'email'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <Mail className="w-4 h-4" />
                        Cold Email
                    </button>
                    <button
                        onClick={() => generate('linkedin')}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${msgType === 'linkedin'
                            ? 'bg-blue-700 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-10">
                            <LoadingSteps
                                steps={MESSAGE_STEPS}
                                isActive={true}
                                title={`Crafting message for ${leadName}`}
                                subtitle="Powered by Gemini AI"
                            />
                        </div>
                    )}

                    {error && !loading && (
                        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-red-700">Generation failed</p>
                                <p className="text-xs text-red-500 mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {result && !loading && (
                        <>
                            {isEmail(result) ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                            Subject Line
                                        </label>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900">
                                            {result.subject}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                            Email Body
                                        </label>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                            {result.body}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                            Connection Request Note
                                            <span className="ml-2 font-normal normal-case text-slate-400">({result.connection_note.length} chars)</span>
                                        </label>
                                        <div className={`bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed ${result.connection_note.length > 300 ? 'border-amber-300 bg-amber-50' : 'border-slate-200'
                                            }`}>
                                            {result.connection_note}
                                        </div>
                                        {result.connection_note.length > 300 && (
                                            <p className="text-xs text-amber-600 mt-1">⚠️ Slightly over 300 chars — trim before sending</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                            Follow-up Message
                                        </label>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                            {result.follow_up}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {result && !loading && (
                    <div className="flex items-center justify-between gap-3 p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                        <button
                            onClick={() => generate(msgType)}
                            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Regenerate
                        </button>
                        <button
                            onClick={handleCopy}
                            className={`btn-primary flex items-center gap-2 ${copied ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                        >
                            {copied ? (
                                <>
                                    <CheckCheck className="w-4 h-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy to Clipboard
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
