'use client'

import { Sparkles } from 'lucide-react'

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center transition-all duration-300">
            <div className="relative">
                {/* Outer Ring */}
                <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>

                {/* Inner Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-1">
                <p className="text-sm font-semibold text-slate-900 tracking-tight">
                    AI Prospect Engine
                </p>
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"></span>
                </div>
            </div>
        </div>
    )
}
