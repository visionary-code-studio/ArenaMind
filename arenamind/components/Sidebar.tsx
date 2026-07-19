'use client'

import { useStore } from '@/store/useStore'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, Server, BarChart3, Users, ShieldAlert, User, UserCircle, LogOut, Moon, Sun, PanelLeftClose, PanelLeftOpen,
  Compass, Languages, Bus, Accessibility, UserCheck, Leaf
} from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const NAV_ITEMS = [
  { id: 'command', icon: LayoutDashboard, label: 'AI Command Center' },
  { id: 'twin', icon: Server, label: 'Digital Twin' },
  { id: 'crowd', icon: Users, label: 'Crowd Prediction & Management' },
  { id: 'fan', icon: Compass, label: 'Smart Fan Navigation' },
  { id: 'multilingual', icon: Languages, label: 'Multilingual AI Assistant' },
  { id: 'transport', icon: Bus, label: 'Transport Intelligence' },
  { id: 'accessibility', icon: Accessibility, label: 'Accessibility Copilot' },
  { id: 'emergency', icon: ShieldAlert, label: 'Emergency Response Copilot' },
  { id: 'volunteer', icon: UserCheck, label: 'Volunteer Coordination' },
  { id: 'sustainability', icon: Leaf, label: 'Sustainability Insights' },
  { id: 'analytics', icon: BarChart3, label: 'Executive Analytics Dashboard' },
  { id: 'profile', icon: UserCircle, label: 'Operator Profile' },
]

export default function Sidebar() {
  const { activeView, setActiveView, isSidebarCollapsed, setIsSidebarCollapsed } = useStore()
  const [hovered, setHovered] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
    }
  }, [isDarkMode])

  return (
    <motion.div 
      initial={{ x: -100 }}
      animate={{ x: 0, width: isSidebarCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-6 top-6 bottom-20 glass border border-white/5 rounded-2xl flex flex-col z-50 bg-[#0f111a]/85"
    >
      {/* Glow behind active item */}
      {!isSidebarCollapsed && (
        <div className="absolute top-1/2 -right-10 w-32 h-32 bg-[#00f5ff]/20 rounded-full blur-[50px] pointer-events-none transition-opacity duration-300" />
      )}

      {/* Header */}
      <div className="p-6 pb-2 flex items-center justify-between">
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.h2 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-hud text-sm font-bold tracking-widest text-[#00f5ff] overflow-hidden whitespace-nowrap"
            >
              ARENAMIND
            </motion.h2>
          )}
        </AnimatePresence>
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          className="text-white/50 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
          aria-label="Toggle Sidebar"
        >
          {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
 
      {/* Nav Items */}
      <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden mt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id
          const Icon = item.icon
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative flex items-center gap-3 px-4 py-2.5 w-full text-left transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-transparent to-[#00f5ff]/10 text-[#00f5ff]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              aria-label={item.label}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute right-0 top-0 bottom-0 w-1 bg-[#00f5ff] shadow-[0_0_15px_#00f5ff]"
                />
              )}
              
              <div className={`p-1.5 rounded transition-colors flex-shrink-0 ${isActive ? 'bg-[#00f5ff]/20 border border-[#00f5ff]' : ''}`}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#00f5ff]' : ''} />
              </div>
              <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-[11px] font-bold uppercase tracking-wider truncate max-w-[160px]"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </div>
 
      {/* Footer */}
      <div className="p-4 border-t border-white/5 mt-auto flex flex-col gap-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex items-center gap-3 px-2 py-3 w-full text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5 overflow-hidden"
          aria-label="Toggle Theme"
        >
          <div className="flex-shrink-0">
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
          </div>
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm whitespace-nowrap overflow-hidden"
              >
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
 
        <button
          onClick={() => signOut(auth)}
          className="flex items-center gap-3 px-2 py-3 w-full text-white/50 hover:text-white transition-colors rounded-lg hover:bg-red-500/10 hover:text-red-400 overflow-hidden"
          aria-label="Log Out"
        >
          <div className="flex-shrink-0">
            <LogOut size={18} />
          </div>
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm whitespace-nowrap overflow-hidden"
              >
                Log Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  )
}
