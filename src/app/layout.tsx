import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ai-prospect-engine.vercel.app'),
  title: {
    default: 'AI Prospect Engine — Find, Score & Personalize B2B Leads',
    template: '%s | AI Prospect Engine',
  },
  description: 'Stop wasting hours on manual prospecting. Our AI Engine analyzes public data, scores intent, and generates hyper-personalized outreach at scale.',
  keywords: ['B2B leads', 'AI prospecting', 'lead scoring', 'cold email', 'sales automation', 'lead generation'],
  authors: [{ name: 'AI Prospect Engine' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AI Prospect Engine',
    title: 'AI Prospect Engine — Find, Score & Personalize B2B Leads',
    description: 'Stop wasting hours on manual prospecting. Our AI Engine analyzes public data, scores intent, and generates hyper-personalized outreach at scale.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prospect Engine — B2B Lead Intelligence',
    description: 'Find, score and personalize B2B leads in minutes with AI.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
