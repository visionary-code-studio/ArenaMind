'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'

export default function TestimonialsPage() {
  const router = useRouter()
  
  const testimonials = [
    { quote: "ArenaMind AI has completely transformed how we handle crowd congestion. It's like seeing the future 30 minutes before it happens.", author: "FIFA Security Director", event: "World Cup 2026 Preparations" },
    { quote: "The Digital Twin integration gives our executives unprecedented oversight. Decisions that took hours now take seconds.", author: "Stadium General Manager", event: "MetLife Stadium" },
    { quote: "Having a personalized AI companion for every single fan takes the spectator experience to an entirely new level of premium hospitality.", author: "Head of Fan Experience", event: "FIFA Innovations" }
  ]

  return (
    <div className="min-h-screen bg-[#020205] relative flex flex-col justify-between overflow-x-hidden overflow-y-auto">
      <div className="fixed inset-0 pointer-events-none z-0">
        <video src="/Video2.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen scale-125 transform origin-center" />
        <div className="absolute inset-0 pitch-grid opacity-20" />
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 w-full p-6 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-5xl"
        >
        <button onClick={() => router.push('/')} className="mb-8 text-white/50 hover:text-[#00f5ff] transition-colors font-hud text-[10px] tracking-widest flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full w-max backdrop-blur-md border border-white/10" aria-label="Back to Home">
          ← BACK TO HOME
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black font-sora tracking-tight mb-4 text-white">
            OPERATIONAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-[#a855f7]">SUCCESS</span>
          </h1>
          <p className="text-white/50 font-hud text-xs tracking-widest uppercase">Trusted by Global Stadium Leaders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="glass p-8 rounded-3xl border-white/10 hover:border-[#00f5ff]/30 transition-colors flex flex-col justify-between bg-[#0a0c16]/80 backdrop-blur-2xl"
            >
              <div className="text-4xl text-[#00f5ff]/40 mb-4 font-serif">&quot;</div>
              <p className="text-white/80 text-sm leading-relaxed mb-8 italic font-sora">
                {t.quote}
              </p>
              <div>
                <div className="font-bold text-[#00f5ff] text-sm">{t.author}</div>
                <div className="font-hud text-[9px] text-white/40 mt-1">{t.event}</div>
              </div>
            </motion.div>
          ))}
        </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
