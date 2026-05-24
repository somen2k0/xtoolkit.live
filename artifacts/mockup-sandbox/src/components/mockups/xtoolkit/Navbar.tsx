import {
  Search, AtSign, Code2, TrendingUp, Mail, Inbox,
  Sparkles, FileJson, Globe, Hash, Lock, Minimize2,
  ChevronDown, Home, Info, MessageSquare,
  ArrowRight, Zap, Shield, Clock, Users,
  BarChart3, QrCode, KeyRound, Terminal,
} from "lucide-react";

const TOOLS_X = [
  { icon: Search,   label: "Account Checker",     badge: "Popular", color: "#60a5fa" },
  { icon: Sparkles, label: "AI Bio Generator",    badge: "AI",      color: "#c084fc" },
  { icon: Hash,     label: "Hashtag Formatter",   badge: "",        color: "#60a5fa" },
  { icon: AtSign,   label: "Username Generator",  badge: "",        color: "#60a5fa" },
];

const TOOLS_DEV = [
  { icon: FileJson, label: "JSON Formatter",      badge: "Popular", color: "#fb923c" },
  { icon: Lock,     label: "Base64 Encoder",      badge: "",        color: "#fb923c" },
  { icon: KeyRound, label: "JWT Decoder",         badge: "New",     color: "#fb923c" },
  { icon: QrCode,   label: "QR Code Generator",  badge: "New",     color: "#fb923c" },
];

const BADGE_S: Record<string, {bg:string;color:string;border:string}> = {
  Popular: { bg: "rgba(251,191,36,0.1)",  color:"#fbbf24", border:"rgba(251,191,36,0.25)" },
  AI:      { bg: "rgba(192,132,252,0.1)", color:"#c084fc", border:"rgba(192,132,252,0.25)" },
  New:     { bg: "rgba(74,222,128,0.1)",  color:"#4ade80", border:"rgba(74,222,128,0.25)" },
};

const NAV_ITEMS = [
  { label: "Home",       hasDropdown: false, active: true },
  { label: "X Tools",    hasDropdown: true,  active: false },
  { label: "Dev Tools",  hasDropdown: true,  active: false },
  { label: "SEO Tools",  hasDropdown: true,  active: false },
  { label: "Email Tools",hasDropdown: true,  active: false },
  { label: "Temp Mail",  hasDropdown: true,  active: false },
  { label: "About",      hasDropdown: false, active: false },
];

