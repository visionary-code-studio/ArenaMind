'use client'

import { useStore } from '@/store/useStore'
import SplashScreen from './SplashScreen'

export default function SplashWrapper({ children }: { children: React.ReactNode }) {
  const { hasSeenSplash, setHasSeenSplash } = useStore()

  return (
    <>
      {!hasSeenSplash && <SplashScreen onComplete={() => setHasSeenSplash(true)} />}
      <div className={!hasSeenSplash ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        {children}
      </div>
    </>
  )
}
