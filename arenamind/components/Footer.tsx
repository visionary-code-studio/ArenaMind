'use client'
import { useRouter } from 'next/navigation'

export default function Footer() {
  const router = useRouter()
  return (
    <footer className="w-full bg-black/40 backdrop-blur-xl border-t border-white/5 py-12 px-8 mt-24 relative z-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse" />
            <span className="font-hud text-xs font-bold tracking-widest text-[#00f5ff]">ARENAMIND AI</span>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed font-sora">
            The Generative AI Operating System for FIFA World Cup Stadiums. Visualizing operations, streamlining crowd predictions, and powering real-time decisions.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <div className="font-hud text-[9px] text-[#a855f7] tracking-wider uppercase font-bold">Platform</div>
          <ul className="space-y-2 text-xs text-white/60 font-sora">
            <li><button onClick={() => router.push('/about')} className="hover:text-[#00f5ff] transition-colors">About Solution</button></li>
            <li><button onClick={() => router.push('/testimonials')} className="hover:text-[#00f5ff] transition-colors">Testimonials</button></li>
            <li><button onClick={() => router.push('/contact')} className="hover:text-[#00f5ff] transition-colors">Contact Creator</button></li>
          </ul>
        </div>

        {/* Creator Info */}
        <div className="space-y-3">
          <div className="font-hud text-[9px] text-[#F5A623] tracking-wider uppercase font-bold">Author Details</div>
          <p className="text-[11px] text-white/50 leading-relaxed font-sora">
            Designed by <strong>Vaibhav Shaw</strong>.<br />
            Powered by <strong>Visionary_Coders</strong>.
          </p>
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          <div className="font-hud text-[9px] text-white/40 tracking-wider uppercase font-bold">Connect</div>
          <div className="flex flex-wrap gap-2 text-lg">
            <a href="https://www.linkedin.com/in/vaibhav-shaw-55124835b/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:border-[#00f5ff]/40 hover:bg-white/10 hover:text-[#00f5ff] transition-all" title="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/designer.hub2025/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:border-[#a855f7]/40 hover:bg-white/10 hover:text-[#a855f7] transition-all" title="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm-2-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://x.com/vaibhavshawsnu" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:border-white/40 hover:bg-white/10 hover:text-white transition-all" title="Twitter / X">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://vaibhavportfolio26.netlify.app/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:border-[#00f5ff]/40 hover:bg-white/10 hover:text-[#00f5ff] transition-all" title="Portfolio">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 22.876c-3.149-1.283-5.59-4.103-6.426-7.876h6.426v7.876zm0-9.876h-7.616c-.237-.962-.384-1.961-.384-3s.147-2.038.384-3h7.616v6zm0-8h-6.426c.836-3.773 3.277-6.593 6.426-7.876v7.876zm8 9.876h-6v-6h7.616c.237.962.384 1.961.384 3s-.147 2.038-.384 3zm-6 2v7.876c3.149-1.283 5.59-4.103 6.426-7.876h-6.426zm0-10v-7.876c3.149 1.283 5.59 4.103 6.426 7.876h-6.426z"/>
              </svg>
            </a>
            <a href="https://github.com/visionary-code-studio" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:border-white/40 hover:bg-white/10 hover:text-white transition-all" title="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-[10px] text-white/30 font-hud">
        <div>© 2026 ARENAMIND AI. ALL RIGHTS RESERVED.</div>
        <div className="mt-2 md:mt-0 uppercase">BUILT FOR PROMPTWARS VIRTUAL | HACK2SKILLS</div>
      </div>
    </footer>
  )
}