export function Navbar() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d1117",
      color: "#e2e8f0",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Glow */}
      <div style={{ position:"fixed",top:-180,left:"50%",transform:"translateX(-50%)",width:700,height:400,background:"radial-gradient(ellipse,rgba(124,58,237,0.1) 0%,transparent 70%)",pointerEvents:"none" }} />

      {/* ── NAVBAR ─────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(13,17,23,0.9)",
        backdropFilter: "blur(24px)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>

          {/* Logo */}
          <div style={{ display:"flex",alignItems:"center",gap:10,flexShrink:0 }}>
            <div style={{ width:30,height:30,borderRadius:8,overflow:"hidden",boxShadow:"0 0 16px rgba(124,58,237,0.5)" }}>
              <svg width="30" height="30" viewBox="0 0 180 180" fill="none">
                <defs>
                  <linearGradient id="b2" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse"><stop stopColor="#09071a"/><stop offset="1" stopColor="#110d24"/></linearGradient>
                  <linearGradient id="f2" x1="35" y1="30" x2="145" y2="150" gradientUnits="userSpaceOnUse"><stop stopColor="#c4b5fd"/><stop offset=".45" stopColor="#7c3aed"/><stop offset="1" stopColor="#4c1d95"/></linearGradient>
                </defs>
                <rect width="180" height="180" rx="36" fill="url(#b2)"/>
                <g stroke="url(#f2)" strokeLinecap="round" fill="none"><line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/></g>
                <g stroke="url(#f2)" strokeLinecap="square" fill="none"><polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/></g>
              </svg>
            </div>
            <span style={{ fontWeight:700,fontSize:15,letterSpacing:"-0.02em",color:"#f1f5f9" }}>X Toolkit</span>
            <div style={{ width:1,height:16,background:"rgba(255,255,255,0.1)",margin:"0 2px" }} />
            <span style={{ fontSize:11,color:"#4ade80",fontWeight:600,display:"flex",alignItems:"center",gap:4 }}>
              <span style={{ width:5,height:5,borderRadius:"50%",background:"#4ade80",display:"inline-block",boxShadow:"0 0 5px #4ade80" }} />
              Live
            </span>
          </div>

          {/* Nav items */}
          <div style={{ display:"flex",alignItems:"center",gap:1 }}>
            {NAV_ITEMS.map(({ label, hasDropdown, active }) => (
              <button key={label} style={{
                display:"flex",alignItems:"center",gap:3,
                padding:"5px 11px",borderRadius:8,fontSize:12,fontWeight:active?600:500,
                background: active ? "rgba(255,255,255,0.07)" : "transparent",
                color: active ? "#e2e8f0" : "#64748b",
                border:"none",cursor:"pointer",
              }}>
                {label}
                {hasDropdown && <ChevronDown size={11} style={{ opacity:0.5 }} />}
              </button>
            ))}
          </div>

          {/* Right */}
          <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
            <button style={{
              width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",
              border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.04)",
              color:"#64748b",cursor:"pointer",
            }}><Search size={14} /></button>

            <button style={{
              display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,
              fontSize:12,fontWeight:600,border:"1px solid rgba(255,255,255,0.08)",
              background:"rgba(255,255,255,0.04)",color:"#94a3b8",cursor:"pointer",
            }}>
              <MessageSquare size={13} /> Feedback
            </button>

            <button style={{
              display:"flex",alignItems:"center",gap:6,padding:"7px 16px",borderRadius:8,
              fontSize:12,fontWeight:700,
              background:"linear-gradient(135deg,#7c3aed,#6d28d9)",
              color:"#fff",border:"none",cursor:"pointer",
              boxShadow:"0 0 20px rgba(124,58,237,0.45),inset 0 1px 0 rgba(255,255,255,0.12)",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5A2.5 2.5 0 0 0 10.5 1 2.5 2.5 0 0 0 8 3.5V5H4a2 2 0 0 0-2 2v3.8h1.5a2.5 2.5 0 0 1 0 5H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.5 2.5 0 0 1 5 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z"/></svg>
              Get Extension
            </button>
          </div>
        </div>
      </nav>

      {/* ── OPEN DROPDOWN DEMO ─────────────── */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"20px 24px 0", position:"relative" }}>
        <div style={{ display:"flex", gap:16 }}>

          {/* X Tools dropdown */}
          <div style={{
            width:260, borderRadius:14,
            border:"1px solid rgba(255,255,255,0.09)",
            background:"rgba(15,20,30,0.98)",
            backdropFilter:"blur(24px)",
            boxShadow:"0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
            padding:10,
          }}>
            <div style={{ padding:"4px 8px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"#60a5fa" }}>X Tools</span>
              <span style={{ fontSize:10,color:"#475569",cursor:"pointer" }}>All →</span>
            </div>
            <div style={{ height:1,background:"rgba(255,255,255,0.06)",margin:"0 4px 8px" }} />
            {TOOLS_X.map(({ icon: Icon, label, badge, color }) => (
              <div key={label} style={{
                display:"flex",alignItems:"center",gap:10,padding:"8px 10px",
                borderRadius:9,cursor:"pointer",
                background: label === "Account Checker" ? "rgba(255,255,255,0.05)" : "transparent",
              }}>
                <Icon size={14} style={{ color, flexShrink:0 }} />
                <span style={{ fontSize:12,fontWeight:500,color:"#cbd5e1",flex:1 }}>{label}</span>
                {badge && (
                  <span style={{
                    fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:100,
                    border:`1px solid ${BADGE_S[badge].border}`,
                    background:BADGE_S[badge].bg,color:BADGE_S[badge].color,
                  }}>{badge}</span>
                )}
              </div>
            ))}
          </div>

          {/* Dev Tools dropdown */}
          <div style={{
            width:260,borderRadius:14,
            border:"1px solid rgba(255,255,255,0.09)",
            background:"rgba(15,20,30,0.98)",
            backdropFilter:"blur(24px)",
            boxShadow:"0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
            padding:10,
          }}>
            <div style={{ padding:"4px 8px 8px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"#fb923c" }}>Dev Tools</span>
              <span style={{ fontSize:10,color:"#475569",cursor:"pointer" }}>All →</span>
            </div>
            <div style={{ height:1,background:"rgba(255,255,255,0.06)",margin:"0 4px 8px" }} />
            {TOOLS_DEV.map(({ icon: Icon, label, badge, color }) => (
              <div key={label} style={{
                display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:9,cursor:"pointer",
              }}>
                <Icon size={14} style={{ color,flexShrink:0 }} />
                <span style={{ fontSize:12,fontWeight:500,color:"#cbd5e1",flex:1 }}>{label}</span>
                {badge && (
                  <span style={{
                    fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:100,
                    border:`1px solid ${BADGE_S[badge].border}`,
                    background:BADGE_S[badge].bg,color:BADGE_S[badge].color,
                  }}>{badge}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO BENEATH ────────────────────── */}
      <section style={{ padding:"56px 24px 40px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{
          borderRadius:20, overflow:"hidden", position:"relative",
          border:"1px solid rgba(255,255,255,0.07)",
          background:"linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(13,17,23,1) 50%)",
          padding:"56px 64px",
        }}>
          {/* Glow orb */}
          <div style={{ position:"absolute",top:-60,right:-60,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)",pointerEvents:"none" }} />
          <div style={{ position:"absolute",bottom:-40,left:-40,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(56,189,248,0.1) 0%,transparent 70%)",pointerEvents:"none" }} />

          <div style={{ position:"relative" }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:100,border:"1px solid rgba(124,58,237,0.3)",background:"rgba(124,58,237,0.08)",marginBottom:24 }}>
              <Zap size={11} style={{ color:"#a78bfa" }} />
              <span style={{ fontSize:11,color:"#a78bfa",fontWeight:600 }}>44+ free tools · zero signup</span>
            </div>

            <h1 style={{ fontSize:52,fontWeight:800,letterSpacing:"-0.04em",lineHeight:1.08,marginBottom:16,color:"transparent",background:"linear-gradient(180deg,#f8fafc 0%,#94a3b8 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
              Free online tools<br/>
              <span style={{ background:"linear-gradient(135deg,#a78bfa,#818cf8,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>for SEO, creators & devs</span>
            </h1>
            <p style={{ fontSize:16,color:"#475569",lineHeight:1.7,marginBottom:32,maxWidth:480 }}>
              X account checker, AI bios, JSON formatter — instant, no login, no ads, free forever.
            </p>
            <div style={{ display:"flex",gap:12 }}>
              <button style={{
                display:"flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:10,
                fontSize:14,fontWeight:700,
                background:"linear-gradient(135deg,#7c3aed,#6d28d9)",color:"#fff",border:"none",cursor:"pointer",
                boxShadow:"0 0 28px rgba(124,58,237,0.5)",
              }}>Browse All Tools <ArrowRight size={15} /></button>
              <button style={{ padding:"12px 24px",borderRadius:10,fontSize:14,fontWeight:600,border:"1px solid rgba(255,255,255,0.09)",background:"rgba(255,255,255,0.04)",color:"#94a3b8",cursor:"pointer" }}>
                See Categories
              </button>
            </div>
          </div>
        </div>

        {/* Trust row */}
        <div style={{ display:"flex",gap:32,marginTop:28,justifyContent:"center" }}>
          {[
            { icon:Shield,  label:"No data stored" },
            { icon:Users,   label:"No login required" },
            { icon:Zap,     label:"Instant results" },
            { icon:Clock,   label:"Free forever" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{ display:"flex",alignItems:"center",gap:7 }}>
              <Icon size={13} style={{ color:"#334155" }} />
              <span style={{ fontSize:12,color:"#334155",fontWeight:500 }}>{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
