import { login, signup } from './actions'
import { Sparkles, ArrowRight } from 'lucide-react'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { error } = await searchParams

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Panel - Login Form */}
            <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                AI Prospect Engine
                            </span>
                        </div>
                        <h2 className="mt-8 text-3xl font-bold tracking-tight text-slate-900">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Sign in to your account or create a new one to start finding leads.
                        </p>
                    </div>

                    <div className="mt-10">
                        <form className="space-y-6">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-slate-900"
                                >
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="input-field py-1.5"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-slate-900"
                                >
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="input-field py-1.5"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-50 p-4 border border-red-100">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                Authentication Error
                                            </h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <p>{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-4 pt-4">
                                <button
                                    formAction={login}
                                    type="submit"
                                    className="btn-primary w-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    Sign in <ArrowRight className="h-4 w-4" />
                                </button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-slate-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm font-medium leading-6">
                                        <span className="bg-white px-6 text-slate-500">New to the platform?</span>
                                    </div>
                                </div>

                                <button
                                    formAction={signup}
                                    type="submit"
                                    className="btn-secondary w-full"
                                >
                                    Create new account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Panel - Design/Gradient */}
            <div className="relative hidden w-0 flex-1 lg:block bg-slate-900">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-900 via-[#1e1b4b] to-purple-900 overflow-hidden">
                    {/* Abstract UI Elements representing the Stitch design */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white z-10">
                        <div className="max-w-xl mx-auto backdrop-blur-sm bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl">
                            <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-6" />
                            <h2 className="text-4xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                                Build pipeline faster.
                            </h2>
                            <p className="text-lg text-indigo-100/80 leading-relaxed">
                                Join the next generation of B2B sales teams using our AI matching engine to find and score the highest intent leads in minutes.
                            </p>

                            {/* Decorative mock UI cards */}
                            <div className="mt-10 grid gap-4 grid-cols-2 text-left">
                                <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                                    <div className="h-2 w-12 bg-blue-400/50 rounded-full mb-3"></div>
                                    <div className="h-2 w-full bg-white/20 rounded-full mb-2"></div>
                                    <div className="h-2 w-2/3 bg-white/20 rounded-full mb-4"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-green-400/20 flex items-center justify-center">
                                            <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                        </div>
                                        <span className="text-xs text-white/70">98% Match Score</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md opacity-70">
                                    <div className="h-2 w-12 bg-purple-400/50 rounded-full mb-3"></div>
                                    <div className="h-2 w-full bg-white/20 rounded-full mb-2"></div>
                                    <div className="h-2 w-2/3 bg-white/20 rounded-full mb-4"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-blue-400/20 flex items-center justify-center">
                                            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                                        </div>
                                        <span className="text-xs text-white/70">85% Match Score</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
