import React from "react";
import { Search, Mail, ChevronDown, MessageSquare } from "lucide-react";

export function GlassNav() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Background decoration to show off glass effect */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-[20%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-[50px] right-[10%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/[0.04] backdrop-blur-2xl border-b border-white/[0.08] shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-inner border border-white/10">
                <span className="text-white font-bold text-xl leading-none">X</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold leading-tight tracking-tight">X Toolkit</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 leading-none">
                    44+ Tools
                  </span>
                </div>
              </div>
            </div>

            {/* Center: Nav Pills */}
            <div className="hidden md:flex items-center gap-2">
              <a href="#" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-md transition-colors">
                Home
              </a>
              
              <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                X Tools <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
              
              <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20 hover:bg-orange-500/20 transition-colors">
                Dev Tools <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
              
              <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 hover:bg-pink-500/20 transition-colors">
                SEO Tools <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
              
              <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
                Email Tools <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
              
              <button className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:bg-teal-500/20 transition-colors">
                <Mail className="w-3.5 h-3.5" /> Temp Mail <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              <a href="#" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-md transition-colors">
                About
              </a>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                <Search className="w-5 h-5" />
              </button>

              <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400 pr-1">Operational</span>
              </div>

              <button className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">
                <MessageSquare className="w-4 h-4 opacity-70" /> Feedback
              </button>

              <button className="text-sm font-semibold text-white px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all">
                Add to Chrome
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-purple-500/50 via-indigo-500/50 to-cyan-500/50" />
      </nav>

      {/* Hero content to show transparency */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
          The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Toolkit</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          44+ completely free tools for developers, creators, and SEO professionals. No login required.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-white/5 mb-4" />
              <div className="h-4 w-24 bg-white/10 rounded mb-2" />
              <div className="h-3 w-full bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
