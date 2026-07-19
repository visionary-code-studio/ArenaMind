/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
import type { Metadata } from 'next'
import { Sora, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ArenaMind AI — Generative AI Operating System for FIFA World Cup Stadiums',
  description: 'ArenaMind AI unifies stadium security, crowd intelligence, transport coordination, emergency response, and fan experience into one AI-powered operational system. Leverages Generative AI to improve navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, and real-time decision support during the FIFA World Cup 2026.',
  keywords: 'ArenaMind AI, FIFA World Cup 2026, stadium AI, crowd intelligence, digital twin, Gemini AI, smart stadiums, tournament operations, navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, real-time decision support, FIFA',
  openGraph: {
    title: 'ArenaMind AI',
    description: 'The Generative AI Operating System for FIFA World Cup 2026',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${sora.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-[#020205] text-white font-sora overflow-x-hidden">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
