'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { auth, storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { signOut } from 'firebase/auth'
import SplashWrapper from '@/components/SplashWrapper'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import * as THREE from 'three'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

// ─── CONSTANTS & DATA ──────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'landing', icon: '⚽', label: 'Home' },
  { id: 'command', icon: '🧠', label: 'AI Command' },
  { id: 'twin', icon: '🏟', label: 'Digital Twin' },
  { id: 'crowd', icon: '👥', label: 'Crowd Intel' },
  { id: 'emergency', icon: '🚑', label: 'Emergency' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'fan', icon: '🎟', label: 'Fan Assistant' },
]

const CROWD_DATA = [
  { zone: 'Gate A', density: 94, status: 'CRITICAL', color: '#ef4444' },
  { zone: 'Gate B', density: 72, status: 'HIGH', color: '#f97316' },
  { zone: 'Gate C', density: 55, status: 'MODERATE', color: '#eab308' },
  { zone: 'Gate D', density: 38, status: 'NORMAL', color: '#22c55e' },
  { zone: 'VIP', density: 61, status: 'MODERATE', color: '#eab308' },
  { zone: 'Concourse', density: 83, status: 'HIGH', color: '#f97316' },
]

const ANALYTICS_DATA = [
  { name: 'Mon', attendance: 62000, incidents: 3, satisfaction: 4.5 },
  { name: 'Tue', attendance: 71000, incidents: 1, satisfaction: 4.7 },
  { name: 'Wed', attendance: 68000, incidents: 2, satisfaction: 4.6 },
  { name: 'Thu', attendance: 75000, incidents: 0, satisfaction: 4.9 },
  { name: 'Fri', attendance: 82000, incidents: 2, satisfaction: 4.8 },
  { name: 'Sat', attendance: 68000, incidents: 2, satisfaction: 4.8 },
]

const ENERGY_PIE = [
  { name: 'Lighting', value: 35, color: '#00f5ff' },
  { name: 'HVAC', value: 28, color: '#F5A623' },
  { name: 'Screens', value: 18, color: '#a855f7' },
  { name: 'Other', value: 19, color: '#22c55e' },
]

const TECH_NODES = [
  { id: 'gemini', label: 'Gemini 2.0', icon: '🧠', color: '#a855f7', desc: 'Primary AI reasoning engine with long context window and multimodal capabilities.' },
  { id: 'groq', label: 'Groq LPU', icon: '⚡', color: '#F5A623', desc: 'Ultra-low latency fallback inference engine. Automatic failover when Gemini is unavailable.' },
  { id: 'firebase', label: 'Firebase', icon: '🔥', color: '#ef4444', desc: 'Real-time Firestore database, authentication, and cloud storage platform.' },
  { id: 'threejs', label: 'Three.js', icon: '🌐', color: '#00f5ff', desc: '3D Digital Twin rendering engine. WebGL-powered interactive stadium visualization.' },
  { id: 'nextjs', label: 'Next.js 15', icon: '▲', color: '#ffffff', desc: 'React 19 framework with App Router, server components, and edge rendering.' },
  { id: 'maps', label: 'Google Maps', icon: '📍', color: '#22c55e', desc: 'Indoor positioning, POI routing, and real-time transit coordination.' },
]

const AI_MODULES = [
  { icon: '🧠', title: 'AI Command Center', desc: 'Unified HUD for real-time operational intelligence and decision support.', view: 'command' },
  { icon: '🏟', title: 'Digital Twin', desc: 'Interactive 3D stadium model with live operational overlays.', view: 'twin' },
  { icon: '👥', title: 'Crowd Intelligence', desc: 'Predictive crowd flow analysis with congestion forecasting.', view: 'crowd' },
  { icon: '🚌', title: 'Transport Intel', desc: 'Real-time fleet management and route optimization.', view: 'analytics' },
  { icon: '🚑', title: 'Emergency Response', desc: 'AI incident commander with automated response protocols.', view: 'emergency' },
  { icon: '🌱', title: 'Sustainability', desc: 'Carbon monitoring and energy optimization dashboard.', view: 'analytics' },
  { icon: '🙋', title: 'Volunteer Intelligence', desc: 'Smart task allocation and real-time volunteer positioning.', view: 'command' },
  { icon: '🎟', title: 'Fan Assistant', desc: 'Personalized AI concierge for every stadium visitor.', view: 'fan' },
  { icon: '♿', title: 'Accessibility', desc: 'Inclusive navigation and accommodation support.', view: 'fan' },
  { icon: '📊', title: 'Executive Analytics', desc: 'Strategic KPIs, predictive trends, and AI-generated reports.', view: 'analytics' },
  { icon: '🎨', title: 'AI Media Generator', desc: 'Real-time content and broadcast intelligence.', view: 'analytics' },
]

const ZONES = [
  { id: 'gate-a', label: 'Gate A', x: 30, y: 20, density: 94, status: 'CRITICAL' },
  { id: 'gate-b', label: 'Gate B', x: 70, y: 20, density: 72, status: 'HIGH' },
  { id: 'gate-c', label: 'Gate C', x: 15, y: 55, density: 55, status: 'MODERATE' },
  { id: 'gate-d', label: 'Gate D', x: 85, y: 55, density: 38, status: 'NORMAL' },
  { id: 'vip', label: 'VIP Zone', x: 50, y: 12, density: 61, status: 'MODERATE' },
  { id: 'medical', label: 'Medical', x: 50, y: 85, density: 12, status: 'NORMAL' },
  { id: 'field', label: 'Pitch', x: 50, y: 50, density: 0, status: 'ACTIVE' },
]

// ─── THREE.JS STADIUM COMPONENT ────────────────────────────────────────────
function StadiumCanvas({ mini = false }: { mini?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const el = mountRef.current
    const W = el.clientWidth || 500
    const H = el.clientHeight || 400

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000)
    camera.position.set(0, mini ? 5 : 6, mini ? 8 : 10)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    el.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    const mat = (color: number, opacity = 0.35) => new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })

    // Pitch
    const pitch = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), mat(0x00f5ff, 0.2))
    pitch.rotation.x = -Math.PI / 2
    pitch.position.y = -1.2
    group.add(pitch)

    // Pitch lines
    const lineGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(6, 0.01, 4))
    group.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.15 })))

    // Lower stands
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.8, 0.8, 48, 1, true), mat(0x00d4ff, 0.25)))

    // Upper stands
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.6, 1.2, 48, 1, true), mat(0xa855f7, 0.15))
    upper.position.y = 0.8
    group.add(upper)

    // Roof torus
    const roof = new THREE.Mesh(new THREE.TorusGeometry(5.5, 0.15, 8, 64), mat(0xF5A623, 0.4))
    roof.rotation.x = Math.PI / 2
    roof.position.y = 1.5
    group.add(roof)

    // Floodlight pillars
    ;[[-2.5, -1.8], [2.5, -1.8], [-2.5, 1.8], [2.5, 1.8]].forEach(([x, z]) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 8, 6), mat(0x00f5ff, 0.2))
      p.position.set(x, 2.5, z)
      group.add(p)
    })

    // Data orbit rings
    const orb = new THREE.Mesh(new THREE.TorusGeometry(7, 0.02, 4, 80), new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.3 }))
    orb.rotation.x = Math.PI / 2
    scene.add(orb)

    const orb2 = new THREE.Mesh(new THREE.TorusGeometry(8.5, 0.015, 4, 80), new THREE.MeshBasicMaterial({ color: 0xF5A623, transparent: true, opacity: 0.15 }))
    orb2.rotation.x = Math.PI / 3
    scene.add(orb2)

    // Crowd particles
    if (!mini) {
      const pGeo = new THREE.BufferGeometry()
      const pCount = 500
      const positions = new Float32Array(pCount * 3)
      for (let i = 0; i < pCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const r = 3.5 + Math.random() * 1.5
        positions[i * 3] = Math.cos(angle) * r
        positions[i * 3 + 1] = -0.8 + Math.random() * 0.6
        positions[i * 3 + 2] = Math.sin(angle) * r * 0.7
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00f5ff, size: 0.05, transparent: true, opacity: 0.6 }))
      group.add(particles)
    }

    // Mouse interaction
    let mouseX = 0, mouseY = 0
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouse)

    let raf: number
    const animate = () => {
      raf = requestAnimationFrame(animate)
      group.rotation.y += 0.003
      orb.rotation.y += 0.002
      orb2.rotation.z += 0.001
      if (!mini) {
        group.rotation.z = mouseX * 0.08
        group.rotation.x = mouseY * 0.05
      }
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      try { el.removeChild(renderer.domElement) } catch {}
      renderer.dispose()
    }
  }, [mini])

  return <div ref={mountRef} className="w-full h-full" />
}

// ─── FLOATING NAV ──────────────────────────────────────────────────────────
// ─── FLOATING NAV REMOVED (Replaced by Sidebar) ─────────────────────────────

