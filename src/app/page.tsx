import Link from 'next/link'
import { Sparkles, ArrowRight, CheckCircle2, Zap, BarChart, MessageSquare, Shield, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex bg-blue-600 rounded-lg p-1.5 shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-xl">AI Prospect Engine</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:inline">
              Pricing
            </a>
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Sign in
            </Link>
            <Link href="/login" className="btn-primary rounded-full px-5 py-2 text-sm shadow-sm hover:shadow-md">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-100 rounded-full blur-3xl opacity-50 z-0"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered B2B Prospecting</span>
            </div>

            <h1 className="mx-auto max-w-4xl font-extrabold tracking-tight text-slate-900 text-5xl sm:text-7xl mb-8 leading-[1.1]">
              Find, Score & Personalize
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                B2B Leads in Minutes.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
              Stop wasting hours on manual prospecting. Our AI Engine discovers businesses, scores them with Gemini AI, and generates hyper-personalized cold emails — all in one click.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="btn-primary py-3.5 px-8 text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all rounded-full flex items-center gap-2">
                Start Your Lead Engine <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-sm text-slate-500">
                Free trial — 20 leads included, no credit card
              </span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative z-10 mt-16 max-w-5xl mx-auto px-6 sm:mt-24">
            <div className="rounded-2xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-3xl lg:p-4 shadow-2xl">
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden flex flex-col sm:flex-row h-[400px]">
                <div className="hidden sm:flex w-48 bg-[#1e293b] flex-col p-4 border-r border-slate-800">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <div className="h-4 w-24 bg-slate-700 rounded"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 w-full bg-slate-700/50 rounded flex items-center px-3 gap-2">
                      <div className="w-4 h-4 rounded bg-slate-600"></div>
                      <div className="h-2 w-16 bg-slate-600 rounded"></div>
                    </div>
                    <div className="h-8 w-full rounded flex items-center px-3 gap-2 opacity-50">
                      <div className="w-4 h-4 rounded bg-slate-600"></div>
                      <div className="h-2 w-20 bg-slate-600 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-slate-50 p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-32 bg-slate-200 rounded"></div>
                    <div className="h-8 w-24 bg-blue-100 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[88, 78, 95].map((score, i) => (
                      <div key={i} className="h-24 bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col justify-between">
                        <div className="h-3 w-16 bg-slate-200 rounded"></div>
                        <div className="flex items-center justify-between">
                          <div className={`text-xl font-bold ${score >= 80 ? 'text-orange-600' : 'text-blue-600'}`}>{score}</div>
                          <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${score >= 80 ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>
                            {score >= 80 ? '🔥 Hot' : '☀️ Warm'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm p-4 overflow-hidden">
                    <div className="h-4 w-40 bg-slate-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-8 w-full bg-slate-50 rounded"></div>
                      <div className="h-8 w-full bg-slate-50 rounded"></div>
                      <div className="h-8 w-full bg-slate-50 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-24 sm:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                From zero to personalized outreach in 3 steps.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="relative card p-8 bg-slate-50/50 border-none shadow-none text-center">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Define Your Target</h3>
                <p className="text-slate-600 text-sm">Enter your niche, country, and value proposition. Our engine searches Google Maps to find matching businesses.</p>
              </div>
              <div className="relative card p-8 bg-slate-50/50 border-none shadow-none text-center">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <BarChart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">AI Scores Each Lead</h3>
                <p className="text-slate-600 text-sm">Gemini AI analyzes each lead across 6 criteria — niche fit, company size, decision maker access, pain point alignment, and more.</p>
              </div>
              <div className="relative card p-8 bg-slate-50/50 border-none shadow-none text-center">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Personalized Outreach</h3>
                <p className="text-slate-600 text-sm">Generate cold emails and LinkedIn messages tailored to each lead — not templates, real personalization.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="py-16 bg-slate-50 border-y border-slate-100">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">SOC 2 Compliant Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span className="text-sm font-medium">Powered by Gemini AI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Google Maps API</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">20 Leads in 30 Seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="py-24 sm:py-32 bg-white scroll-mt-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Start free. Scale when you&apos;re ready.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Free */}
              <div className="card p-8 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Starter</h3>
                <p className="text-sm text-slate-500 mb-6">Try the engine risk-free</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-slate-500 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['20 leads per month', '1 campaign', 'AI scoring', 'Email generation', 'CSV export'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="btn-secondary text-center w-full">
                  Get Started Free
                </Link>
              </div>

              {/* Pro - Featured */}
              <div className="card p-8 flex flex-col ring-2 ring-blue-600 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Pro</h3>
                <p className="text-sm text-slate-500 mb-6">For serious outbound teams</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">$49</span>
                  <span className="text-slate-500 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['200 leads per month', '10 campaigns', 'AI scoring + messages', 'LinkedIn messages', 'Priority support', 'Advanced filters'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="btn-primary text-center w-full">
                  Start 7-Day Trial
                </Link>
              </div>

              {/* Scale */}
              <div className="card p-8 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Scale</h3>
                <p className="text-sm text-slate-500 mb-6">For agencies & teams</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">$99</span>
                  <span className="text-slate-500 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Unlimited leads', 'Unlimited campaigns', 'Everything in Pro', 'API access', 'White-label ready', 'Dedicated support'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="btn-secondary text-center w-full">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Early Access CTA */}
        <div className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Early Access
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Be the first to scale your outbound
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join the early access list and get 50 free leads when we launch the Pro plan. No credit card needed.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-8 rounded-full text-base shadow-lg shadow-blue-600/30 transition-all"
            >
              Claim Your Free Leads <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex bg-blue-600 rounded-lg p-1 shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-white text-sm">AI Prospect Engine</span>
            </div>
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} AI Prospect Engine. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
