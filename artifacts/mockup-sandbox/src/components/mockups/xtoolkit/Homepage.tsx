import {
  Search, AtSign, Code2, TrendingUp, Mail, Inbox, Sparkles,
  FileJson, Globe, ShieldCheck, Hash, Lock, Minimize2,
  Home, Info, MessageSquare, ChevronDown,
  ArrowRight, Zap, Shield, Clock, Users, QrCode,
  Regex, KeyRound, Shuffle, AlignLeft, Gauge,
} from "lucide-react";

const TOOLS = [
  { icon: Search,    label: "X Account Checker",    badge: "Popular", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  { icon: Sparkles,  label: "AI Bio Generator",     badge: "AI",      color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
  { icon: FileJson,  label: "JSON Formatter",       badge: "Popular", color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  { icon: Globe,     label: "Meta Tag Generator",   badge: "Popular", color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  { icon: Mail,      label: "Temp Email",           badge: "",        color: "#22d3ee", bg: "rgba(34,211,238,0.12)" },
  { icon: ShieldCheck,label:"Email Validator",      badge: "New",     color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
  { icon: Hash,      label: "Hashtag Formatter",    badge: "",        color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  { icon: Lock,      label: "Base64 Encoder",       badge: "",        color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  { icon: KeyRound,  label: "JWT Decoder",          badge: "New",     color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  { icon: QrCode,    label: "QR Code Generator",   badge: "New",     color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  { icon: Gauge,     label: "Page Speed Checker",  badge: "",        color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  { icon: AlignLeft, label: "Word Counter",         badge: "New",     color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
];

const BADGE_S: Record<string, { bg: string; color: string; border: string }> = {
  Popular: { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24", border: "rgba(251,191,36,0.3)" },
  AI:      { bg: "rgba(192,132,252,0.12)", color: "#c084fc", border: "rgba(192,132,252,0.3)" },
  New:     { bg: "rgba(74,222,128,0.12)",  color: "#4ade80", border: "rgba(74,222,128,0.3)" },
};

const CATS = [
  { icon: AtSign,    label: "X Tools",     color: "#60a5fa" },
  { icon: Code2,     label: "Dev Tools",   color: "#fb923c" },
  { icon: TrendingUp,label: "SEO Tools",   color: "#f472b6" },
  { icon: Mail,      label: "Email Tools", color: "#22d3ee" },
  { icon: Inbox,     label: "Temp Mail",   color: "#2dd4bf" },
];

const NAV = [
  { label: "Home",        drop: false, active: true  },
  { label: "X Tools",     drop: true,  active: false },
  { label: "Dev Tools",   drop: true,  active: false },
  { label: "SEO Tools",   drop: true,  active: false },
  { label: "Email Tools", drop: true,  active: false },
  { label: "Temp Mail",   drop: true,  active: false },
  { label: "About",       drop: false, active: false },
];

export function Homepage() {
  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: "hsl(222,20%,13%)", color: "hsl(215,18%,88%)", position: "relative", overflowX: "hidden" }}>

      {/* ── CSS ANIMATIONS ─────────────────────────────── */}
      <style>{`
        @keyframes orb-float-1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(60px,-80px) scale(1.08); }
          66%      { transform: translate(-40px,50px) scale(0.95); }
        }
        @keyframes orb-float-2 {
          0%,100% { transform: translate(0,0) scale(1); }
          40%      { transform: translate(-70px,60px) scale(1.05); }
          70%      { transform: translate(50px,-40px) scale(0.92); }
        }
        @keyframes orb-float-3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(80px,80px) scale(1.1); }
        }
        @keyframes grid-drift {
          0%   { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes aurora-shift {
          0%,100% { opacity: 0.13; transform: scaleX(1) scaleY(1); }
          50%      { opacity: 0.2;  transform: scaleX(1.15) scaleY(1.2); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; }
          50%      { opacity:0.4; }
        }
        .hero-badge    { animation: fade-up 0.6s ease-out 0.1s both; }
        .hero-title    { animation: fade-up 0.7s ease-out 0.25s both; }
        .hero-sub      { animation: fade-up 0.7s ease-out 0.4s both; }
        .hero-actions  { animation: fade-up 0.7s ease-out 0.55s both; }
        .hero-trust    { animation: fade-up 0.6s ease-out 0.7s both; }
        .tool-card:hover { border-color: rgba(139,92,246,0.35) !important; box-shadow: 0 0 20px rgba(139,92,246,0.08), 0 4px 16px rgba(0,0,0,0.3) !important; transform: translateY(-1px); }
        .cat-btn:hover { opacity:0.85; }
        .shimmer-text {
          background: linear-gradient(90deg,hsl(270,80%,72%),hsl(240,90%,80%),hsl(195,90%,70%),hsl(240,85%,75%),hsl(270,80%,72%));
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      {/* ── ANIMATED GRID ─────────────────────────────── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(hsl(220,20%,90%,0.035) 1px,transparent 1px),linear-gradient(90deg,hsl(220,20%,90%,0.035) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
        animation: "grid-drift 20s linear infinite",
      }} />

      {/* ── AURORA ────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: "-20%", left: "50%", transform: "translateX(-50%)",
        width: "80vw", height: "60vh", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 30% center,hsl(258,82%,66%,0.14),transparent 60%),radial-gradient(ellipse at 70% center,hsl(195,90%,60%,0.10),transparent 60%)",
        animation: "aurora-shift 8s ease-in-out infinite",
      }} />

      {/* ── FLOATING ORBS ─────────────────────────────── */}
      <div style={{ position:"fixed",width:600,height:600,borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none",zIndex:0,background:"radial-gradient(circle,hsl(270,80%,65%,0.28) 0%,transparent 70%)",top:"-15%",left:"-12%",mixBlendMode:"screen",animation:"orb-float-1 18s ease-in-out infinite" }} />
      <div style={{ position:"fixed",width:500,height:500,borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none",zIndex:0,background:"radial-gradient(circle,hsl(195,90%,60%,0.22) 0%,transparent 70%)",top:"15%",right:"-10%",mixBlendMode:"screen",animation:"orb-float-2 22s ease-in-out infinite" }} />
      <div style={{ position:"fixed",width:400,height:400,borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none",zIndex:0,background:"radial-gradient(circle,hsl(160,80%,55%,0.15) 0%,transparent 70%)",bottom:"5%",left:"25%",mixBlendMode:"screen",animation:"orb-float-3 16s ease-in-out infinite" }} />
      <div style={{ position:"fixed",width:350,height:350,borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none",zIndex:0,background:"radial-gradient(circle,hsl(240,90%,70%,0.18) 0%,transparent 70%)",bottom:"20%",right:"15%",mixBlendMode:"screen",animation:"orb-float-1 20s ease-in-out infinite reverse" }} />

      {/* ── CONTENT WRAPPER ───────────────────────────── */}
      <div style={{ position:"relative", zIndex:1 }}>

        {/* ── NAVBAR ─────────────────────────────────── */}
        <nav style={{
          position:"sticky",top:0,zIndex:50,
          borderBottom:"1px solid hsl(222,16%,23%,0.5)",
          background:"hsl(222,20%,13%,0.85)",
          backdropFilter:"blur(16px)",
          boxShadow:"0 1px 0 0 rgba(0,0,0,0.04)",
        }}>
          {/* Gradient accent line */}
          <div style={{ position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(to right,transparent,hsl(258,82%,66%,0.5),transparent)",pointerEvents:"none" }} />

          <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 24px",height:48,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12 }}>

            {/* Logo */}
            <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
              <div style={{ width:28,height:28,borderRadius:8,overflow:"hidden",boxShadow:"0 0 12px rgba(124,58,237,0.35)" }}>
                <svg width="28" height="28" viewBox="0 0 180 180" fill="none">
                  <defs>
                    <linearGradient id="nb" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse"><stop stopColor="#09071a"/><stop offset="1" stopColor="#110d24"/></linearGradient>
                    <linearGradient id="nf" x1="35" y1="30" x2="145" y2="150" gradientUnits="userSpaceOnUse"><stop stopColor="#c4b5fd"/><stop offset=".45" stopColor="#7c3aed"/><stop offset="1" stopColor="#4c1d95"/></linearGradient>
                  </defs>
                  <rect width="180" height="180" rx="36" fill="url(#nb)"/>
                  <g stroke="url(#nf)" strokeLinecap="round" fill="none"><line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/></g>
                  <g stroke="url(#nf)" strokeLinecap="square" fill="none"><polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/></g>
                </svg>
              </div>
              <span style={{ fontWeight:600,fontSize:14,letterSpacing:"-0.015em",color:"hsl(215,18%,88%)" }}>X Toolkit</span>
              <span style={{ fontSize:10,fontWeight:600,padding:"1px 7px",borderRadius:20,border:"1px solid hsl(258,80%,68%,0.35)",color:"hsl(258,80%,74%)",background:"hsl(258,80%,68%,0.09)" }}>44+ Tools</span>
            </div>

            {/* Pill nav */}
            <div style={{
              display:"flex",alignItems:"center",gap:1,padding:"3px 4px",
              borderRadius:20,background:"hsl(222,16%,18%,0.7)",
              border:"1px solid hsl(222,16%,24%,0.7)",
              boxShadow:"inset 0 1px 0 0 rgba(255,255,255,0.03)",
            }}>
              {NAV.map(({ label, drop, active }) => (
                <button key={label} style={{
                  display:"flex",alignItems:"center",gap:3,padding:"4px 10px",
                  borderRadius:14,fontSize:11,fontWeight:active?600:500,border:"none",cursor:"pointer",
                  background: active ? "hsl(222,20%,17%)" : "transparent",
                  color: active ? "hsl(215,18%,88%)" : "hsl(215,12%,56%)",
                  boxShadow: active ? "0 1px 3px hsl(222,20%,8%,0.3)" : "none",
                  whiteSpace:"nowrap",
                }}>
                  {label}
                  {drop && <ChevronDown size={9} style={{ opacity:0.55 }} />}
                </button>
              ))}
            </div>

            {/* Right */}
            <div style={{ display:"flex",alignItems:"center",gap:6,flexShrink:0 }}>
              <button style={{ width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid hsl(222,16%,24%)",background:"hsl(222,16%,19%,0.5)",color:"hsl(215,12%,56%)",cursor:"pointer" }}>
                <Search size={13} />
              </button>
              <button style={{
                display:"flex",alignItems:"center",gap:5,padding:"6px 13px",borderRadius:8,
                fontSize:12,fontWeight:700,color:"#fff",border:"none",cursor:"pointer",
                background:"linear-gradient(135deg,hsl(258,80%,60%),hsl(270,80%,55%))",
                boxShadow:"0 0 14px hsl(258,80%,60%,0.4)",
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5A2.5 2.5 0 0 0 10.5 1 2.5 2.5 0 0 0 8 3.5V5H4a2 2 0 0 0-2 2v3.8h1.5a2.5 2.5 0 0 1 0 5H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.5 2.5 0 0 1 5 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z"/></svg>
                Extension
              </button>
              <button style={{ display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",border:"1px solid hsl(222,16%,24%)",background:"hsl(222,16%,19%,0.5)",color:"hsl(215,12%,58%)" }}>
                <MessageSquare size={13} />Feedback
              </button>
            </div>
          </div>
        </nav>

        {/* ── HERO ──────────────────────────────────────── */}
        <section style={{ padding:"80px 24px 60px",textAlign:"center",maxWidth:860,margin:"0 auto" }}>
          <div className="hero-badge" style={{
            display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:24,
            border:"1px solid hsl(258,80%,68%,0.3)",background:"hsl(258,80%,68%,0.08)",
            marginBottom:28,fontSize:12,fontWeight:600,color:"hsl(258,80%,78%)",cursor:"pointer",
          }}>
            <Zap size={12} />
            44+ free tools · no signup required
          </div>

          <h1 className="hero-title" style={{ fontSize:64,fontWeight:800,letterSpacing:"-0.04em",lineHeight:1.07,marginBottom:8,color:"hsl(215,18%,92%)" }}>
            Free online tools for
          </h1>
          <h1 className="hero-title shimmer-text" style={{ fontSize:64,fontWeight:800,letterSpacing:"-0.04em",lineHeight:1.07,marginBottom:24 }}>
            SEO, creators &amp; devs
          </h1>

          <p className="hero-sub" style={{ fontSize:17,lineHeight:1.7,color:"hsl(215,12%,58%)",marginBottom:36,maxWidth:540,margin:"0 auto 36px" }}>
            X account checker, AI bio generators, JSON formatter, Base64 encoder, text formatters — all free, all instant, all in one place.
          </p>

          <div className="hero-actions" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:40 }}>
            <button style={{
              display:"flex",alignItems:"center",gap:8,padding:"13px 28px",borderRadius:12,
              fontSize:15,fontWeight:700,color:"#fff",border:"none",cursor:"pointer",
              background:"linear-gradient(135deg,hsl(258,80%,60%),hsl(270,80%,55%))",
              boxShadow:"0 0 28px hsl(258,80%,60%,0.45),0 4px 16px hsl(258,80%,60%,0.25)",
            }}>
              Browse All Tools <ArrowRight size={16} />
            </button>
            <button style={{
              padding:"13px 28px",borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",
              border:"1px solid hsl(222,16%,26%)",background:"hsl(222,18%,17%,0.8)",
              color:"hsl(215,18%,80%)",
            }}>
              See All Categories
            </button>
          </div>

          <div className="hero-trust" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            {[{icon:Shield,label:"No data stored"},{icon:Users,label:"No login required"},{icon:Zap,label:"Instant results"},{icon:Clock,label:"Free forever"}].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,background:"hsl(222,18%,17%)",border:"1px solid hsl(222,16%,23%)",fontSize:11,fontWeight:500,color:"hsl(215,12%,58%)" }}>
                <Icon size={11} style={{ opacity:0.7 }} />{label}
              </div>
            ))}
          </div>
        </section>

        {/* ── CATEGORIES ────────────────────────────────── */}
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 24px 32px",display:"flex",gap:8,overflowX:"auto" }}>
          {CATS.map(({ icon: Icon, label, color }) => (
            <button key={label} className="cat-btn" style={{
              display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:12,flexShrink:0,
              border:"1px solid hsl(222,16%,23%)",background:"hsl(222,18%,17%)",cursor:"pointer",
              fontSize:12,fontWeight:600,color:"hsl(215,18%,80%)",
            }}>
              <Icon size={13} style={{ color }} />
              {label}
            </button>
          ))}
        </div>

        {/* ── TOOLS GRID ────────────────────────────────── */}
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 24px 60px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18 }}>
            <h2 style={{ fontSize:17,fontWeight:700,color:"hsl(215,18%,88%)",margin:0 }}>Popular Tools</h2>
            <span style={{ fontSize:12,color:"hsl(215,12%,56%)",cursor:"pointer" }}>View all →</span>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10 }}>
            {TOOLS.map(({ icon: Icon, label, badge, color, bg }) => (
              <div key={label} className="tool-card" style={{
                padding:"16px",borderRadius:14,cursor:"pointer",
                border:"1px solid hsl(222,16%,23%)",background:"hsl(222,18%,17%,0.9)",
                transition:"all 0.2s",position:"relative",overflow:"hidden",
              }}>
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12 }}>
                  <div style={{ width:36,height:36,borderRadius:9,background:bg,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  {badge && (
                    <span style={{ fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:20,border:`1px solid ${BADGE_S[badge].border}`,background:BADGE_S[badge].bg,color:BADGE_S[badge].color,flexShrink:0 }}>{badge}</span>
                  )}
                </div>
                <div style={{ fontSize:12,fontWeight:600,color:"hsl(215,18%,84%)",lineHeight:1.4 }}>{label}</div>
                <div style={{ display:"flex",alignItems:"center",gap:3,marginTop:8 }}>
                  <span style={{ fontSize:11,color:"hsl(215,12%,50%)" }}>Open tool</span>
                  <ArrowRight size={10} style={{ color:"hsl(215,12%,50%)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER BAR ────────────────────────────────── */}
        <div style={{ borderTop:"1px solid hsl(222,16%,22%)",padding:"20px 24px" }}>
          <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div style={{ display:"flex",gap:24 }}>
              {[{icon:Shield,label:"No data stored"},{icon:Users,label:"No login required"},{icon:Zap,label:"Instant results"},{icon:Clock,label:"Free forever"}].map(({ icon: Icon, label }) => (
                <div key={label} style={{ display:"flex",alignItems:"center",gap:6 }}>
                  <Icon size={13} style={{ color:"hsl(215,12%,46%)" }} />
                  <span style={{ fontSize:11,color:"hsl(215,12%,46%)",fontWeight:500 }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:5 }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 6px #4ade80",animation:"pulse-dot 2s ease-in-out infinite" }} />
              <span style={{ fontSize:11,color:"hsl(215,12%,48%)" }}>All systems operational</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
