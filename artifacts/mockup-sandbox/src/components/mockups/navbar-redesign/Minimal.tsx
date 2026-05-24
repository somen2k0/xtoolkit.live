import React, { useState } from 'react';
import { 
  Twitter, 
  Code2, 
  LineChart, 
  Mail, 
  Clock, 
  Search,
  Puzzle,
  ChevronRight,
  Menu
} from 'lucide-react';

const categories = [
  { id: 'x-tools', label: 'X Tools', icon: Twitter, color: 'text-blue-400', glow: 'hover:shadow-[0_0_15px_rgba(96,165,250,0.5)]', bgHover: 'hover:bg-blue-500/10' },
  { id: 'dev-tools', label: 'Dev Tools', icon: Code2, color: 'text-orange-400', glow: 'hover:shadow-[0_0_15px_rgba(251,146,60,0.5)]', bgHover: 'hover:bg-orange-500/10' },
  { id: 'seo-tools', label: 'SEO Tools', icon: LineChart, color: 'text-pink-400', glow: 'hover:shadow-[0_0_15px_rgba(244,114,182,0.5)]', bgHover: 'hover:bg-pink-500/10' },
  { id: 'email-tools', label: 'Email Tools', icon: Mail, color: 'text-cyan-400', glow: 'hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]', bgHover: 'hover:bg-cyan-500/10' },
  { id: 'temp-mail', label: 'Temp Mail', icon: Clock, color: 'text-teal-400', glow: 'hover:shadow-[0_0_15px_rgba(45,212,191,0.5)]', bgHover: 'hover:bg-teal-500/10' },
];

export function Minimal() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Background decorations for hero context */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-900/20 via-[#0a0f1e]/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 h-12 w-full flex items-center px-4 justify-between bg-gradient-to-b from-[#0a0f1e]/95 to-transparent backdrop-blur-md">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-900 flex items-center justify-center shadow-lg shadow-indigo-900/20 group-hover:shadow-indigo-500/30 transition-all duration-300">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-tight text-white/90 group-hover:text-white transition-colors hidden sm:block">X Toolkit</span>
        </div>

        {/* Center: Command Bar Icons */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl shadow-inner">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="relative group flex items-center justify-center"
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button 
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${cat.color} ${cat.bgHover} ${cat.glow} hover:scale-105 active:scale-95`}
                aria-label={cat.label}
              >
                <cat.icon className="w-4 h-4 stroke-[1.5px]" />
              </button>
              
              {/* Tooltip */}
              <div 
                className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-slate-800 text-[10px] font-medium text-slate-300 border border-white/10 shadow-xl whitespace-nowrap pointer-events-none transition-all duration-200 z-50 ${
                  hoveredCategory === cat.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                }`}
              >
                {cat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative group hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search tools..." 
              className="w-48 h-8 pl-8 pr-3 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/10 transition-all shadow-inner"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <kbd className="px-1.5 py-0.5 rounded text-[9px] font-sans font-medium bg-white/10 text-slate-400 border border-white/5">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded text-[9px] font-sans font-medium bg-white/10 text-slate-400 border border-white/5">K</kbd>
            </div>
          </div>

          {/* Extension Pill */}
          <button className="h-8 pl-2.5 pr-3 rounded-full bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 hover:border-indigo-500/40 hover:from-indigo-600/30 hover:to-violet-600/30 flex items-center gap-1.5 transition-all duration-300 group">
            <Puzzle className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300" />
            <span className="text-xs font-medium text-indigo-200 group-hover:text-white">Extension</span>
          </button>

          {/* Mobile Menu */}
          <button className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-slate-400 transition-colors">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Dummy Hero Content */}
      <main className="max-w-5xl mx-auto px-4 pt-32 pb-20 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          v2.0 Command Bar Interface
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Tools that move at <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">the speed of thought.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mb-10 leading-relaxed">
          The new X Toolkit interface replaces cluttered menus with a streamlined command bar. 
          Everything you need, instantly accessible without losing context.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-white text-indigo-950 font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg shadow-white/10">
            Explore Tools
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="px-6 py-3 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors font-medium">
            Read the Docs
          </button>
        </div>
      </main>
    </div>
  );
}
