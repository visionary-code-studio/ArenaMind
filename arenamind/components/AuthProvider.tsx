'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useStore } from '@/store/useStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useStore(state => state.setUser)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [setUser])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00f5ff]/20 border-t-[#00f5ff] rounded-full animate-spin" />
          <div className="font-hud text-xs text-[#00f5ff] uppercase tracking-widest animate-pulse">Initializing Firebase Auth...</div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
