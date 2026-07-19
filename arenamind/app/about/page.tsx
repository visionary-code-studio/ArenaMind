'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-[#020205] relative flex flex-col justify-between overflow-x-hidden overflow-y-auto">
      {/* Backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <video src="/Video2.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen scale-125 transform origin-center" />
        <div className="absolute inset-0 pitch-grid opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#00f5ff]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#a855f7]/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 w-full p-6 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-12 w-full rounded-[32px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-[#0a0c16]/90 backdrop-blur-2xl overflow-y-auto max-h-[85vh] prose prose-invert prose-p:text-white/70 prose-headings:font-sora prose-h1:text-[#00f5ff] prose-h2:text-[#a855f7] prose-li:text-white/70 prose-blockquote:border-[#00f5ff] prose-blockquote:text-white/80 prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-a:text-[#00f5ff] max-w-none"
        >
        <button onClick={() => router.push('/')} className="sticky top-0 mb-6 text-white/50 hover:text-[#00f5ff] transition-colors font-hud text-[10px] tracking-widest flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 w-max z-50">
          ← BACK TO HOME
        </button>

        <h1>About ArenaMind AI</h1>
        <blockquote>
          <strong>The Generative AI Operating System for FIFA World Cup Stadiums</strong>
        </blockquote>
        <p>
          ArenaMind AI is an AI-powered operational intelligence platform built to transform how mega sporting events are managed. Rather than functioning as a conventional chatbot, ArenaMind AI serves as an intelligent operating system that assists fans, organizers, venue staff, volunteers, and security teams with real-time insights, predictive recommendations, and data-driven decision-making.
        </p>
        <p>
          By combining <strong>Generative AI, Digital Twin technology, predictive analytics, and cloud-native architecture</strong>, ArenaMind AI creates a connected ecosystem that enables safer stadiums, smoother operations, and exceptional fan experiences during the <strong>FIFA World Cup 2026</strong>.
        </p>

        <hr className="border-white/10 my-8" />

        <h2>🏆 Challenge</h2>
        <h3>Smart Stadiums & Tournament Operations</h3>
        <p>
          The FIFA World Cup 2026 will host millions of fans across multiple cities and stadiums, creating complex operational challenges that demand intelligent coordination and rapid decision-making.
        </p>
        <p>
          The objective is to build a <strong>Generative AI-enabled solution</strong> that enhances stadium operations and the overall tournament experience for <strong>fans, organizers, volunteers, and venue staff</strong>.
        </p>
        <p>The platform should leverage AI to improve:</p>
        <ul className="grid grid-cols-2 gap-2 mt-4 list-none pl-0">
          <li className="flex items-center gap-2"><span className="text-xl">🗺️</span> Smart Navigation</li>
          <li className="flex items-center gap-2"><span className="text-xl">👥</span> Crowd Management</li>
          <li className="flex items-center gap-2"><span className="text-xl">♿</span> Accessibility</li>
          <li className="flex items-center gap-2"><span className="text-xl">🚌</span> Transportation</li>
          <li className="flex items-center gap-2"><span className="text-xl">🌱</span> Sustainability</li>
          <li className="flex items-center gap-2"><span className="text-xl">🌍</span> Multilingual Assistance</li>
          <li className="flex items-center gap-2"><span className="text-xl">📊</span> Operational Intelligence</li>
          <li className="flex items-center gap-2"><span className="text-xl">⚡</span> Real-Time Decision Support</li>
        </ul>
        <p className="mt-4">
          ArenaMind AI is designed specifically to address these challenges through an AI-first operational platform.
        </p>

        <hr className="border-white/10 my-8" />

        <h2>💡 Our Solution</h2>
        <h3>ArenaMind AI</h3>
        <p>
          ArenaMind AI brings every operational function of a modern stadium into one intelligent platform.
        </p>
        <p>
          The system continuously analyzes operational data, predicts potential risks, recommends optimal actions, and provides contextual AI assistance for every stakeholder throughout the event lifecycle.
        </p>
        <h4>Core Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose mt-4">
          {[
            { icon: '🧠', text: 'AI Command Center' },
            { icon: '🏟️', text: 'Interactive Stadium Digital Twin' },
            { icon: '👥', text: 'Crowd Prediction & Flow Management' },
            { icon: '🗺️', text: 'Smart Fan Navigation Assistant' },
            { icon: '🌍', text: 'Multilingual AI Support' },
            { icon: '🚌', text: 'Transport Intelligence' },
            { icon: '♿', text: 'Accessibility Copilot' },
            { icon: '🚑', text: 'Emergency Response Copilot' },
            { icon: '🙋', text: 'Volunteer Coordination' },
            { icon: '🌱', text: 'Sustainability Insights' },
            { icon: '📈', text: 'Executive Analytics Dashboard' }
          ].map(f => (
            <div key={f.text} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#00f5ff]/30 transition-colors text-white/80 text-sm">
              <span className="text-xl">{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>

        <hr className="border-white/10 my-8" />

        <h2>🚀 Vision</h2>
        <p>
          Our vision is to build the world&apos;s first <strong>Generative AI Operating System for Mega Sporting Events</strong>.
        </p>
        <p>
          ArenaMind AI empowers human decision-making through intelligent automation, enabling stadiums to become safer, smarter, more connected, and operationally efficient.
        </p>
        <p>The platform is designed to scale beyond the FIFA World Cup and support:</p>
        <ul className="text-sm">
          <li>Olympic Games</li>
          <li>Cricket World Cups</li>
          <li>Formula 1 Events</li>
          <li>Large Concerts & Festivals</li>
          <li>Airports</li>
          <li>Smart Cities</li>
          <li>Convention & Exhibition Centers</li>
        </ul>

        <hr className="border-white/10 my-8" />

        <h2>⚙️ Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h4 className="text-white">Frontend</h4>
            <ul className="text-sm">
              <li>Next.js & React</li>
              <li>Tailwind CSS</li>
              <li>Three.js & React Three Fiber</li>
              <li>Framer Motion</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white">Backend</h4>
            <ul className="text-sm">
              <li>FastAPI</li>
              <li>Firebase & Firestore</li>
              <li>WebSockets</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white">Artificial Intelligence</h4>
            <ul className="text-sm">
              <li>Google Gemini 2.5</li>
              <li>Groq (Fallback)</li>
              <li>Vertex AI</li>
              <li>Vision AI</li>
              <li>Retrieval-Augmented Generation (RAG)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white">Cloud Services</h4>
            <ul className="text-sm">
              <li>Google Maps Platform</li>
              <li>Firebase Storage</li>
              <li>Google Cloud Platform</li>
            </ul>
          </div>
        </div>

        <hr className="border-white/10 my-8" />

        <h2>👨💻 About the Creator</h2>
        <h3>Vaibhav Shaw</h3>
        <p><strong>Product Manager • AI Developer • Solution Architect</strong></p>
        <p>
          Vaibhav Shaw is the creator and product visionary behind ArenaMind AI. He led the end-to-end product strategy, system architecture, AI workflow design, user experience, and technical implementation to develop an intelligent platform capable of solving real-world stadium operational challenges through Generative AI.
        </p>

        <hr className="border-white/10 my-8" />

        <h2>⚡ Powered By</h2>
        <h3>Visionary_Coders</h3>
        <p><strong>Visualize • Innovate • Code the Future</strong></p>
        <p>
          Visionary_Coders is an innovation-driven technology team dedicated to building intelligent AI solutions, modern software products, and immersive digital experiences. By combining creativity, engineering, and artificial intelligence, the team transforms complex challenges into scalable, impactful, and future-ready solutions.
        </p>

        <hr className="border-white/10 my-8" />

        <h2>🎯 Our Mission</h2>
        <p>
          To empower every fan, organizer, volunteer, and venue staff member with AI-driven operational intelligence that enables safer environments, smarter decisions, and unforgettable experiences during the FIFA World Cup 2026 and beyond.
        </p>

        <hr className="border-white/10 my-8" />

        <h2>📊 Project Information</h2>
        <div className="not-prose mt-4 border border-white/10 rounded-xl overflow-hidden text-sm">
          <table className="w-full text-left">
            <tbody className="divide-y divide-white/10">
              <tr className="bg-white/5"><td className="p-4 font-bold text-white/60 w-1/3">Project Name</td><td className="p-4 text-white">ArenaMind AI</td></tr>
              <tr><td className="p-4 font-bold text-white/60">Tagline</td><td className="p-4 text-white italic">The Generative AI Operating System for FIFA World Cup Stadiums</td></tr>
              <tr className="bg-white/5"><td className="p-4 font-bold text-white/60">Challenge</td><td className="p-4 text-white">Smart Stadiums & Tournament Operations</td></tr>
              <tr><td className="p-4 font-bold text-white/60">Theme</td><td className="p-4 text-white">Generative AI for Operational Intelligence</td></tr>
              <tr className="bg-white/5"><td className="p-4 font-bold text-white/60">Built For</td><td className="p-4 text-white">PromptWars Virtual | Hack2Skills</td></tr>
              <tr><td className="p-4 font-bold text-white/60">Product Manager</td><td className="p-4 text-[#00f5ff] font-bold">Vaibhav Shaw</td></tr>
              <tr className="bg-white/5"><td className="p-4 font-bold text-white/60">Powered By</td><td className="p-4 text-[#a855f7] font-bold">Visionary_Coders</td></tr>
            </tbody>
          </table>
        </div>

        <hr className="border-white/10 my-8" />

        <h2>❤️ Closing Statement</h2>
        <blockquote className="border-[#a855f7]">
          <strong>ArenaMind AI is more than an AI assistant—it is an intelligent operational platform that helps people make faster, smarter, and safer decisions. By combining Generative AI, Digital Twin technology, and predictive intelligence, ArenaMind AI redefines how global sporting events are managed, creating seamless experiences for fans while empowering organizers with real-time operational excellence.</strong>
        </blockquote>
      </motion.div>
      </div>
      <Footer />
    </div>
  )
}
