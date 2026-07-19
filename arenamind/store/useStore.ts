import { create } from 'zustand';
import { User } from 'firebase/auth';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  model?: string;
  latency?: number;
  timestamp: string;
}

export interface Incident {
  id: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  location: string;
  time: string;
  status: 'Active' | 'In Progress' | 'Resolved';
  aiSummary: string;
  confidence: number;
}

export interface SystemLog {
  time: string;
  text: string;
  level: 'cyan' | 'green' | 'yellow' | 'red' | 'purple';
}

type ActiveView = 'landing' | 'command' | 'twin' | 'crowd' | 'emergency' | 'analytics' | 'fan' | 'profile' | 'multilingual' | 'transport' | 'accessibility' | 'volunteer' | 'sustainability';

interface StoreState {
  user: User | null;
  isAuthenticated: boolean;
  hasSeenSplash: boolean;
  isSidebarCollapsed: boolean;
  setUser: (user: User | null) => void;
  setHasSeenSplash: (val: boolean) => void;
  setIsSidebarCollapsed: (val: boolean) => void;
  activeView: ActiveView;
  aiStatus: 'online' | 'switching' | 'offline';
  activeModel: string;
  latency: number;
  chatHistory: ChatMessage[];
  isThinking: boolean;
  incidents: Incident[];
  systemLogs: SystemLog[];
  attendance: number;
  crowdIndex: number;
  energyUsage: number;
  activeIncidents: number;
  volunteers: number;
  selectedZone: string | null;
  emergencyActive: boolean;

  setActiveView: (view: ActiveView) => void;
  setAIStatus: (status: 'online' | 'switching' | 'offline') => void;
  setActiveModel: (model: string) => void;
  setLatency: (ms: number) => void;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setThinking: (v: boolean) => void;
  addIncident: (incident: Incident) => void;
  resolveIncident: (id: string) => void;
  addLog: (log: Omit<SystemLog, 'time'>) => void;
  setSelectedZone: (zone: string | null) => void;
  triggerEmergency: () => void;
  clearEmergency: () => void;
}

const INITIAL_LOGS: SystemLog[] = [
  { time: '05:38:12', text: 'ArenaMind AI OS v2.0 — System boot complete.', level: 'cyan' },
  { time: '05:38:13', text: 'Firebase platform connected — arenamind-8886e.', level: 'green' },
  { time: '05:38:14', text: 'Gemini 2.0 Flash gateway initialized.', level: 'purple' },
  { time: '05:38:15', text: 'Groq Llama-3.3-70b failover ready.', level: 'yellow' },
  { time: '05:38:16', text: 'Digital Twin engine loaded — MetLife Stadium.', level: 'cyan' },
  { time: '05:38:17', text: 'WebSocket telemetry stream active.', level: 'green' },
  { time: '05:38:18', text: 'Crowd Intelligence sensors synced — 67,842 active.', level: 'cyan' },
  { time: '05:38:19', text: 'All systems nominal. Awaiting operator commands.', level: 'green' },
];

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'ER-001',
    type: 'Crowd Congestion',
    severity: 'High',
    location: 'Gate A — North Concourse',
    time: '19:42',
    status: 'Active',
    aiSummary: 'Crowd density at 94% — congestion imminent. 3 buses arriving simultaneously.',
    confidence: 96,
  },
  {
    id: 'ER-002',
    type: 'Weather Alert',
    severity: 'Medium',
    location: 'Stadium Perimeter',
    time: '19:38',
    status: 'In Progress',
    aiSummary: 'Rain forecast in 40 minutes. Covered zone capacity optimization recommended.',
    confidence: 88,
  },
];

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, hasSeenSplash: user ? false : get().hasSeenSplash }),
  activeView: 'landing',
  aiStatus: 'online',
  activeModel: 'gemini-2.5-flash',
  hasSeenSplash: false,
  isSidebarCollapsed: false,
  latency: 0,
  chatHistory: [
    {
      id: '0',
      sender: 'ai',
      text: "Good evening, Operations Team. 🏟\n\n**DIAGNOSTIC STATUS**: All stadium systems operational.\n\n**ANALYSIS**:\n- Attendance: 67,842 / 82,500 (82%)\n- 2 active monitoring alerts\n- Weather: Clear, 24°C — no immediate risk\n\n**RECOMMENDATIONS**:\n1. Pre-stage halftime volunteer surge teams — Expected Impact: -20% wait times\n2. Monitor Gate A density — approaching threshold — Expected Impact: Proactive\n3. Confirm transport schedule adherence — Expected Impact: Fan satisfaction\n\n**AI CONFIDENCE**: 97%\n**DATA SOURCES**: All Systems | Real-time Telemetry",
      model: 'gemini-2.5-flash',
      latency: 420,
      timestamp: new Date().toISOString(),
    },
  ],
  isThinking: false,
  incidents: INITIAL_INCIDENTS,
  systemLogs: INITIAL_LOGS,
  attendance: 67842,
  crowdIndex: 82,
  energyUsage: 74,
  activeIncidents: 2,
  volunteers: 1284,
  selectedZone: null,
  emergencyActive: false,

  setActiveView: (view) => set({ activeView: view }),
  setHasSeenSplash: (val) => set({ hasSeenSplash: val }),
  setIsSidebarCollapsed: (val) => set({ isSidebarCollapsed: val }),
  setAIStatus: (status) => set({ aiStatus: status }),
  setActiveModel: (model) => set({ activeModel: model }),
  setLatency: (ms) => set({ latency: ms }),
  addMessage: (msg) =>
    set((s) => ({
      chatHistory: [
        ...s.chatHistory,
        { ...msg, id: Math.random().toString(36).slice(2), timestamp: new Date().toISOString() },
      ],
    })),
  setThinking: (v) => set({ isThinking: v }),
  addIncident: (incident) =>
    set((s) => ({
      incidents: [incident, ...s.incidents],
      activeIncidents: s.activeIncidents + 1,
    })),
  resolveIncident: (id) =>
    set((s) => ({
      incidents: s.incidents.map((i) => (i.id === id ? { ...i, status: 'Resolved' as const } : i)),
      activeIncidents: Math.max(0, s.activeIncidents - 1),
    })),
  addLog: (log) =>
    set((s) => ({
      systemLogs: [
        { ...log, time: new Date().toISOString().substring(11, 19) },
        ...s.systemLogs.slice(0, 49),
      ],
    })),
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  triggerEmergency: () => {
    set((s) => ({
      emergencyActive: true,
      activeIncidents: s.activeIncidents + 1,
    }));
    get().addIncident({
      id: `ER-${Date.now().toString().slice(-3)}`,
      type: 'Medical Emergency',
      severity: 'Critical',
      location: 'Section B12',
      time: new Date().toISOString().substring(11, 16),
      status: 'Active',
      aiSummary: 'Medical emergency detected. Nearest team ETA 2 minutes. Crowd evacuation not required.',
      confidence: 97,
    });
    get().addLog({ text: '🚨 CRITICAL: Medical Emergency — Section B12. AI response initiated.', level: 'red' });
  },
  clearEmergency: () => set({ emergencyActive: false }),
}));
