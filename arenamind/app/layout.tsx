import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'ArenaMind AI — Generative AI Operating System for FIFA World Cup Stadiums',
  description: 'ArenaMind AI unifies stadium security, crowd intelligence, transport coordination, emergency response, and fan experience into one AI-powered operational system.',
  keywords: 'ArenaMind AI, FIFA World Cup 2026, stadium AI, crowd intelligence, digital twin, Gemini AI',
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
