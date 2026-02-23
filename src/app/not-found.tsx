import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="text-8xl font-extrabold text-slate-200 mb-4">404</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Page not found
                </h2>
                <p className="text-slate-500 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/dashboard"
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <Home className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    )
}
