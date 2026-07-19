'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'video1' | 'video2' | 'hiding'>('video1')
  const v1Ref = useRef<HTMLVideoElement>(null)
  const v2Ref = useRef<HTMLVideoElement>(null)
  
  useEffect(() => {
    // Force unmuted audio volume on start
    if (v1Ref.current) {
      v1Ref.current.muted = false
      v1Ref.current.volume = 1.0
      v1Ref.current.play().catch(e => {
        console.warn("Autoplay blocked by browser policy, fallback to user-initiated audio", e)
        // If blocked, we try to play it anyway. Many modern browsers allow it if previous interaction occurred.
        if (v1Ref.current) {
          v1Ref.current.play()
        }
      })
    }
  }, [])

  const handleV1End = () => {
    setPhase('video2')
    if (v2Ref.current) {
      v2Ref.current.play().catch(e => {
        console.warn("Video2 autoplay blocked", e)
        if (v2Ref.current) {
          v2Ref.current.muted = true
          v2Ref.current.play()
        }
      })
    }
  }

  const handleV2End = () => {
    // Wait 3 seconds to highlight the final visual
    setTimeout(() => {
      setPhase('hiding')
      setTimeout(() => {
        onComplete()
      }, 800)
    }, 3000)
  }

  const skip = () => {
    setPhase('hiding')
    setTimeout(() => {
      onComplete()
    }, 800)
  }

  return (
    <AnimatePresence>
      {phase !== 'hiding' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
        >
          {phase === 'video1' && (
            <video
              ref={v1Ref}
              src="/Video1.mp4"
              className="w-full h-full object-cover select-none pointer-events-none transform translate-z-0 backface-visibility-hidden"
              style={{ filter: 'contrast(1.08) brightness(1.04) saturate(1.1)' }}
              onEnded={handleV1End}
              playsInline
              muted={false}
            />
          )}

          {phase === 'video2' && (
            <motion.video
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              ref={v2Ref}
              src="/Video2.mp4"
              className="w-full h-full object-cover select-none pointer-events-none transform translate-z-0 backface-visibility-hidden"
              style={{ filter: 'contrast(1.08) brightness(1.04) saturate(1.1)' }}
              onEnded={handleV2End}
              autoPlay
              playsInline
              muted={false}
            />
          )}
          
          <button 
            onClick={skip}
            className="absolute bottom-10 right-10 px-8 py-3 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-full font-hud text-xs text-white backdrop-blur-md transition-all duration-300 z-10 flex items-center gap-2 group tracking-widest"
          >
            SKIP SEQUENCE
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
