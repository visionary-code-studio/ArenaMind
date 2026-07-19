'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { auth, provider, signInWithPopup } from '@/lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithPopup(auth, provider)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#00f5ff]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#a855f7]/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 pitch-grid opacity-20" />
      </div>

      {/* Main Container Container (The "App Window") */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1100px] min-h-[650px] glass border border-white/10 rounded-[32px] p-2 md:p-3 flex flex-col md:flex-row relative z-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* LEFT SIDE: Brand & Graphic */}
        <div className="w-full md:w-1/2 relative rounded-[24px] overflow-hidden flex flex-col justify-between p-10 bg-gradient-to-br from-[#0a0c16] to-[#020205]">
          {/* Inner ambient gradients for the left panel */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#a855f7]/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00f5ff]/20 rounded-full blur-[80px]" />
          
          <div className="relative z-10 flex flex-col h-full justify-between items-center text-center pt-8">
            <div className="flex flex-col items-center gap-8 w-full">
              <h1 className="text-5xl md:text-6xl font-black font-sora tracking-tighter uppercase text-white/90 z-10 relative drop-shadow-2xl">
                ARENAMIND <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-[#00ff88]">AI</span>
              </h1>

              <div className="relative z-20 mx-auto w-full max-w-[400px]">
                <Image src="/Logo.png" alt="Logo" width={1024} height={1024} className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(0,245,255,0.3)] rounded-3xl" priority quality={100} />
              </div>
            </div>

            <div className="relative z-10 mt-32">
              {/* Massive 3D Sphere mockup in the center */}
              <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-64 h-64 z-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-56 rounded-full bg-gradient-to-br from-white/40 to-transparent backdrop-blur-xl border border-white/30 shadow-[inset_0_0_40px_rgba(0,245,255,0.4),0_20px_50px_rgba(0,0,0,0.5)] animate-[float_6s_ease-in-out_infinite]" />
              </div>

              <h2 className="text-2xl font-bold font-sora text-white mb-3 relative z-10">Intelligent AI Assistance</h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm relative z-10">
                Experience smarter stadium operations with AI-powered forecasting, real-time emergency response, and seamless digital twin management.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Auth Form */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col">
          <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full relative z-10">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black font-sora mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-white/50 text-sm">{isLogin ? 'Sign in to access your unified command center' : 'Register to get secure operator access'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    ✉️
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00f5ff]/50 focus:bg-white/10 transition-all shadow-inner"
                    placeholder="operator@arenamind.ai"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    🔒
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00f5ff]/50 focus:bg-white/10 transition-all shadow-inner"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer hover:text-white/80 transition-colors">
                  <input type="checkbox" className="rounded border-white/20 bg-white/5 text-[#00f5ff] focus:ring-[#00f5ff]/50 accent-[#00f5ff]" />
                  Remember me
                </label>
                <button type="button" className="text-xs text-[#00f5ff] hover:text-[#00ff88] transition-colors">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00f5ff] to-[#a855f7] text-white font-bold text-sm shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-xs text-white/40 uppercase tracking-widest">Or Continue With</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full mt-8 py-3.5 flex items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>

            <p className="mt-8 text-center text-xs text-white/50">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={() => setIsLogin(!isLogin)} className="text-[#00f5ff] hover:text-white transition-colors font-medium">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Bottom Widget matching reference */}
          <div className="mt-auto pt-8">
            <div className="glass bg-white/5 border-white/10 rounded-2xl p-4 flex items-center justify-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#00f5ff] border-2 border-[#020205] flex items-center justify-center text-[10px] font-bold text-black">A1</div>
                <div className="w-8 h-8 rounded-full bg-[#a855f7] border-2 border-[#020205] flex items-center justify-center text-[10px] font-bold text-white">B2</div>
                <div className="w-8 h-8 rounded-full bg-[#F5A623] border-2 border-[#020205] flex items-center justify-center text-[10px] font-bold text-black">C3</div>
              </div>
              <div>
                <div className="text-sm font-bold text-white">400+ Operators</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider">Across 12 FIFA Stadiums</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}} />
    </div>
  )
}