// ─── AI CHAT PANEL ──────────────────────────────────────────────────────────
function AIChatPanel({ compact = false }: { compact?: boolean }) {
  const { chatHistory, addMessage, setThinking, isThinking, setAIStatus, setActiveModel, setLatency, addLog } = useStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isThinking])

  const sendMessage = useCallback(async () => {
    const q = input.trim()
    if (!q || isThinking) return
    setInput('')
    addMessage({ sender: 'user', text: q })
    setThinking(true)
    addLog({ text: `Operator query: "${q.substring(0, 60)}..."`, level: 'cyan' })

    try {
      setAIStatus('switching')
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, context: {} }),
      })
      if (!res.ok) throw new Error('API request failed')
      const result = await res.json()
      setAIStatus('online')
      setActiveModel(result.model)
      setLatency(result.latency)
      addMessage({ sender: 'ai', text: result.response, model: result.model, latency: result.latency })
      addLog({ text: `AI response via ${result.model} (${result.latency}ms)`, level: 'green' })
    } catch (err) {
      addMessage({ sender: 'ai', text: '**ERROR**: AI gateway temporarily unavailable. Please retry or consult manual protocols.', model: 'error' })
    } finally {
      setThinking(false)
      setAIStatus('online')
    }
  }, [input, isThinking, addMessage, setThinking, setAIStatus, setActiveModel, setLatency, addLog])

  const QUICK_PROMPTS = [
    'Predict crowd congestion near Gate A',
    'Summarize all active incidents',
    'What is the halftime transport plan?',
    'Generate emergency evacuation recommendation',
    'Analyze energy grid status',
  ]

  return (
    <div className={`glass flex flex-col ${compact ? 'h-full' : 'h-[500px]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse" />
          <span className="font-hud text-xs text-[#00f5ff] font-bold">AI COPILOT ASSISTANT</span>
        </div>
        <div className="flex items-center gap-2 font-hud text-[10px] text-white/40">
          <span>GEMINI 2.0 FLASH</span>
          <span className="text-white/20">|</span>
          <span>GROQ FALLBACK</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-[#00f5ff]/10 border border-[#00f5ff]/20 text-white rounded-tr-none'
                : 'bg-white/5 border border-white/8 text-white/85 rounded-tl-none'
            }`}>
              {msg.sender === 'ai' && (
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[#00f5ff] font-hud text-[9px]">🧠 ARENAMIND AI</span>
                  {msg.model && <span className="text-white/30 font-hud text-[9px]">• {msg.model}</span>}
                  {msg.latency && <span className="text-white/20 font-hud text-[9px]">{msg.latency}ms</span>}
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-none p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[#00f5ff] font-hud text-[9px]">🧠 ARENAMIND AI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="font-hud text-[10px] text-[#00f5ff]/60">Analyzing operational data...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {!compact && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => { setInput(p); }}
              className="flex-shrink-0 px-3 py-1 rounded-full border border-white/10 text-[10px] font-hud text-white/50 hover:text-[#00f5ff] hover:border-[#00f5ff]/30 transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask ArenaMind AI... (e.g. Predict crowd congestion near Gate B)"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#00f5ff]/40 font-sans transition-colors"
        />
        <button
          onClick={sendMessage}
          disabled={isThinking || !input.trim()}
          className="px-5 py-2.5 bg-[#00f5ff] text-black rounded-xl font-hud font-bold text-[10px] disabled:opacity-40 hover:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all"
        >
          {isThinking ? '...' : 'SEND'}
        </button>
      </div>
    </div>
  )
}

// ─── KPI CARDS ──────────────────────────────────────────────────────────────
function KPICard({ label, value, sub, color = '#00f5ff', icon }: {
  label: string; value: string; sub?: string; color?: string; icon: string
}) {
  return (
    <div className="glass glass-hover p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-lg">{icon}</span>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
      </div>
      <div className="font-hud text-xl font-bold" style={{ color }}>{value}</div>
      <div className="text-[10px] font-hud text-white/50 uppercase tracking-wider">{label}</div>
      {sub && <div className="text-[10px] text-white/30 font-sans">{sub}</div>}
    </div>
  )
}

function IncidentCard({ incident }: { incident: any }) {
  const { resolveIncident, addLog } = useStore()
  const colors: Record<string, string> = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' }
  const sevColor = colors[incident.severity] ?? '#00f5ff'

  return (
    <div className={`glass p-4 border-l-2 transition-all duration-300 ${incident.status === 'Resolved' ? 'opacity-50' : ''}`} style={{ borderLeftColor: sevColor }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-hud text-[10px] text-white/40">{incident.id}</span>
            <span className="font-hud text-[9px] px-1.5 py-0.5 rounded-full border" style={{ color: sevColor, borderColor: sevColor + '40' }}>{incident.severity}</span>
            <span className="font-hud text-[9px] text-white/30">{incident.time}</span>
          </div>
          <div className="text-xs font-semibold text-white mb-0.5">{incident.type}</div>
          <div className="text-[10px] text-white/50 font-hud">📍 {incident.location}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`font-hud text-[9px] px-2 py-0.5 rounded-full ${
            incident.status === 'Active' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
            incident.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>{incident.status}</span>
          <span className="font-hud text-[9px] text-[#00f5ff]">AI: {incident.confidence}%</span>
        </div>
      </div>
      <p className="text-[11px] text-white/60 mb-3 leading-relaxed">{incident.aiSummary}</p>
      {incident.status !== 'Resolved' && (
        <button
          onClick={() => {
            resolveIncident(incident.id)
            addLog({ text: `Incident ${incident.id} resolved by operator.`, level: 'green' })
          }}
          className="w-full py-1.5 rounded-lg border border-green-500/30 text-green-400 font-hud text-[10px] hover:bg-green-500/10 transition-colors"
        >
          ✓ MARK RESOLVED
        </button>
      )}
    </div>
  )
}

// ─── VIEWS ──────────────────────────────────────────────────────────────────

// 1. LANDING PAGE
function LandingView() {
  const router = useRouter()

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden pt-12">
      {/* 3D Background Elements for Landing - scaled up to hide any potential watermarks */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <video src="/Video2.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen scale-125 transform origin-center" />
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 w-full">
        <div className="flex flex-col items-center max-w-4xl w-full px-6">
        {/* Glassmorphism Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass p-12 w-full flex flex-col items-center justify-center border-t border-l border-white/20 shadow-[0_0_50px_rgba(0,245,255,0.1)] rounded-3xl backdrop-blur-2xl bg-[#0f111a]/60 relative overflow-hidden group"
        >
          {/* Internal Glow on Hover */}
          <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-[#00f5ff]/10 to-transparent opacity-0 group-hover:opacity-100 animate-[spin_4s_linear_infinite] transition-opacity duration-500 pointer-events-none" />
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-10 relative z-20 w-full max-w-[400px]"
          >
            <div className="rounded-3xl p-2 shadow-[0_0_80px_rgba(0,245,255,0.5)] border border-[#00f5ff]/30 bg-white/5 backdrop-blur-xl">
              <Image 
                src="/Logo.png" 
                alt="ArenaMind Logo" 
                width={1024} 
                height={1024} 
                className="w-full h-auto object-contain rounded-2xl" 
                priority
                quality={100}
              />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black font-sora tracking-tight text-center mb-4 text-white">
            ARENAMIND <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-[#00ff88]">AI</span>
          </h1>
          <p className="text-white/60 font-hud text-sm tracking-widest uppercase text-center max-w-lg leading-relaxed">
            The Generative AI Operating System for FIFA World Cup Stadiums
          </p>
        </motion.div>

        {/* Buttons Below Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
        >
          <button onClick={() => router.push('/about')} className="glass px-6 py-4 rounded-xl font-hud text-[10px] text-white/70 hover:text-white hover:bg-white/10 hover:border-[#00f5ff]/40 hover:shadow-[0_0_20px_rgba(0,245,255,0.2)] transition-all duration-300 transform hover:-translate-y-1">
            ABOUT
          </button>
          <button onClick={() => router.push('/contact')} className="glass px-6 py-4 rounded-xl font-hud text-[10px] text-white/70 hover:text-white hover:bg-white/10 hover:border-[#00f5ff]/40 hover:shadow-[0_0_20px_rgba(0,245,255,0.2)] transition-all duration-300 transform hover:-translate-y-1">
            CONTACT
          </button>
          <button onClick={() => router.push('/testimonials')} className="glass px-6 py-4 rounded-xl font-hud text-[10px] text-white/70 hover:text-white hover:bg-white/10 hover:border-[#00f5ff]/40 hover:shadow-[0_0_20px_rgba(0,245,255,0.2)] transition-all duration-300 transform hover:-translate-y-1">
            TESTIMONIALS
          </button>
          <button 
            onClick={() => router.push('/login')}
            className="px-6 py-4 rounded-xl font-hud text-[10px] bg-[#00f5ff] text-black font-bold border border-[#00f5ff] hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all duration-300 transform hover:-translate-y-1"
          >
            AUTHENTICATE ARENAMIND AI
          </button>
        </motion.div>
      </div>
      </div>
      <Footer />
    </div>
  )
}

// 2. AI COMMAND CENTER
function CommandCenterView() {
  const { incidents, systemLogs, attendance, crowdIndex, energyUsage, activeIncidents, volunteers, triggerEmergency, addLog, emergencyActive } = useStore()

  return (
    <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-16">
      {/* Emergency Banner */}
      {emergencyActive && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center gap-3 animate-pulse">
          <span className="text-xl">🚨</span>
          <div className="font-hud text-xs text-red-400">ACTIVE CRITICAL INCIDENT — Medical Emergency Section B12 — AI Response Initiated</div>
        </div>
      )}

      {/* AI Status banner */}
      <div className="mb-6 glass p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <div>
            <div className="font-hud text-xs text-green-400">ALL SYSTEMS OPERATIONAL</div>
            <div className="font-hud text-[10px] text-white/40 mt-0.5">MetLife Stadium • Argentina 🇦🇷 vs Brazil 🇧🇷 • 19:30 UTC</div>
          </div>
        </div>
        <div className="flex items-center gap-6 font-hud text-[10px] text-white/40">
          <div>GEMINI 2.0 FLASH <span className="text-green-400 ml-1">●</span></div>
          <div>GROQ FALLBACK <span className="text-yellow-400 ml-1">●</span></div>
          <div>FIREBASE <span className="text-[#00f5ff] ml-1">●</span></div>
          <div>TWIN ENGINE <span className="text-[#00f5ff] ml-1">●</span></div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        <KPICard icon="🏟" label="Attendance" value="67,842" sub="of 82,500" color="#00f5ff" />
        <KPICard icon="👥" label="Crowd Index" value={`${crowdIndex}%`} sub="Moderate" color="#F5A623" />
        <KPICard icon="⚠️" label="Incidents" value={`${activeIncidents} Active`} sub="2 monitoring" color={activeIncidents > 2 ? '#ef4444' : '#F5A623'} />
        <KPICard icon="🙋" label="Volunteers" value={volunteers.toLocaleString()} sub="deployed" color="#a855f7" />
        <KPICard icon="⚡" label="Energy" value={`${energyUsage}%`} sub="grid load" color="#22c55e" />
        <KPICard icon="🧠" label="AI Confidence" value="97%" sub="gemini-2.0" color="#00f5ff" />
      </div>

      {/* Main 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Logs + Incidents */}
        <div className="flex flex-col gap-4">
          {/* System Logs */}
          <div className="glass flex flex-col max-h-[300px]">
            <div className="p-3 border-b border-white/5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse" />
              <span className="font-hud text-[10px] text-[#00f5ff]">SYSTEM TELEMETRY</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {systemLogs.map((log, i) => (
                <div key={i} className="flex gap-2 font-hud text-[9px]">
                  <span className="text-white/25 flex-shrink-0">[{log.time}]</span>
                  <span className={`${log.level === 'red' ? 'text-red-400' : log.level === 'yellow' ? 'text-yellow-400' : log.level === 'green' ? 'text-green-400' : log.level === 'purple' ? 'text-purple-400' : 'text-[#00f5ff]'}`}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass p-4">
            <div className="font-hud text-[10px] text-white/40 uppercase mb-3">QUICK ACTIONS</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'SIMULATE EMERGENCY', color: '#ef4444', action: triggerEmergency, icon: '🚨' },
                { label: 'BROADCAST ALERT', color: '#F5A623', action: () => addLog({ text: 'PA broadcast: "Please use alternate Gate C exit."', level: 'yellow' }), icon: '📢' },
                { label: 'OPEN GATE D', color: '#22c55e', action: () => addLog({ text: 'Gate D auxiliary opened — reducing Gate A load by 28%.', level: 'green' }), icon: '🚪' },
                { label: 'DEPLOY VOLUNTEERS', color: '#a855f7', action: () => addLog({ text: '12 volunteers dispatched to Gate A North.', level: 'purple' }), icon: '🙋' },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={a.action}
                  className="p-3 rounded-lg border text-[10px] font-hud flex flex-col items-center gap-1 hover:bg-white/5 transition-colors"
                  style={{ borderColor: a.color + '40', color: a.color }}
                >
                  <span>{a.icon}</span>
                  <span className="text-center leading-tight">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Digital Twin mini + AI Chat */}
        <div className="flex flex-col gap-4">
          <div className="glass overflow-hidden h-[220px] relative">
            <div className="absolute inset-0 pitch-grid opacity-20" />
            <div className="absolute top-2 left-2 font-hud text-[9px] text-[#00f5ff]/60 z-10">DIGITAL TWIN — METLIFE STADIUM</div>
            <div className="absolute top-2 right-2 font-hud text-[9px] text-[#F5A623] z-10 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#F5A623] animate-ping" />LIVE
            </div>
            <StadiumCanvas mini />
          </div>
          <AIChatPanel compact />
        </div>

        {/* Right: Incidents + Recommendations */}
        <div className="flex flex-col gap-4 max-h-[700px] overflow-y-auto">
          <div className="font-hud text-[10px] text-white/40 uppercase px-1">ACTIVE INCIDENTS</div>
          {incidents.map(inc => <IncidentCard key={inc.id} incident={inc} />)}

          {/* AI Recommendation */}
          <div className="glass p-4 border-l-2 border-[#00f5ff]/50">
            <div className="font-hud text-[10px] text-[#00f5ff] mb-3">AI RECOMMENDATIONS</div>
            <div className="space-y-3">
              {[
                { priority: 'HIGH', action: 'Open Gate D immediately', reason: 'Bus arrival detected', impact: '-31% queue', confidence: 96 },
                { priority: 'MEDIUM', action: 'Deploy 4 stewards to Concourse 3', reason: 'Density spike predicted', impact: '-18% wait', confidence: 91 },
                { priority: 'LOW', action: 'Update digital signage at Gate A', reason: 'Visitor misdirection pattern', impact: '-12% confusion', confidence: 85 },
              ].map((r, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/3 border border-white/8">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-hud text-[9px] ${r.priority === 'HIGH' ? 'text-red-400' : r.priority === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}`}>{r.priority} PRIORITY</span>
                    <span className="font-hud text-[9px] text-[#00f5ff]">AI {r.confidence}%</span>
                  </div>
                  <div className="text-xs font-semibold text-white mb-0.5">{r.action}</div>
                  <div className="text-[10px] text-white/40">Reason: {r.reason}</div>
                  <div className="text-[10px] text-green-400 mt-1">Impact: {r.impact}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 3. DIGITAL TWIN
function DigitalTwinView() {
  const { selectedZone, setSelectedZone, addLog } = useStore()

  const handleZoneClick = (zone: typeof ZONES[0]) => {
    setSelectedZone(zone.id)
    addLog({ text: `Zone selected: ${zone.label} — AI analysis loading...`, level: 'cyan' })
  }

  const selectedZoneData = ZONES.find(z => z.id === selectedZone)
  const [activeLayers, setActiveLayers] = useState(['crowd', 'security', 'transport'])
  const layers = ['crowd', 'security', 'medical', 'volunteers', 'transport', 'weather', 'energy', 'emergency']

  return (
    <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">🏟 Digital Twin Explorer</h2>
        <p className="text-sm text-white/50">Interactive 3D stadium model — click zones to inspect operational data and AI insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Layer toggles */}
        <div className="glass p-4">
          <div className="font-hud text-[10px] text-[#00f5ff] mb-4">OPERATIONAL LAYERS</div>
          <div className="space-y-2">
            {layers.map(l => (
              <label key={l} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <div
                  onClick={() => setActiveLayers(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])}
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${activeLayers.includes(l) ? 'bg-[#00f5ff]/20 border-[#00f5ff]/50' : 'border-white/20'}`}
                >
                  {activeLayers.includes(l) && <div className="w-2 h-2 rounded-sm bg-[#00f5ff]" />}
                </div>
                <span className="font-hud text-[10px] text-white/60 uppercase">{l}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <div className="font-hud text-[10px] text-white/40 mb-2">DENSITY SCALE</div>
            {[['🟢', 'Normal', '#22c55e'], ['🟡', 'Moderate', '#eab308'], ['🟠', 'High', '#f97316'], ['🔴', 'Critical', '#ef4444']].map(([icon, label, color]) => (
              <div key={label} className="flex items-center gap-2 font-hud text-[10px]" style={{ color: color as string }}>
                <span>{icon}</span><span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Twin Canvas */}
        <div className="lg:col-span-2 glass overflow-hidden relative" style={{ minHeight: '500px' }}>
          <div className="absolute inset-0 pitch-grid opacity-20" />
          <div className="absolute top-3 left-3 z-10 font-hud text-[9px] text-[#00f5ff]/60">
            METLIFE STADIUM — EAST RUTHERFORD, NJ<br />
            CAPACITY: 82,500 | OCCUPANCY: 67,842 (82%)
          </div>

          {/* Hotspot zone overlays */}
          <div className="absolute inset-0 z-10">
            {ZONES.map(zone => {
              const color = zone.status === 'CRITICAL' ? '#ef4444' : zone.status === 'HIGH' ? '#f97316' : zone.status === 'MODERATE' ? '#eab308' : zone.status === 'ACTIVE' ? '#00f5ff' : '#22c55e'
              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[9px] font-hud font-bold hover:scale-125 transition-transform"
                    style={{ borderColor: color, backgroundColor: color + '20', color, boxShadow: selectedZone === zone.id ? `0 0 15px ${color}` : 'none' }}
                  >
                    {zone.density > 0 ? zone.density : '⚽'}
                  </div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-hud text-[8px] text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-1.5 py-0.5 rounded">
                    {zone.label}
                  </div>
                </button>
              )
            })}
          </div>

          <StadiumCanvas />
        </div>

        {/* Zone info panel */}
        <div className="flex flex-col gap-4">
          {selectedZoneData ? (
            <div className="glass p-5">
              <div className="font-hud text-[10px] text-[#00f5ff] mb-4">ZONE ANALYSIS</div>
              <h3 className="text-lg font-bold mb-1">{selectedZoneData.label}</h3>
              <div className={`inline-flex font-hud text-[9px] px-2 py-1 rounded-full mb-4 ${
                selectedZoneData.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                selectedZoneData.status === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>{selectedZoneData.status}</div>

              {selectedZoneData.density > 0 && (
                <>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/50">Occupancy</span>
                      <span className="font-hud text-white">{selectedZoneData.density}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${selectedZoneData.density}%`,
                          backgroundColor: selectedZoneData.density > 90 ? '#ef4444' : selectedZoneData.density > 70 ? '#f97316' : '#22c55e'
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#00f5ff]/5 border border-[#00f5ff]/15 mb-4">
                    <div className="font-hud text-[9px] text-[#00f5ff] mb-2">AI PREDICTION</div>
                    {selectedZoneData.density > 80
                      ? <p className="text-xs text-white/70">⚠️ High congestion expected in <span className="text-[#F5A623] font-bold">11 minutes</span>. Confidence: <span className="text-[#00f5ff]">94%</span></p>
                      : <p className="text-xs text-white/70">✓ Zone operating normally. No action required. Confidence: <span className="text-[#00f5ff]">91%</span></p>
                    }
                  </div>

                  <div>
                    <div className="font-hud text-[9px] text-white/40 mb-2">RECOMMENDATIONS</div>
                    <div className="space-y-1.5 text-[10px] text-white/60">
                      {(selectedZoneData.density > 80 ? [
                        'Open adjacent Gate D to distribute load',
                        'Deploy 4 additional stewards',
                        'Update dynamic signage routing',
                      ] : ['Continue standard monitoring', 'No immediate action required']
                      ).map((r, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-[#00f5ff] mt-0.5">→</span> {r}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="glass p-5 flex flex-col items-center justify-center h-48 text-center">
              <span className="text-3xl mb-3">👆</span>
              <div className="font-hud text-[10px] text-white/40">Click any zone hotspot to inspect operational data and AI insights</div>
            </div>
          )}

          {/* Live metrics */}
          <div className="glass p-4">
            <div className="font-hud text-[10px] text-white/40 mb-3">LIVE ZONE METRICS</div>
            <div className="space-y-2">
              {CROWD_DATA.map(z => (
                <div key={z.zone} className="flex items-center gap-2">
                  <div className="font-hud text-[10px] text-white/60 w-20">{z.zone}</div>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${z.density}%`, backgroundColor: z.color }} />
                  </div>
                  <div className="font-hud text-[10px] w-8 text-right" style={{ color: z.color }}>{z.density}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 4. CROWD INTELLIGENCE
function CrowdView() {
  const [timeline, setTimeline] = useState(0)
  const [selectedWindow, setSelectedWindow] = useState('+10 min')
  const windows = ['Now', '+5 min', '+10 min', '+15 min', '+30 min', '+60 min']

  const predictions = [
    { zone: 'Gate A', current: 94, predicted: [94, 97, 99, 95, 82, 68][timeline], risk: 'CRITICAL' },
    { zone: 'Gate B', current: 72, predicted: [72, 76, 81, 78, 65, 52][timeline], risk: 'HIGH' },
    { zone: 'Concourse', current: 83, predicted: [83, 88, 91, 86, 73, 60][timeline], risk: 'HIGH' },
    { zone: 'Gate C', current: 55, predicted: [55, 58, 62, 57, 48, 40][timeline], risk: 'MODERATE' },
    { zone: 'Gate D', current: 38, predicted: [38, 35, 33, 36, 42, 45][timeline], risk: 'NORMAL' },
  ]

  return (
    <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">👥 Crowd Intelligence</h2>
        <p className="text-sm text-white/50">Predictive crowd flow analysis — forecast congestion before it forms</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard icon="👥" label="Total Visitors" value="72,481" color="#00f5ff" />
        <KPICard icon="🎯" label="Peak Density" value="Gate A" sub="94% — Critical" color="#ef4444" />
        <KPICard icon="⚡" label="Flow Speed" value="1.3 m/s" sub="Average" color="#22c55e" />
        <KPICard icon="🧠" label="AI Confidence" value="96%" sub="prediction accuracy" color="#a855f7" />
      </div>

      {/* Timeline scrubber */}
      <div className="glass p-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="font-hud text-[10px] text-white/40">PREDICTION WINDOW:</span>
          <div className="flex gap-2">
            {windows.map((w, i) => (
              <button
                key={w}
                onClick={() => { setTimeline(i); setSelectedWindow(w) }}
                className={`px-3 py-1.5 rounded-lg font-hud text-[10px] transition-all ${selectedWindow === w ? 'bg-[#00f5ff]/20 border border-[#00f5ff]/40 text-[#00f5ff]' : 'border border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap visual */}
        <div className="lg:col-span-2 glass p-6 relative overflow-hidden">
          <div className="font-hud text-[10px] text-[#00f5ff] mb-4">CROWD DENSITY HEATMAP — {selectedWindow}</div>
          <div className="relative w-full h-64 bg-black/40 rounded-xl overflow-hidden border border-white/5">
            {/* Stadium layout simplified */}
            <div className="absolute inset-4 border border-[#00f5ff]/20 rounded-full" />
            <div className="absolute inset-12 border border-white/10 rounded-sm" />
            <div className="absolute inset-16 bg-[#00f5ff]/5 rounded-sm" />
            <div className="absolute inset-0 flex items-center justify-center font-hud text-[10px] text-[#00f5ff]/30">⚽ PITCH</div>

            {/* Density blobs */}
            {CROWD_DATA.map((z, i) => {
              const positions = [
                { x: '15%', y: '15%' }, { x: '75%', y: '15%' }, { x: '5%', y: '65%' },
                { x: '85%', y: '65%' }, { x: '45%', y: '5%' }, { x: '45%', y: '85%' },
              ]
              const pos = positions[i] || { x: '50%', y: '50%' }
              const color = z.density > 90 ? 'rgba(239,68,68,0.6)' : z.density > 75 ? 'rgba(249,115,22,0.5)' : z.density > 60 ? 'rgba(234,179,8,0.4)' : 'rgba(34,197,94,0.3)'
              const size = 30 + z.density * 0.5
              return (
                <div
                  key={z.zone}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse-slow"
                  style={{ left: pos.x, top: pos.y, width: `${size}px`, height: `${size}px`, background: color, filter: 'blur(8px)' }}
                />
              )
            })}
          </div>

          {/* Density bars */}
          <div className="mt-6 space-y-3">
            {predictions.map(p => (
              <div key={p.zone} className="flex items-center gap-3">
                <div className="font-hud text-[10px] text-white/60 w-20">{p.zone}</div>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${p.predicted}%`,
                      backgroundColor: p.predicted > 90 ? '#ef4444' : p.predicted > 75 ? '#f97316' : p.predicted > 60 ? '#eab308' : '#22c55e'
                    }}
                  />
                </div>
                <div className="font-hud text-[10px] w-8 text-right" style={{ color: p.predicted > 90 ? '#ef4444' : p.predicted > 75 ? '#f97316' : '#22c55e' }}>{p.predicted}%</div>
                <div className="font-hud text-[9px] w-20 text-right" style={{ color: p.predicted !== p.current ? (p.predicted > p.current ? '#ef4444' : '#22c55e') : '#ffffff40' }}>
                  {p.predicted > p.current ? `↑ +${p.predicted - p.current}%` : p.predicted < p.current ? `↓ -${p.current - p.predicted}%` : '→ stable'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Predictions + Recommendations */}
        <div className="flex flex-col gap-4">
          <div className="glass p-5">
            <div className="font-hud text-[10px] text-[#F5A623] mb-4">AI CROWD PREDICTION</div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
              <div className="font-hud text-[9px] text-red-400 mb-2">⚠️ CRITICAL ALERT</div>
              <div className="text-sm font-bold text-white mb-1">Gate A — 94% Occupancy</div>
              <div className="text-[11px] text-white/60 mb-2">Congestion imminent in <span className="text-[#F5A623] font-bold">11 minutes</span></div>
              <div className="font-hud text-[9px] text-[#00f5ff]">AI CONFIDENCE: 96%</div>
            </div>
            <div className="space-y-2 text-[10px] text-white/50">
              <div className="font-hud text-[9px] text-white/30 uppercase mb-2">Prediction Factors:</div>
              {['3 shuttle buses arriving simultaneously', 'Food court demand peaking (halftime -8 min)', 'Rain forecast increasing early arrival', 'Historical match pattern match'].map(f => (
                <div key={f} className="flex items-start gap-1.5">
                  <span className="text-[#00f5ff] mt-0.5">•</span> {f}
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-5">
            <div className="font-hud text-[10px] text-[#00f5ff] mb-4">AI RECOMMENDATIONS</div>
            <div className="space-y-3">
              {[
                { action: 'Open Gate D', reason: 'Reduce queue by 31%', impact: '↓ 28% congestion', priority: 'HIGH' },
                { action: 'Deploy 6 Volunteers', reason: 'Gate A crowd management', impact: '↓ 15% wait time', priority: 'HIGH' },
                { action: 'Redirect Digital Signage', reason: 'Route fans to Gate C', impact: '↓ 12% confusion', priority: 'MEDIUM' },
              ].map(r => (
                <div key={r.action} className="p-3 rounded-lg bg-white/3 border border-white/8">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-hud text-[9px] ${r.priority === 'HIGH' ? 'text-red-400' : 'text-yellow-400'}`}>{r.priority}</span>
                  </div>
                  <div className="text-xs font-semibold text-white mb-0.5">{r.action}</div>
                  <div className="text-[10px] text-white/40">{r.reason}</div>
                  <div className="text-[10px] text-green-400 mt-1">{r.impact}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 5. EMERGENCY RESPONSE
function EmergencyView() {
  const { incidents, triggerEmergency, addLog, emergencyActive } = useStore()
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved')

  return (
    <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-16">
      {emergencyActive && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">🚨</span>
            <div>
              <div className="font-hud text-sm text-red-400 font-bold">CRITICAL INCIDENT ACTIVE</div>
              <div className="font-hud text-[10px] text-white/60 mt-0.5">Medical Emergency — Section B12 | Time Since Detection: 01:42 | AI Confidence: 97%</div>
            </div>
          </div>
          <button onClick={() => addLog({ text: 'Emergency acknowledged by operator.', level: 'green' })} className="px-4 py-2 rounded-lg border border-red-500/40 text-red-400 font-hud text-[10px] hover:bg-red-500/10 transition-colors">
            ACKNOWLEDGE
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard icon="🚨" label="Active Incidents" value={`${activeIncidents.length}`} sub="requiring response" color={activeIncidents.length > 1 ? '#ef4444' : '#22c55e'} />
        <KPICard icon="🚑" label="Medical Teams" value="4 Ready" sub="ETA: 2 min avg" color="#00f5ff" />
        <KPICard icon="🛡" label="Security Units" value="28 Active" sub="all zones covered" color="#a855f7" />
        <KPICard icon="📡" label="AI Response" value="97%" sub="confidence score" color="#22c55e" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident list */}
        <div className="flex flex-col gap-4">
          <div className="glass p-3 flex items-center justify-between">
            <span className="font-hud text-[10px] text-[#00f5ff]">INCIDENT TIMELINE</span>
            <button
              onClick={triggerEmergency}
              className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 font-hud text-[9px] hover:bg-red-500/30 transition-colors"
            >
              + SIMULATE
            </button>
          </div>
          {incidents.map(inc => <IncidentCard key={inc.id} incident={inc} />)}
        </div>

        {/* AI Incident Analysis */}
        <div className="flex flex-col gap-4">
          <div className="glass p-5">
            <div className="font-hud text-[10px] text-[#00f5ff] mb-4">AI INCIDENT ANALYSIS</div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
              <div className="font-hud text-[9px] text-white/40 mb-2">AUTOMATED SUMMARY</div>
              <p className="text-xs text-white/70 leading-relaxed">
                Medical emergency detected in Section B12 at 18:42. Current crowd density in affected area is moderate (67%). Nearest medical response team can arrive within 2 minutes. Crowd evacuation is <strong className="text-green-400">not currently required</strong>.
              </p>
            </div>
            <div className="space-y-2">
              <div className="font-hud text-[9px] text-white/40 mb-2">EVIDENCE SOURCES:</div>
              {['Camera metadata — anomaly score 94%', 'Volunteer report confirmed at 18:43', 'Wearable health alert triggered', 'Manual confirmation received'].map(e => (
                <div key={e} className="flex items-center gap-2 text-[10px] text-white/60">
                  <span className="text-[#00f5ff]">●</span> {e}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-[#00f5ff]/5 border border-[#00f5ff]/15 flex items-center justify-between">
              <span className="font-hud text-[10px] text-white/50">AI CONFIDENCE</span>
              <span className="font-hud text-lg text-[#00f5ff] font-bold">97%</span>
            </div>
          </div>

          {/* CCTV grid simulation */}
          <div className="glass p-4">
            <div className="font-hud text-[10px] text-white/40 mb-3">CAMERA FEEDS</div>
            <div className="grid grid-cols-2 gap-2">
              {['Gate A CAM-01', 'Section B12 CAM-03', 'Medical Bay CAM-07', 'Exit E-4 CAM-12'].map((cam, i) => (
                <div key={cam} className="bg-black/60 rounded-lg p-3 aspect-video flex flex-col items-center justify-center border border-white/5">
                  <div className="font-hud text-[8px] text-white/40 mb-1">{cam}</div>
                  <div className={`font-hud text-[9px] ${i === 1 ? 'text-red-400' : 'text-green-400'}`}>
                    {i === 1 ? '⚠️ ANOMALY: 94%' : '✓ NOMINAL'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Response actions */}
        <div className="flex flex-col gap-4">
          <div className="glass p-5">
            <div className="font-hud text-[10px] text-[#F5A623] mb-4">RESPONSE ACTIONS</div>
            <div className="space-y-3">
              {[
                { label: 'Deploy Medical Team Alpha', icon: '🚑', color: '#ef4444', desc: 'ETA: 2 minutes to Section B12' },
                { label: 'Activate Emergency Exits E-4 & E-5', icon: '🚪', color: '#F5A623', desc: 'Section B12 evacuation corridors' },
                { label: 'Notify Security Perimeter', icon: '🛡', color: '#a855f7', desc: 'Maintain 10m crowd perimeter' },
                { label: 'Broadcast PA Announcement', icon: '📢', color: '#00f5ff', desc: 'Localized guidance in 3 languages' },
                { label: 'Prepare Ambulance Bay', icon: '🏥', color: '#22c55e', desc: 'Gate F ambulance access cleared' },
              ].map((action, i) => (
                <button
                  key={action.label}
                  onClick={() => addLog({ text: `ACTION: ${action.label} — Executed by operator.`, level: i === 0 ? 'red' : 'green' })}
                  className="w-full p-3 rounded-lg text-left border hover:bg-white/5 transition-colors"
                  style={{ borderColor: action.color + '30' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{action.icon}</span>
                    <span className="font-hud text-[10px] font-bold" style={{ color: action.color }}>{action.label}</span>
                  </div>
                  <div className="font-hud text-[9px] text-white/40 ml-5">{action.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass p-5">
            <div className="font-hud text-[10px] text-white/40 mb-3">RESOURCE STATUS</div>
            {[
              { label: 'Medical Teams', available: 4, total: 6, color: '#ef4444' },
              { label: 'Security Officers', available: 28, total: 35, color: '#a855f7' },
              { label: 'Volunteers', available: 892, total: 1284, color: '#00f5ff' },
            ].map(r => (
              <div key={r.label} className="mb-3">
                <div className="flex justify-between font-hud text-[10px] mb-1">
                  <span className="text-white/60">{r.label}</span>
                  <span style={{ color: r.color }}>{r.available} / {r.total}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(r.available / r.total) * 100}%`, backgroundColor: r.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 6. EXECUTIVE ANALYTICS
function AnalyticsView() {
  return (
    <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto pb-16">
      <div className="mb-6 glass p-5">
        <div className="font-hud text-[10px] text-[#F5A623] mb-2">AI EXECUTIVE BRIEFING</div>
        <h2 className="text-xl font-black mb-2">Today&apos;s stadium operations completed successfully.</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm text-white/70">
          {['Attendance reached 68,920 spectators ✓', 'Zero critical security incidents ✓', 'Entry time improved by 18% ✓', 'Carbon emissions reduced by 9% ✓'].map(s => (
            <div key={s} className="flex items-center gap-2">
              <span className="text-green-400">●</span> {s}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div>
            <div className="font-hud text-[10px] text-white/40">OVERALL PERFORMANCE</div>
            <div className="font-hud text-3xl text-[#00f5ff] font-black">96%</div>
            <div className="font-hud text-[10px] text-green-400">EXCELLENT</div>
          </div>
          <div className="h-12 w-px bg-white/10 mx-4" />
          <div>
            <div className="font-hud text-[10px] text-white/40">AI CONFIDENCE</div>
            <div className="font-hud text-3xl text-[#F5A623] font-black">98%</div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard icon="🏟" label="Attendance" value="68,920" sub="91% occupancy" color="#00f5ff" />
        <KPICard icon="⭐" label="Fan Satisfaction" value="4.8/5" sub="+12% vs last match" color="#F5A623" />
        <KPICard icon="🛡" label="Security Score" value="98%" sub="zero breaches" color="#22c55e" />
        <KPICard icon="🌱" label="Sustainability" value="92%" sub="-9% carbon" color="#a855f7" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-5">
          <div className="font-hud text-[10px] text-white/40 mb-4">ATTENDANCE TREND</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ANALYTICS_DATA}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" stroke="#ffffff30" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <YAxis stroke="#ffffff30" tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
              <Tooltip contentStyle={{ background: '#060d1a', border: '1px solid #ffffff10', borderRadius: 8, fontSize: 10 }} />
              <Area type="monotone" dataKey="attendance" stroke="#00f5ff" strokeWidth={2} fill="url(#cg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass p-5">
          <div className="font-hud text-[10px] text-white/40 mb-4">ENERGY DISTRIBUTION</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={ENERGY_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {ENERGY_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#060d1a', border: '1px solid #ffffff10', borderRadius: 8, fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {ENERGY_PIE.map(e => (
              <div key={e.name} className="flex items-center gap-1 font-hud text-[9px] text-white/50">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: e.color }} />
                {e.name}
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-5">
          <div className="font-hud text-[10px] text-white/40 mb-4">INCIDENTS PER DAY</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ANALYTICS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" stroke="#ffffff30" tick={{ fontSize: 10 }} />
              <YAxis stroke="#ffffff30" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#060d1a', border: '1px solid #ffffff10', borderRadius: 8, fontSize: 10 }} />
              <Bar dataKey="incidents" fill="#F5A623" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 glass p-5">
          <div className="font-hud text-[10px] text-white/40 mb-4">SUSTAINABILITY DASHBOARD</div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Carbon Emissions', value: '-9%', icon: '🌱', color: '#22c55e', sub: 'vs baseline' },
              { label: 'Energy Usage', value: '74%', icon: '⚡', color: '#F5A623', sub: 'grid load' },
              { label: 'Water Consumption', value: '-12%', icon: '💧', color: '#00f5ff', sub: 'optimized' },
              { label: 'Waste Recycling', value: '78%', icon: '♻️', color: '#a855f7', sub: 'sorted' },
              { label: 'Solar Generated', value: '23%', icon: '☀️', color: '#F5A623', sub: 'of total' },
              { label: 'LED Efficiency', value: '97%', icon: '💡', color: '#00f5ff', sub: 'all zones' },
            ].map(m => (
              <div key={m.label} className="p-3 rounded-lg bg-white/3 border border-white/8">
                <span className="text-xl block mb-1">{m.icon}</span>
                <div className="font-hud text-lg font-bold" style={{ color: m.color }}>{m.value}</div>
                <div className="font-hud text-[9px] text-white/40">{m.label}</div>
                <div className="font-hud text-[9px] text-white/25">{m.sub}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-green-500/5 border border-green-500/15">
            <div className="font-hud text-[9px] text-green-400 mb-1">AI RECOMMENDATION</div>
            <div className="text-xs text-white/60">Reduce HVAC usage by 8% during halftime — <strong className="text-green-400">Estimated Energy Savings: 12%</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 7. FAN ASSISTANT
function FanView() {
  const [fanInput, setFanInput] = useState('')
  const [fanMessages, setFanMessages] = useState([
    { sender: 'ai', text: "Welcome! 👋\n\nYour match begins in 1 hour. Gate A currently has moderate traffic. Walking through Gate C will save approximately 8 minutes. Rain is expected later this evening.\n\nWould you like a personalized route to your seat?" }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [lang, setLang] = useState('EN')

  const quickActions = [
    { icon: '🎟', label: 'My Ticket', q: 'Show my ticket — Seat B12, Row 18, Gate A' },
    { icon: '🗺', label: 'Navigate', q: 'Take me to my seat B12, Row 18' },
    { icon: '🍔', label: 'Food', q: 'Find vegetarian food options near me' },
    { icon: '🚌', label: 'Transport', q: 'When is the next bus leaving after the match?' },
    { icon: '🚻', label: 'Restrooms', q: 'Find nearest accessible restroom' },
    { icon: '🚨', label: 'Emergency', q: 'I need immediate medical assistance' },
  ]

  const sendFanQuery = async (q: string) => {
    const query = q || fanInput
    if (!query.trim()) return
    setFanInput('')
    setFanMessages(prev => [...prev, { sender: 'user', text: query }])
    setIsLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, context: { context: 'fan_assistant', lang } }),
      })
      if (!res.ok) throw new Error('API request failed')
      const result = await res.json()
      setFanMessages(prev => [...prev, { sender: 'ai', text: result.response }])
    } catch {
      setFanMessages(prev => [...prev, { sender: 'ai', text: "I'm here to help! Please try again or visit the nearest information desk." }])
    } finally {
      setIsLoading(false)
    }
  }

  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [fanMessages, isLoading])

  return (
    <div className="min-h-screen pt-24 px-6 max-w-5xl mx-auto pb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">🎟 Fan Assistant</h2>
        <p className="text-sm text-white/50">Your personal AI concierge — every fan should feel like they have a private guide</p>
      </div>

      {/* Match header */}
      <div className="glass p-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl mb-1">🇦🇷</div>
            <div className="font-hud text-xs text-white/60">Argentina</div>
          </div>
          <div className="text-center">
            <div className="font-hud text-xs text-white/40 mb-1">FIFA WORLD CUP 2026</div>
            <div className="font-bold text-xl">vs</div>
            <div className="font-hud text-[10px] text-[#00f5ff] mt-1">Kickoff 19:30 UTC</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-1">🇧🇷</div>
            <div className="font-hud text-xs text-white/60">Brazil</div>
          </div>
        </div>
        <div className="text-right">
          <div className="glass px-4 py-2 mb-2">
            <div className="font-hud text-[10px] text-white/40 mb-0.5">YOUR SEAT</div>
            <div className="font-bold text-[#00f5ff]">B12 • Row 18</div>
            <div className="font-hud text-[10px] text-white/50">Gate A</div>
          </div>
          <div className="flex gap-2 justify-end">
            {['EN', 'ES', 'AR', 'PT', 'FR'].map(l => (
              <button key={l} onClick={() => setLang(l)} className={`font-hud text-[9px] px-2 py-1 rounded border transition-colors ${lang === l ? 'border-[#00f5ff]/40 text-[#00f5ff]' : 'border-white/10 text-white/30 hover:text-white/60'}`}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="flex flex-col gap-4">
          <div className="glass p-4">
            <div className="font-hud text-[10px] text-white/40 mb-3 uppercase">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map(a => (
                <button
                  key={a.label}
                  onClick={() => sendFanQuery(a.q)}
                  className="glass glass-hover p-3 flex flex-col items-center gap-1 text-center cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <span className="text-xl">{a.icon}</span>
                  <span className="font-hud text-[9px] text-white/60">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation preview */}
          <div className="glass p-4">
            <div className="font-hud text-[10px] text-white/40 mb-3">YOUR ROUTE</div>
            <div className="space-y-2">
              {['Gate A (Current)', '→ Section B Corridor', '→ Row 18 Aisle', '→ Seat B12'].map((step, i) => (
                <div key={step} className="flex items-center gap-2 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-hud text-[9px] ${i === 0 ? 'bg-[#00f5ff]/20 text-[#00f5ff]' : 'bg-white/5 text-white/40'}`}>{i + 1}</div>
                  <span className={i === 0 ? 'text-[#00f5ff]' : 'text-white/50'}>{step}</span>
                </div>
              ))}
              <div className="font-hud text-[10px] text-[#22c55e] mt-2">⏱ Walking time: 4 min • 210m</div>
            </div>
          </div>
        </div>

        {/* Fan AI Chat */}
        <div className="lg:col-span-2 glass flex flex-col h-[500px]">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse" />
            <span className="font-hud text-xs text-[#00f5ff]">FAN ASSISTANT — ARENAMIND AI</span>
            <span className="ml-auto font-hud text-[9px] text-white/30">{lang} MODE</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {fanMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-[#00f5ff]/10 border border-[#00f5ff]/20 rounded-tr-none' : 'bg-white/5 border border-white/8 rounded-tl-none'}`}>
                  {msg.sender === 'ai' && <div className="font-hud text-[8px] text-[#00f5ff] mb-1.5">🤖 ARENAMIND AI CONCIERGE</div>}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-none p-3 flex gap-1">
                  {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={fanInput}
              onChange={e => setFanInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendFanQuery(fanInput)}
              placeholder={`Ask ArenaMind... (${lang}) — "Where is my seat?" or "Find food"`}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#00f5ff]/40 transition-colors"
            />
            <button onClick={() => sendFanQuery(fanInput)} disabled={isLoading || !fanInput.trim()} className="px-5 bg-[#00f5ff] text-black rounded-xl font-hud font-bold text-[10px] disabled:opacity-40 hover:shadow-[0_0_12px_rgba(0,245,255,0.3)] transition-all">ASK</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 9. MULTILINGUAL AI ASSISTANT
function MultilingualView() {
  const [inputText, setInputText] = useState('')
  const [selectedLang, setSelectedLang] = useState('ES')
  const [translatedText, setTranslatedText] = useState('')
  const [translationLogs, setTranslationLogs] = useState([
    { original: "Attention spectators: Gates A and B are experiencing moderate traffic. Please use Gate C for a faster exit.", translated: "Atención espectadores: Las puertas A y B están experimentando tráfico moderado. Utilice la puerta C para una salida más rápida.", lang: "ES", time: "19:45" },
    { original: "Medical team dispatched to Section B12. Please clear the corridor.", translated: "Équipe médicale envoyée à la section B12. Veuillez libérer le couloir.", lang: "FR", time: "18:43" }
  ])

  const handleTranslate = () => {
    if (!inputText.trim()) return
    const translations: Record<string, string> = {
      ES: "Hola, ¿dónde está mi asiento y cómo llego a la zona de comida?",
      FR: "Bonjour, où se trouve mon siège et comment puis-je accéder à l'espace restauration?",
      PT: "Olá, onde fica o meu assento e como chego à praça de alimentação?",
      AR: "مرحباً، أين مقعدي وكيف يمكنني الوصول إلى صالة الطعام؟",
      HI: "नमस्ते, मेरी सीट कहाँ है और मैं फ़ूड कोर्ट कैसे पहुँचूँ?",
      DE: "Hallo, wo ist mein Sitzplatz und wie komme ich zum Food-Court?",
      JA: "こんにちは、私の席はどこですか？フードコートへはどう行けばいいですか？",
      KO: "안녕하세요, 제 좌석은 어디이고 푸드코트에는 어떻게 가나요?",
      ZH: "你好，我的座位在哪里？我该怎么去美食广场？"
    }
    const result = translations[selectedLang] || `Translated to ${selectedLang}: ${inputText}`
    setTranslatedText(result)
    setTranslationLogs(prev => [
      { original: inputText, translated: result, lang: selectedLang, time: new Date().toISOString().substring(11, 16) },
      ...prev
    ])
    setInputText('')
  }

  return (
    <div className="min-h-screen pt-24 px-6 max-w-6xl mx-auto pb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">🌍 Multilingual AI Assistant</h2>
        <p className="text-sm text-white/50">Real-time stadium announcement translation and fan communication</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Translation tool */}
        <div className="lg:col-span-2 glass p-6 flex flex-col gap-6">
          <div className="font-hud text-[10px] text-[#00f5ff]">REAL-TIME TRANSLATOR</div>
          
          <div className="flex flex-col gap-2">
            <label className="font-hud text-[9px] text-white/40">SELECT TARGET LANGUAGE</label>
            <div className="flex flex-wrap gap-2">
              {['ES', 'FR', 'PT', 'AR', 'HI', 'DE', 'JA', 'KO', 'ZH'].map(l => (
                <button
                  key={l}
                  onClick={() => setSelectedLang(l)}
                  className={`px-3 py-1.5 rounded-lg font-hud text-[10px] border transition-all ${selectedLang === l ? 'bg-[#00f5ff]/20 border-[#00f5ff]/40 text-[#00f5ff]' : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}
                >
                  {l === 'ES' && '🇪🇸 Spanish'}
                  {l === 'FR' && '🇫🇷 French'}
                  {l === 'PT' && '🇵🇹 Portuguese'}
                  {l === 'AR' && '🇸🇦 Arabic'}
                  {l === 'HI' && '🇮🇳 Hindi'}
                  {l === 'DE' && '🇩🇪 German'}
                  {l === 'JA' && '🇯🇵 Japanese'}
                  {l === 'KO' && '🇰🇷 Korean'}
                  {l === 'ZH' && '🇨🇳 Chinese'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-hud text-[9px] text-white/40">INPUT ANNOUNCEMENT OR TEXT</label>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Type stadium instructions or fan questions to translate..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#00f5ff]/40 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleTranslate}
              className="px-6 py-3 bg-[#00f5ff] text-black font-hud font-bold text-[10px] rounded-xl hover:shadow-[0_0_15px_rgba(0,245,255,0.4)] transition-all"
            >
              TRANSLATE & BROADCAST
            </button>
          </div>

          {translatedText && (
            <div className="p-4 rounded-xl bg-white/3 border border-[#00f5ff]/20">
              <div className="font-hud text-[9px] text-[#00f5ff] mb-1">TRANSLATED OUTPUT ({selectedLang})</div>
              <p className="text-sm font-bold text-white leading-relaxed">{translatedText}</p>
            </div>
          )}
        </div>

        {/* Translation logs */}
        <div className="glass p-5">
          <div className="font-hud text-[10px] text-white/40 mb-4">BROADCAST LOGS</div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {translationLogs.map((log, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/3 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[9px] font-hud text-white/30">
                  <span>LANG: {log.lang}</span>
                  <span>{log.time}</span>
                </div>
                <div className="text-[11px] text-white/50">{log.original}</div>
                <div className="text-[11px] text-[#00f5ff] font-semibold">{log.translated}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 10. TRANSPORT INTELLIGENCE
function TransportView() {
  const [selectedGate, setSelectedGate] = useState('Gate A')
  const [transitMethod, setTransitMethod] = useState('Metro')
  const [routeResult, setRouteResult] = useState<any>(null)

  const handleRouteCalc = () => {
    const data: Record<string, Record<string, any>> = {
      'Gate A': {
        Metro: { option: 'Metro Line 2', dep: 'Gate A West Exit', wait: '8 min', crowd: 'Medium', time: '12 min' },
        Bus: { option: 'Shuttle Bus Alpha', dep: 'Bus Bay 3', wait: '15 min', crowd: 'High', time: '20 min' },
        'Ride-share': { option: 'Uber/Lyft Zone 1', dep: 'North Lot', wait: '10 min', crowd: 'Low', time: '15 min' }
      },
      'Gate C': {
        Metro: { option: 'Metro Line 1', dep: 'Gate C Station', wait: '4 min', crowd: 'Low', time: '10 min' },
        Bus: { option: 'Shuttle Bus Beta', dep: 'Bus Bay 1', wait: '5 min', crowd: 'Low', time: '14 min' },
        'Ride-share': { option: 'Uber/Lyft Zone 2', dep: 'South Lot', wait: '20 min', crowd: 'High', time: '25 min' }
      }
    }
    const result = (data[selectedGate] || data['Gate A'])[transitMethod]
    setRouteResult(result)
  }

  return (
    <div className="min-h-screen pt-24 px-6 max-w-6xl mx-auto pb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">🚌 Transport Intelligence</h2>
        <p className="text-sm text-white/50">Real-time transit optimization, scheduling, and traffic management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard icon="🚇" label="Metro Service" value="Nominal" sub="Trains every 4 min" color="#22c55e" />
        <KPICard icon="🚌" label="Shuttle Buses" value="18 Active" sub="ETA: 6 min avg" color="#00f5ff" />
        <KPICard icon="🚗" label="Ride-share Wait" value="12 min" sub="Zone 1 & 2 active" color="#a855f7" />
        <KPICard icon="🚦" label="Perimeter Traffic" value="Moderate" sub="Speeds: 24 km/h" color="#eab308" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transit Schedules */}
        <div className="lg:col-span-2 glass p-6">
          <div className="font-hud text-[10px] text-[#00f5ff] mb-4">TRANSIT TIMETABLE & CAPACITY</div>
          <div className="space-y-4">
            {[
              { name: 'Metro Line 2 (Northbound)', gate: 'Gate A Station', freq: 'Every 6 min', capacity: '82%', status: 'Nominal', color: '#22c55e' },
              { name: 'Metro Line 1 (Southbound)', gate: 'Gate C Station', freq: 'Every 4 min', capacity: '64%', status: 'Nominal', color: '#22c55e' },
              { name: 'Shuttle Bus Alpha (City Center)', gate: 'Bus Bay 3', freq: 'Every 10 min', capacity: '94%', status: 'Delayed', color: '#ef4444' },
              { name: 'Shuttle Bus Beta (Express)', gate: 'Bus Bay 1', freq: 'Every 8 min', capacity: '45%', status: 'Nominal', color: '#22c55e' }
            ].map(t => (
              <div key={t.name} className="p-4 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{t.name}</div>
                  <div className="font-hud text-[10px] text-white/40 mt-1">DEPARTS FROM: {t.gate} • FREQUENCY: {t.freq}</div>
                </div>
                <div className="text-right">
                  <span className="font-hud text-[9px] px-2 py-0.5 rounded border mr-2" style={{ color: t.color, borderColor: t.color + '40' }}>{t.status}</span>
                  <span className="font-hud text-[10px] text-white/60">Load: {t.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Optimizer */}
        <div className="glass p-5 flex flex-col gap-4">
          <div className="font-hud text-[10px] text-[#00f5ff]">AI TRANSPORT ROUTE OPTIMIZER</div>
          
          <div className="flex flex-col gap-1.5">
            <label className="font-hud text-[9px] text-white/40">SELECT STADIUM GATE</label>
            <select
              value={selectedGate}
              onChange={e => setSelectedGate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#00f5ff]/40"
            >
              <option value="Gate A">Gate A (North Concourse)</option>
              <option value="Gate C">Gate C (South Concourse)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-hud text-[9px] text-white/40">CHOOSE TRANSIT METHOD</label>
            <div className="grid grid-cols-3 gap-2">
              {['Metro', 'Bus', 'Ride-share'].map(m => (
                <button
                  key={m}
                  onClick={() => setTransitMethod(m)}
                  className={`py-2 rounded-lg font-hud text-[9px] border transition-all ${transitMethod === m ? 'bg-[#00f5ff]/20 border-[#00f5ff]/40 text-[#00f5ff]' : 'border-white/10 text-white/40 hover:text-white'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRouteCalc}
            className="w-full py-3 bg-[#00f5ff] text-black font-hud font-bold text-[10px] rounded-xl hover:shadow-[0_0_15px_rgba(0,245,255,0.4)] transition-all"
          >
            CALCULATE ROUTE
          </button>

          {routeResult && (
            <div className="p-4 rounded-xl bg-white/3 border border-[#00f5ff]/20 space-y-3">
              <div className="font-hud text-[9px] text-[#00f5ff]">OPTIMIZED ROUTE SUGGESTION</div>
              <div>
                <div className="font-bold text-white text-sm">{routeResult.option}</div>
                <div className="text-[10px] text-white/50 mt-0.5">Location: {routeResult.dep}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] border-t border-white/5 pt-2">
                <div>
                  <div className="text-white/40">WAIT</div>
                  <div className="font-bold text-white">{routeResult.wait}</div>
                </div>
                <div>
                  <div className="text-white/40">CROWD</div>
                  <div className="font-bold text-white">{routeResult.crowd}</div>
                </div>
                <div>
                  <div className="text-white/40">TRAVEL</div>
                  <div className="font-bold text-[#22c55e]">{routeResult.time}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 11. ACCESSIBILITY COPILOT
function AccessibilityView() {
  const [accessibilityLogs, setAccessibilityLogs] = useState([
    { id: "ACC-01", type: "Elevator Request", zone: "Section B12", time: "19:12", status: "Resolved" },
    { id: "ACC-02", type: "Wheelchair Escort", zone: "Gate A Entry", time: "18:50", status: "Active" }
  ])

  return (
    <div className="min-h-screen pt-24 px-6 max-w-6xl mx-auto pb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">♿ Accessibility Copilot</h2>
        <p className="text-sm text-white/50">Dedicated assistance, wheelchair-friendly routing, and audio guides</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard icon="♿" label="Wheelchair Escorts" value="12 Active" sub="avg wait: 3 min" color="#00f5ff" />
        <KPICard icon="🛗" label="Elevator Status" value="14 / 15 Active" sub="Lift 5 maintenance" color="#a855f7" />
        <KPICard icon="🔊" label="Audio Guides" value="142 users" sub="multilingual channels" color="#22c55e" />
        <KPICard icon="👁️" label="High Contrast" value="Active" sub="operator comfort" color="#22c55e" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assistive Setup */}
        <div className="glass p-6">
          <div className="font-hud text-[10px] text-[#00f5ff] mb-4">ACCESSIBILITY SETTINGS</div>
          <div className="space-y-4">
            {[
              { label: 'Screen Reader Optimization', desc: 'Enables alt tags and focus ring highlights' },
              { label: 'High Contrast Mode', desc: 'Maximizes dashboard readability' },
              { label: 'Audio Assistance Channel', desc: 'Automatic narration of system logs' },
              { label: 'Wheelchair Route Priority', desc: 'Forces maps to prefer elevators/ramps' }
            ].map((s, i) => (
              <div key={s.label} className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/5">
                <div>
                  <div className="text-xs font-bold text-white">{s.label}</div>
                  <div className="text-[10px] text-white/40">{s.desc}</div>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={i === 1 || i === 3} className="sr-only peer" />
                  <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00f5ff]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lift & Ramp Status */}
        <div className="glass p-6">
          <div className="font-hud text-[10px] text-white/40 mb-4">ELEVATORS & RAMPS</div>
          <div className="space-y-3">
            {[
              { name: 'North Concourse Lift 1', status: 'Operational', color: '#22c55e' },
              { name: 'North Concourse Lift 2', status: 'Operational', color: '#22c55e' },
              { name: 'South Concourse Lift 5', status: 'Maintenance', color: '#ef4444' },
              { name: 'East Gate Ramp 2', status: 'Nominal', color: '#22c55e' }
            ].map(l => (
              <div key={l.name} className="p-3 rounded-lg bg-white/3 border border-white/5 flex justify-between items-center">
                <span className="text-xs text-white/70 font-semibold">{l.name}</span>
                <span className="font-hud text-[9px] px-2 py-0.5 rounded border" style={{ color: l.color, borderColor: l.color + '40' }}>{l.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assistance Logs */}
        <div className="glass p-5">
          <div className="font-hud text-[10px] text-white/40 mb-4">ACTIVE ASSISTANCE REQUESTS</div>
          <div className="space-y-3">
            {accessibilityLogs.map(log => (
              <div key={log.id} className="p-3 rounded-lg bg-white/3 border border-white/5 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-xs">{log.type}</div>
                  <div className="font-hud text-[9px] text-white/40 mt-0.5">ZONE: {log.zone} • {log.time}</div>
                </div>
                <button
                  onClick={() => setAccessibilityLogs(prev => prev.map(p => p.id === log.id ? { ...p, status: 'Resolved' } : p))}
                  disabled={log.status === 'Resolved'}
                  className={`px-3 py-1 rounded font-hud text-[8px] border transition-all ${log.status === 'Resolved' ? 'border-white/10 text-white/30 cursor-default' : 'border-green-500/40 text-green-400 hover:bg-green-500/10'}`}
                >
                  {log.status === 'Resolved' ? 'RESOLVED' : 'RESOLVE'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 12. VOLUNTEER COORDINATION
function VolunteerView() {
  const [volTaskLogs, setVolTaskLogs] = useState([
    { text: "Assigned 10 volunteers to Gate A to handle traffic bottleneck.", level: "green" },
    { text: "VIP Escort request complete for Suite 4.", level: "cyan" }
  ])

  return (
    <div className="min-h-screen pt-24 px-6 max-w-6xl mx-auto pb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">🙋 Volunteer Coordination</h2>
        <p className="text-sm text-white/50">Volunteer scheduling, task delegation, and dispatch logs</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard icon="🙋" label="Volunteers Checked-In" value="892 / 1,284" sub="70% capacity" color="#00f5ff" />
        <KPICard icon="📋" label="Active Assignments" value="12 Tasks" sub="all zones covered" color="#a855f7" />
        <KPICard icon="📈" label="Operational Efficiency" value="98%" sub="staffing matches load" color="#22c55e" />
        <KPICard icon="🚨" label="Open Requests" value="3 alerts" sub="requiring support" color="#ef4444" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Board */}
        <div className="lg:col-span-2 glass p-6">
          <div className="font-hud text-[10px] text-[#00f5ff] mb-4">ACTIVE DELEGATIONS</div>
          <div className="space-y-4">
            {[
              { task: 'Assist Gate A Congestion', volunteers: 10, zone: 'Gate A — North Concourse', urgency: 'HIGH', color: '#ef4444' },
              { task: 'Accessibility Guide Escort', volunteers: 2, zone: 'Section B12 Ramp', urgency: 'MEDIUM', color: '#F5A623' },
              { task: 'Sustainability Waste Audit', volunteers: 5, zone: 'Food Court B', urgency: 'LOW', color: '#22c55e' }
            ].map(t => (
              <div key={t.task} className="p-4 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{t.task}</div>
                  <div className="font-hud text-[10px] text-white/40 mt-1">ZONE: {t.zone} • ASSIGNED: {t.volunteers} Volunteers</div>
                </div>
                <div className="text-right">
                  <span className="font-hud text-[9px] px-2 py-0.5 rounded border" style={{ color: t.color, borderColor: t.color + '40' }}>{t.urgency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Dispatch Console */}
        <div className="glass p-5 flex flex-col gap-4">
          <div className="font-hud text-[10px] text-white/40">VOLUNTEER ALERT DISPATCH</div>
          <p className="text-[10px] text-white/50">Send mass notification alerts to active volunteers on shift.</p>
          
          <button
            onClick={() => setVolTaskLogs(prev => [
              { text: `Dispatched ${Math.floor(Math.random() * 5) + 3} volunteers to Gate C for entry assistance.`, level: "green" },
              ...prev
            ])}
            className="w-full py-3 bg-[#00f5ff] text-black font-hud font-bold text-[10px] rounded-xl hover:shadow-[0_0_15px_rgba(0,245,255,0.4)] transition-all"
          >
            DISPATCH SURGE TEAM TO GATE C
          </button>

          <div className="border-t border-white/5 pt-3">
            <div className="font-hud text-[9px] text-white/40 mb-2 uppercase">DISPATCH HISTORY</div>
            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {volTaskLogs.map((log, i) => (
                <div key={i} className="text-[10px] text-white/70 flex gap-2">
                  <span className={log.level === 'green' ? 'text-green-400' : 'text-cyan-400'}>●</span>
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 13. SUSTAINABILITY INSIGHTS
function SustainabilityView() {
  return (
    <div className="min-h-screen pt-24 px-6 max-w-6xl mx-auto pb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">🌱 Sustainability Insights</h2>
        <p className="text-sm text-white/50">Carbon footprint monitoring, energy conservation, and eco efficiency recommendations</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="glass p-3 rounded-lg border-white/5 text-center">
          <div className="text-lg">🌱</div>
          <div className="font-hud text-lg font-bold text-green-400 mt-1">-9%</div>
          <div className="font-hud text-[8px] text-white/40">CARBON EMISSIONS</div>
        </div>
        <div className="glass p-3 rounded-lg border-white/5 text-center">
          <div className="text-lg">⚡</div>
          <div className="font-hud text-lg font-bold text-yellow-400 mt-1">74%</div>
          <div className="font-hud text-[8px] text-white/40">ENERGY LOAD</div>
        </div>
        <div className="glass p-3 rounded-lg border-white/5 text-center">
          <div className="text-lg">💧</div>
          <div className="font-hud text-lg font-bold text-[#00f5ff] mt-1">-12%</div>
          <div className="font-hud text-[8px] text-white/40">WATER USE</div>
        </div>
        <div className="glass p-3 rounded-lg border-white/5 text-center">
          <div className="text-lg">♻️</div>
          <div className="font-hud text-lg font-bold text-purple-400 mt-1">78%</div>
          <div className="font-hud text-[8px] text-white/40">WASTE RECYCLING</div>
        </div>
        <div className="glass p-3 rounded-lg border-white/5 text-center">
          <div className="text-lg">☀️</div>
          <div className="font-hud text-lg font-bold text-yellow-400 mt-1">23%</div>
          <div className="font-hud text-[8px] text-white/40">SOLAR LOAD</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sustainability Goals */}
        <div className="lg:col-span-2 glass p-6">
          <div className="font-hud text-[10px] text-[#00f5ff] mb-4">ENERGY DISTRIBUTION METRICS</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'LED Efficiency', value: '97%', icon: '💡', desc: 'Smart sensors active' },
              { label: 'HVAC Optimization', value: '88%', icon: '🌡️', desc: 'Eco setting' },
              { label: 'EV Shuttle Fleet', value: '100%', icon: '🚗', desc: 'Fully electric transit' }
            ].map(m => (
              <div key={m.label} className="p-4 rounded-xl bg-white/3 border border-white/5 text-center">
                <span className="text-2xl">{m.icon}</span>
                <div className="font-hud text-lg font-bold text-white mt-1">{m.value}</div>
                <div className="font-hud text-[10px] text-white/50">{m.label}</div>
                <div className="font-hud text-[9px] text-white/30">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass p-5">
          <div className="font-hud text-[10px] text-green-400 mb-4">🌱 GREEN AI RECOMMENDATION</div>
          <div className="space-y-3">
            {[
              { action: 'Halftime HVAC Reduction', desc: 'Reduce stadium air conditioning by 8% during halftime surge.', savings: '12% Energy' },
              { action: 'Water Recycling Valve Open', desc: 'Optimize pitch irrigation using greywater storage tanks.', savings: '15% Fresh Water' }
            ].map(rec => (
              <div key={rec.action} className="p-3 rounded-lg bg-white/3 border border-green-500/10">
                <div className="text-xs font-bold text-white mb-0.5">{rec.action}</div>
                <div className="text-[10px] text-white/50 leading-relaxed mb-2">{rec.desc}</div>
                <div className="font-hud text-[9px] text-green-400 font-bold uppercase">Estimated Savings: {rec.savings}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 8. PROFILE VIEW
import { updateProfile } from 'firebase/auth'
import { auth as firebaseAuth } from '@/lib/firebase'

function ProfileView() {
  const { user, setUser } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user?.displayName || '')
  const [editPhotoURL, setEditPhotoURL] = useState(user?.photoURL || '')
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    if (!firebaseAuth.currentUser) return
    setIsSaving(true)
    try {
      await updateProfile(firebaseAuth.currentUser, {
        displayName: editName,
        photoURL: editPhotoURL
      })
      setUser({ ...firebaseAuth.currentUser } as any)
      setIsEditing(false)
    } catch (err) {
      console.error("Failed to update profile", err)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !firebaseAuth.currentUser) return
    setIsSaving(true)
    try {
      const storageRef = ref(storage, `profiles/${firebaseAuth.currentUser.uid}/${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      await updateProfile(firebaseAuth.currentUser, {
        photoURL: downloadURL
      })
      setUser({ ...firebaseAuth.currentUser } as any)
      setEditPhotoURL(downloadURL)
    } catch (err) {
      console.error("Upload failed", err)
      alert("Upload failed. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 px-6 max-w-4xl mx-auto pb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-black mb-1">👤 Operator Profile</h2>
        <p className="text-sm text-white/50">Manage your ArenaMind AI credentials</p>
      </div>

      <div className="glass p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 bg-[#0a0c16]/85 backdrop-blur-2xl">
        <div className="relative group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
          />
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#00f5ff]/40 shadow-[0_0_30px_rgba(0,245,255,0.2)] bg-[#020205] flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <span className="text-4xl text-white/20">US</span>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity font-hud text-[10px] text-white cursor-pointer hover:bg-black/80"
          >
            UPLOAD
          </button>
        </div>
        
        <div className="flex-1 text-center md:text-left w-full">
          <div className="font-hud text-[10px] text-[#00f5ff] mb-1">AUTHENTICATED VIA GOOGLE</div>
          
          {isEditing ? (
            <div className="space-y-4 max-w-md mt-2">
              <div className="flex flex-col gap-1">
                <label className="font-hud text-[8px] text-white/40">DISPLAY NAME</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f5ff]/40 w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-hud text-[8px] text-white/40">AVATAR PHOTO URL</label>
                <input
                  type="text"
                  value={editPhotoURL}
                  placeholder="https://example.com/photo.jpg"
                  onChange={e => setEditPhotoURL(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f5ff]/40 w-full"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#00f5ff] text-black font-hud text-[10px] font-bold rounded-lg hover:shadow-[0_0_12px_rgba(0,245,255,0.3)] transition-all disabled:opacity-50"
                >
                  {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditName(user?.displayName || '')
                    setEditPhotoURL(user?.photoURL || '')
                  }}
                  className="px-4 py-2 border border-white/10 text-white/60 font-hud text-[10px] rounded-lg hover:text-white transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-white mb-2">{user?.displayName || 'ArenaMind Operator'}</h3>
              <div className="text-white/60 mb-6">{user?.email || 'admin@arenamind.ai'}</div>
              
              <div className="flex gap-4 justify-center md:justify-start">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/30 rounded-lg font-hud text-[10px] hover:bg-[#00f5ff] hover:text-black transition-colors"
                >
                  EDIT PROFILE
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function ArenaMindApp() {
  const { activeView, activeModel, latency, isAuthenticated, isSidebarCollapsed } = useStore()
  const router = useRouter()
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { hour12: false }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!isAuthenticated) {
    return <LandingView />
  }

  const renderView = () => {
    switch (activeView) {
      case 'landing':
      case 'command': return <CommandCenterView />
      case 'twin': return <DigitalTwinView />
      case 'crowd': return <CrowdView />
      case 'emergency': return <EmergencyView />
      case 'analytics': return <AnalyticsView />
      case 'fan': return <FanView />
      case 'profile': return <ProfileView />
      case 'multilingual': return <MultilingualView />
      case 'transport': return <TransportView />
      case 'accessibility': return <AccessibilityView />
      case 'volunteer': return <VolunteerView />
      case 'sustainability': return <SustainabilityView />
      default: return <CommandCenterView />
    }
  }

  return (
    <div className="relative min-h-screen bg-[#020205] pitch-grid">
      <SplashWrapper>
        {/* 3D Background Video & Image */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <Image src="/stadium_bg.png" alt="Stadium" fill className="object-cover opacity-20 mix-blend-screen" priority />
          <video src="/Video2.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen" />
        </div>

      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#00f5ff]/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#a855f7]/3 rounded-full blur-[80px]" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className={`relative z-10 pr-6 pt-6 pb-20 transition-all duration-300 ${isSidebarCollapsed ? 'pl-[120px]' : 'pl-[300px]'}`}>
        {renderView()}
      </main>

      {/* Bottom status bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0c16]/85 backdrop-blur-2xl border-t border-white/5 px-8 py-3.5 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-6 font-hud text-[10px] text-white/40">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse" />
            <span className="font-bold text-white tracking-widest uppercase">ARENAMIND OS v2.0</span>
          </div>
          <span className="text-white/10">|</span>
          <span className="tracking-wide">FIFA WORLD CUP 2026</span>
          <span className="text-white/10">|</span>
          <span className="text-[#00f5ff] font-bold">METLIFE STADIUM (NJ/NY)</span>
          {timeStr && (
            <>
              <span className="text-white/10">|</span>
              <span className="text-white/60 font-hud tabular-nums">{timeStr} UTC</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-6 font-hud text-[10px]">
          <span className="text-white/30 uppercase">GATEWAY: <span className="text-[#00f5ff] font-semibold">{activeModel}</span></span>
          <span className="text-white/10">|</span>
          {latency > 0 && (
            <>
              <span className="text-white/30">RTT: <span className="text-green-400 font-semibold">{latency}ms</span></span>
              <span className="text-white/10">|</span>
            </>
          )}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/15">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 font-bold text-[9px] tracking-wide uppercase">SYSTEMS NOMINAL</span>
          </div>
        </div>
      </footer>
      </SplashWrapper>
    </div>
  )
}
