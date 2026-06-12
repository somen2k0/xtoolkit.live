import React from "react";
import { Search, ChevronDown } from "lucide-react";

export function Floating() {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0f1e] overflow-hidden font-sans text-slate-200">
      {/* Background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Pill Nav Wrapper */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-auto z-50">
        {/* The Pill */}
        <nav className="flex items-center gap-6 px-4 py-2.5 rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          
          {/* Logo Area */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20">
              <span className="text-white font-bold text-sm tracking-tight leading-none">XT</span>
            </div>
            <span className="font-semibold text-white tracking-tight hidden sm:block">X Toolkit</span>
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-5 bg-white/[0.1] hidden md:block" />

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-1.5">
            <li>
              <a href="#" className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-1">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-1">
                X Tools <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </a>
            </li>
            <li>
              <a href="#" className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-1">
                Dev Tools <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </a>
            </li>
            <li>
              <a href="#" className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-1">
                SEO <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </a>
            </li>
            <li>
              <a href="#" className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-1">
                Email <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </a>
            </li>
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-2 pl-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 rounded-full shadow-lg shadow-cyan-500/25 transition-all">
              Extension
            </button>
          </div>
        </nav>
      </div>

      {/* Mock Content */}
      <main className="pt-40 px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-cyan-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Introducing X Toolkit 2.0
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
          The ultimate toolkit for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
            modern creators.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          44+ free tools to supercharge your X/Twitter presence, optimize your SEO, and streamline your development workflow.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <button className="px-8 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors">
            Get Started Free
          </button>
          <button className="px-8 py-3 rounded-full bg-white/5 text-white font-semibold border border-white/10 hover:bg-white/10 transition-colors">
            Explore Tools
          </button>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white/10 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Feature {i}</h3>
              <p className="text-sm text-slate-400">Streamline your workflow with our advanced tools designed specifically for creators and developers.</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
