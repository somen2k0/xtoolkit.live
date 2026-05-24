import React from "react";
import { ArrowRight, CheckCircle2, LayoutGrid, Shield, Zap, Search } from "lucide-react";

export function Gradient() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#4f46e5] text-white">
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      ></div>

      {/* Floating Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/30 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/30 blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/20 blur-[100px] pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        {/* Tool Count Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-xl">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-sm font-medium text-cyan-50 tracking-wide">44+ free tools &middot; no signup required</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
          Free online tools for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
            SEO, creators &amp; developers
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-indigo-100/80 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          Everything you need in one place. X Toolkit provides a massive collection of high-quality tools to accelerate your workflow, boost your SEO, and grow your audience—completely free.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-950 rounded-xl font-bold text-lg hover:bg-cyan-50 hover:scale-[1.02] transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2">
            <Search className="w-5 h-5" />
            Browse All Tools
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <LayoutGrid className="w-5 h-5" />
            See All Categories
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-12">
          <div className="flex items-center gap-2 text-sm font-medium text-white/80 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
            <Shield className="w-4 h-4 text-cyan-300" />
            No data stored
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-white/80 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-cyan-300" />
            No login required
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-white/80 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
            <Zap className="w-4 h-4 text-cyan-300" />
            Instant results
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-white/80 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-cyan-300" />
            Free forever
          </div>
        </div>
      </div>
    </div>
  );
}
