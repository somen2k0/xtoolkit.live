import {
  Search, AtSign, Code2, TrendingUp, Mail, Inbox, Sparkles,
  FileJson, Globe, ShieldCheck, Hash, Lock,
  Home, Info, MessageSquare, ChevronDown,
  ArrowRight, Zap, Shield, Clock, Users,
  KeyRound, QrCode, Regex, Shuffle, Gauge,
  ScanSearch, EyeOff, Pencil, Tag,
} from "lucide-react";

const DROP_X = [
  { icon: Search,    label: "Account Checker",       badge: "Popular" },
  { icon: Sparkles,  label: "AI Bio Generator",      badge: "AI" },
  { icon: ScanSearch,label: "AI Text Detector",      badge: "AI" },
  { icon: Hash,      label: "Hashtag Formatter",     badge: "" },
  { icon: AtSign,    label: "Username Generator",    badge: "" },
];
const DROP_DEV = [
  { icon: FileJson,  label: "JSON Formatter",        badge: "Popular" },
  { icon: Lock,      label: "Base64 Encoder",        badge: "" },
  { icon: KeyRound,  label: "JWT Decoder",           badge: "New" },
  { icon: QrCode,    label: "QR Code Generator",    badge: "New" },
  { icon: Shuffle,   label: "UUID Generator",        badge: "" },
];
const DROP_SEO = [
  { icon: Globe,     label: "Meta Tag Generator",    badge: "Popular" },
  { icon: Tag,       label: "Sitemap Validator",     badge: "" },
  { icon: Gauge,     label: "Page Speed Checker",   badge: "" },
];

const BADGE_S: Record<string, { bg: string; color: string; border: string }> = {
  Popular: { bg:"rgba(251,191,36,0.12)",  color:"#fbbf24", border:"rgba(251,191,36,0.3)" },
  AI:      { bg:"rgba(192,132,252,0.12)", color:"#c084fc", border:"rgba(192,132,252,0.3)" },
  New:     { bg:"rgba(74,222,128,0.12)",  color:"#4ade80", border:"rgba(74,222,128,0.3)" },
};
const CAT_COLORS: Record<string, string> = {
  "X Tools":"#60a5fa","Dev Tools":"#fb923c","SEO Tools":"#f472b6","Email Tools":"#22d3ee","Temp Mail":"#2dd4bf",
};

