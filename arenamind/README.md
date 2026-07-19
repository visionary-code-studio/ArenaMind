# ArenaMind AI — Generative AI Operating System for FIFA World Cup 2026

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/Gemini-2.0%20Flash-purple)](https://deepmind.google/technologies/gemini/)
[![Groq](https://img.shields.io/badge/Groq-Llama--3.3-orange)](https://groq.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-cyan)](https://threejs.org/)

> *"The Generative AI Operating System for FIFA World Cup Stadiums."*

## 🏟 Overview

ArenaMind AI is a fully functional, production-grade AI platform designed for FIFA World Cup 2026 stadium operations. It unifies crowd intelligence, emergency response, transport coordination, digital twin visualization, and fan experience into one real-time AI-powered ecosystem.

## ✨ Key Features

| Feature | Details |
|---------|---------|
| **🧠 AI Command Center** | Real-time operations dashboard with Gemini 2.0 Flash |
| **🏟 Digital Twin** | Interactive 3D WebGL stadium (Three.js) with zone hotspots |
| **👥 Crowd Intelligence** | Predictive crowd forecasting with 5/10/15/30/60-min windows |
| **🚑 Emergency Response** | AI incident commander with automated response protocols |
| **📊 Executive Analytics** | KPI dashboards with Recharts visualizations |
| **🎟 Fan Assistant** | Multilingual AI concierge for stadium visitors |
| **⚡ Dual AI Failover** | Gemini 2.0 → Groq (Llama-3.3-70b) automatic fallback |

## 🛠 Tech Stack

### Frontend
- **Next.js 15** with App Router & React 19
- **Tailwind CSS** — Dark glassmorphism design system
- **Three.js** — 3D stadium Digital Twin with WebGL
- **Framer Motion** — Physics-based animations
- **Recharts** — Executive analytics charts
- **Zustand** — Global state management

### AI Gateway
- **Gemini 2.0 Flash** (Primary AI reasoning engine)
- **Groq Llama-3.3-70b** (Automatic failover)
- **Local Directives** (Emergency offline fallback)
- **RAG** — Stadium policies and SOPs embedded in context

### Backend Services
- **Firebase** — Firestore + Auth + Cloud Storage
- **Next.js API Routes** — Serverless AI endpoint
- **FastAPI** (apps/api) — Extended backend

## 🚀 Quick Start

```bash
# Navigate to the Next.js app
cd arenamind

# Install dependencies  
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Application Screens

1. **Landing Page** — Cinematic hero with 3D stadium, AI module grid, tech orbit
2. **AI Command Center** — Mission control dashboard with live KPIs, AI chat, incidents
3. **Digital Twin** — Interactive 3D stadium with clickable zone hotspots and AI analysis
4. **Crowd Intelligence** — Predictive heatmaps with configurable time windows
5. **Emergency Response** — Incident management with AI analysis and response actions
6. **Executive Analytics** — Charts, sustainability metrics, executive AI briefings
7. **Fan Assistant** — Multilingual AI concierge for match-day guidance

## 🔐 Environment Variables

Configure `.env.local` in the `arenamind/` directory:

```env
NEXT_PUBLIC_GEMINI_KEY=<your-gemini-key>
NEXT_PUBLIC_GROQ_KEY=<your-groq-key>
NEXT_PUBLIC_FIREBASE_API_KEY=<firebase-key>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=arenamind-8886e
```

## 🏆 PromptWars Virtual — Judging Alignment

| Criteria | Implementation |
|---------|---------------|
| **Prompt Orchestration** | RAG + system prompts + context injection |
| **Dual Model Failover** | Gemini → Groq → Local directives chain |
| **UI/UX Excellence** | Glassmorphism, 3D WebGL, 60fps animations |
| **Football Concept** | FIFA World Cup theme, stadium environment |
| **Real-time Functionality** | Live KPIs, WebSocket-ready, streaming AI |
| **Security** | Prompt injection shield built-in |

## 📁 Project Structure

```
arenamind/
├── app/
│   ├── page.tsx          # All 7 screens
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Glassmorphism design system
│   └── api/ai/route.ts   # AI gateway endpoint
├── lib/
│   └── ai.ts             # Gemini + Groq gateway with RAG
├── store/
│   └── useStore.ts       # Zustand global state
└── public/               # Static assets
```

---

*Built for FIFA World Cup 2026 Hackathon — ArenaMind AI*