export function Navbar() {
  const activeDropdown = "X Tools";

  return (
    <div style={{ minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif",background:"hsl(222,20%,13%)",color:"hsl(215,18%,88%)",position:"relative",overflowX:"hidden" }}>

      <style>{`
        @keyframes orb-float-1 {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(60px,-80px) scale(1.08); }
          66%      { transform:translate(-40px,50px) scale(0.95); }
        }
        @keyframes orb-float-2 {
          0%,100% { transform:translate(0,0) scale(1); }
          40%      { transform:translate(-70px,60px) scale(1.05); }
          70%      { transform:translate(50px,-40px) scale(0.92); }
        }
        @keyframes orb-float-3 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(80px,80px) scale(1.1); }
        }
        @keyframes grid-drift {
          0%   { background-position:0 0; }
          100% { background-position:40px 40px; }
        }
        @keyframes aurora-shift {
          0%,100% { opacity:0.13; transform:scaleX(1) scaleY(1); }
          50%      { opacity:0.2;  transform:scaleX(1.15) scaleY(1.2); }
        }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slide-down {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .shimmer-text {
          background:linear-gradient(90deg,hsl(270,80%,72%),hsl(240,90%,80%),hsl(195,90%,70%),hsl(240,85%,75%),hsl(270,80%,72%));
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }
        .drop-in { animation:slide-down 0.15s ease-out both; }
        .nav-item-hover:hover { color:hsl(215,18%,88%) !important; background:rgba(255,255,255,0.06) !important; }
        .tool-row:hover { background:hsl(222,16%,20%) !important; }
      `}</style>

      {/* Animated background */}
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,backgroundImage:"linear-gradient(rgba(220,230,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(220,230,255,0.035) 1px,transparent 1px)",backgroundSize:"40px 40px",animation:"grid-drift 20s linear infinite" }} />
      <div style={{ position:"fixed",top:"-20%",left:"50%",transform:"translateX(-50%)",width:"80vw",height:"60vh",pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse at 30% center,hsl(258,82%,66%,0.14),transparent 60%),radial-gradient(ellipse at 70% center,hsl(195,90%,60%,0.10),transparent 60%)",animation:"aurora-shift 8s ease-in-out infinite" }} />
      <div style={{ position:"fixed",width:600,height:600,borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none",zIndex:0,background:"radial-gradient(circle,hsl(270,80%,65%,0.28) 0%,transparent 70%)",top:"-15%",left:"-12%",mixBlendMode:"screen",animation:"orb-float-1 18s ease-in-out infinite" }} />
      <div style={{ position:"fixed",width:500,height:500,borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none",zIndex:0,background:"radial-gradient(circle,hsl(195,90%,60%,0.22) 0%,transparent 70%)",top:"15%",right:"-10%",mixBlendMode:"screen",animation:"orb-float-2 22s ease-in-out infinite" }} />
      <div style={{ position:"fixed",width:350,height:350,borderRadius:"50%",filter:"blur(80px)",pointerEvents:"none",zIndex:0,background:"radial-gradient(circle,hsl(240,90%,70%,0.18) 0%,transparent 70%)",bottom:"20%",right:"15%",mixBlendMode:"screen",animation:"orb-float-1 20s ease-in-out infinite reverse" }} />

      <div style={{ position:"relative",zIndex:1 }}>

        {/* ── NAVBAR ──────────────────────────────── */}
        <nav style={{
          position:"sticky",top:0,zIndex:50,
          borderBottom:"1px solid hsl(222,16%,23%,0.5)",
          background:"hsl(222,20%,13%,0.85)",
          backdropFilter:"blur(16px)",
        }}>
          <div style={{ position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(to right,transparent,hsl(258,82%,66%,0.5),transparent)",pointerEvents:"none" }} />

          <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 24px",height:48,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12 }}>

            {/* Logo */}
            <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
              <div style={{ width:28,height:28,borderRadius:8,overflow:"hidden",boxShadow:"0 0 12px rgba(124,58,237,0.35)" }}>
                <svg width="28" height="28" viewBox="0 0 180 180" fill="none">
                  <defs>
                    <linearGradient id="nb2" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse"><stop stopColor="#09071a"/><stop offset="1" stopColor="#110d24"/></linearGradient>
                    <linearGradient id="nf2" x1="35" y1="30" x2="145" y2="150" gradientUnits="userSpaceOnUse"><stop stopColor="#c4b5fd"/><stop offset=".45" stopColor="#7c3aed"/><stop offset="1" stopColor="#4c1d95"/></linearGradient>
                  </defs>
                  <rect width="180" height="180" rx="36" fill="url(#nb2)"/>
                  <g stroke="url(#nf2)" strokeLinecap="round" fill="none"><line x1="58" y1="44" x2="122" y2="136" strokeWidth="21"/><line x1="122" y1="44" x2="58" y2="136" strokeWidth="21"/></g>
                  <g stroke="url(#nf2)" strokeLinecap="square" fill="none"><polyline points="46,38 31,38 31,142 46,142" strokeWidth="10"/><polyline points="134,38 149,38 149,142 134,142" strokeWidth="10"/></g>
                </svg>
              </div>
              <span style={{ fontWeight:600,fontSize:14,letterSpacing:"-0.015em",color:"hsl(215,18%,88%)" }}>X Toolkit</span>
              <span style={{ fontSize:10,fontWeight:600,padding:"1px 7px",borderRadius:20,border:"1px solid hsl(258,80%,68%,0.35)",color:"hsl(258,80%,74%)",background:"hsl(258,80%,68%,0.09)" }}>44+ Tools</span>
            </div>

            {/* Pill nav */}
            <div style={{ display:"flex",alignItems:"center",gap:1,padding:"3px 4px",borderRadius:20,background:"hsl(222,16%,18%,0.7)",border:"1px solid hsl(222,16%,24%,0.7)",boxShadow:"inset 0 1px 0 0 rgba(255,255,255,0.03)" }}>
              {[
                { label:"Home",       active:true,  drop:false },
                { label:"X Tools",    active:true,  drop:true  },
                { label:"Dev Tools",  active:false, drop:true  },
                { label:"SEO Tools",  active:false, drop:true  },
                { label:"Email Tools",active:false, drop:true  },
                { label:"Temp Mail",  active:false, drop:true  },
                { label:"About",      active:false, drop:false },
              ].map(({ label, active, drop }) => {
                const isHighlighted = label === "X Tools";
                return (
                  <button key={label} className="nav-item-hover" style={{
                    display:"flex",alignItems:"center",gap:3,padding:"4px 10px",
                    borderRadius:14,fontSize:11,fontWeight:active?600:500,border:"none",cursor:"pointer",
                    background: label === "Home" ? "hsl(222,20%,17%)" : isHighlighted ? "rgba(96,165,250,0.1)" : "transparent",
                    color: label === "Home" ? "hsl(215,18%,88%)" : isHighlighted ? CAT_COLORS["X Tools"] : "hsl(215,12%,56%)",
                    boxShadow: label === "Home" ? "0 1px 3px hsl(222,20%,8%,0.3)" : "none",
                    whiteSpace:"nowrap",transition:"all 0.15s",
                  }}>
                    {label}
                    {drop && <ChevronDown size={9} style={{ opacity:0.55, transform: isHighlighted ? "rotate(180deg)" : "none", transition:"0.15s" }} />}
                  </button>
                );
              })}
            </div>

            {/* Right side */}
            <div style={{ display:"flex",alignItems:"center",gap:6,flexShrink:0 }}>
              <button style={{ width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid hsl(222,16%,24%)",background:"hsl(222,16%,19%,0.5)",color:"hsl(215,12%,56%)",cursor:"pointer" }}>
                <Search size={13} />
              </button>
              <div style={{ display:"flex",alignItems:"center",gap:4,padding:"0 8px" }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 5px #4ade80" }} />
                <span style={{ fontSize:10,color:"hsl(215,12%,50%)" }}>Live</span>
              </div>
              <button style={{ display:"flex",alignItems:"center",gap:5,padding:"6px 13px",borderRadius:8,fontSize:12,fontWeight:700,color:"#fff",border:"none",cursor:"pointer",background:"linear-gradient(135deg,hsl(258,80%,60%),hsl(270,80%,55%))",boxShadow:"0 0 14px hsl(258,80%,60%,0.4)" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5A2.5 2.5 0 0 0 10.5 1 2.5 2.5 0 0 0 8 3.5V5H4a2 2 0 0 0-2 2v3.8h1.5a2.5 2.5 0 0 1 0 5H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.5 2.5 0 0 1 5 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z"/></svg>
                Extension
              </button>
              <button style={{ display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:8,fontSize:12,cursor:"pointer",border:"1px solid hsl(222,16%,24%)",background:"hsl(222,16%,19%,0.5)",color:"hsl(215,12%,58%)" }}>
                <MessageSquare size={13} />Feedback
              </button>
            </div>
          </div>
        </nav>

        {/* ── OPEN DROPDOWN: X Tools ───────────────── */}
        <div style={{ maxWidth:1100,margin:"12px auto 0",padding:"0 24px",display:"flex",gap:16,alignItems:"flex-start" }}>

          {/* X Tools dropdown */}
          <div className="drop-in" style={{
            width:248,borderRadius:14,border:"1px solid hsl(222,16%,24%,0.7)",
            background:"hsl(222,20%,14%,0.98)",backdropFilter:"blur(20px)",
            boxShadow:"0 20px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.04)",
            padding:8,
          }}>
            <div style={{ padding:"4px 8px 6px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:CAT_COLORS["X Tools"] }}>All X Tools</span>
              <span style={{ fontSize:10,color:"hsl(215,12%,50%)",cursor:"pointer" }}>View all →</span>
            </div>
            <div style={{ height:1,background:"hsl(222,16%,23%,0.5)",margin:"0 4px 6px" }} />
            {DROP_X.map(({ icon: Icon, label, badge }) => (
              <div key={label} className="tool-row" style={{
                display:"flex",alignItems:"center",gap:9,padding:"7px 10px",borderRadius:9,cursor:"pointer",
                background: label==="Account Checker" ? "hsl(222,16%,20%)" : "transparent",
                transition:"background 0.1s",
              }}>
                <Icon size={13} style={{ color:"hsl(215,12%,55%)",flexShrink:0 }} />
                <span style={{ fontSize:12,fontWeight:500,color:"hsl(215,18%,82%)",flex:1 }}>{label}</span>
                {badge && (
                  <span style={{ fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:20,border:`1px solid ${BADGE_S[badge].border}`,background:BADGE_S[badge].bg,color:BADGE_S[badge].color }}>{badge}</span>
                )}
              </div>
            ))}
          </div>

          {/* Dev Tools */}
          <div className="drop-in" style={{
            width:248,borderRadius:14,border:"1px solid hsl(222,16%,24%,0.7)",
            background:"hsl(222,20%,14%,0.98)",backdropFilter:"blur(20px)",
            boxShadow:"0 20px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.04)",
            padding:8,
          }}>
            <div style={{ padding:"4px 8px 6px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:CAT_COLORS["Dev Tools"] }}>Dev Tools</span>
              <span style={{ fontSize:10,color:"hsl(215,12%,50%)",cursor:"pointer" }}>View all →</span>
            </div>
            <div style={{ height:1,background:"hsl(222,16%,23%,0.5)",margin:"0 4px 6px" }} />
            {DROP_DEV.map(({ icon: Icon, label, badge }) => (
              <div key={label} className="tool-row" style={{ display:"flex",alignItems:"center",gap:9,padding:"7px 10px",borderRadius:9,cursor:"pointer",transition:"background 0.1s" }}>
                <Icon size={13} style={{ color:"hsl(215,12%,55%)",flexShrink:0 }} />
                <span style={{ fontSize:12,fontWeight:500,color:"hsl(215,18%,82%)",flex:1 }}>{label}</span>
                {badge && (
                  <span style={{ fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:20,border:`1px solid ${BADGE_S[badge].border}`,background:BADGE_S[badge].bg,color:BADGE_S[badge].color }}>{badge}</span>
                )}
              </div>
            ))}
          </div>

          {/* SEO Tools */}
          <div className="drop-in" style={{
            width:220,borderRadius:14,border:"1px solid hsl(222,16%,24%,0.7)",
            background:"hsl(222,20%,14%,0.98)",backdropFilter:"blur(20px)",
            boxShadow:"0 20px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.04)",
            padding:8,
          }}>
            <div style={{ padding:"4px 8px 6px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:CAT_COLORS["SEO Tools"] }}>SEO Tools</span>
              <span style={{ fontSize:10,color:"hsl(215,12%,50%)",cursor:"pointer" }}>View all →</span>
            </div>
            <div style={{ height:1,background:"hsl(222,16%,23%,0.5)",margin:"0 4px 6px" }} />
            {DROP_SEO.map(({ icon: Icon, label, badge }) => (
              <div key={label} className="tool-row" style={{ display:"flex",alignItems:"center",gap:9,padding:"7px 10px",borderRadius:9,cursor:"pointer",transition:"background 0.1s" }}>
                <Icon size={13} style={{ color:"hsl(215,12%,55%)",flexShrink:0 }} />
                <span style={{ fontSize:12,fontWeight:500,color:"hsl(215,18%,82%)",flex:1 }}>{label}</span>
                {badge && (
                  <span style={{ fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:20,border:`1px solid ${BADGE_S[badge].border}`,background:BADGE_S[badge].bg,color:BADGE_S[badge].color }}>{badge}</span>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* ── HERO beneath dropdown ─────────────────── */}
        <section style={{ padding:"52px 24px 48px",textAlign:"center",maxWidth:860,margin:"0 auto" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:24,border:"1px solid hsl(258,80%,68%,0.3)",background:"hsl(258,80%,68%,0.08)",marginBottom:24,fontSize:12,fontWeight:600,color:"hsl(258,80%,78%)" }}>
            <Zap size={12} />44+ free tools · no signup required
          </div>
          <h1 style={{ fontSize:56,fontWeight:800,letterSpacing:"-0.04em",lineHeight:1.08,color:"hsl(215,18%,92%)",marginBottom:8 }}>
            Free online tools for
          </h1>
          <h1 className="shimmer-text" style={{ fontSize:56,fontWeight:800,letterSpacing:"-0.04em",lineHeight:1.08,marginBottom:20 }}>
            SEO, creators &amp; devs
          </h1>
          <p style={{ fontSize:16,color:"hsl(215,12%,58%)",lineHeight:1.7,maxWidth:500,margin:"0 auto 32px" }}>
            X account checker, AI bios, JSON formatter — instant, no login, no ads, free forever.
          </p>
          <div style={{ display:"flex",gap:12,justifyContent:"center" }}>
            <button style={{ display:"flex",alignItems:"center",gap:8,padding:"12px 26px",borderRadius:12,fontSize:14,fontWeight:700,color:"#fff",border:"none",cursor:"pointer",background:"linear-gradient(135deg,hsl(258,80%,60%),hsl(270,80%,55%))",boxShadow:"0 0 28px hsl(258,80%,60%,0.45)" }}>
              Browse All Tools <ArrowRight size={15} />
            </button>
            <button style={{ padding:"12px 26px",borderRadius:12,fontSize:14,fontWeight:600,cursor:"pointer",border:"1px solid hsl(222,16%,26%)",background:"hsl(222,18%,17%,0.8)",color:"hsl(215,18%,80%)" }}>
              See Categories
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
