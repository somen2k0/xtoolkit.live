import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Shield, Zap, Search, LayoutGrid, UserX, Infinity } from 'lucide-react';

export function Glass() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans" style={{ backgroundColor: '#0a0f1e' }}>
      {/* Blurred Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/30 blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-cyan-500/30 blur-[100px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[20%] left-[20%] w-[450px] h-[450px] rounded-full bg-emerald-500/20 blur-[120px] mix-blend-screen pointer-events-none" />

      {/* Stars/Sparkles background pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center py-20">
        
        {/* Main Glassmorphism Card */}
        <div className="w-full max-w-5xl p-8 md:p-12 lg:p-16 rounded-[2rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 flex flex-col items-center">
          
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-purple-500/20">
              X
            </div>
            <span className="text-white font-semibold text-2xl tracking-tight">Toolkit</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-200 text-sm font-medium mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            44+ free tools · no signup required
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Free online tools for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">
              SEO, creators & developers
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100/60 max-w-2xl mb-10 leading-relaxed font-light">
            Everything you need to optimize your content, boost your SEO, and build better applications. Instantly accessible, zero configuration required.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 shadow-lg shadow-purple-500/25 transition-all hover:scale-105">
              <Search className="w-5 h-5 mr-2" />
              Browse All Tools
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md border-white/10 text-white transition-all hover:scale-105">
              <LayoutGrid className="w-5 h-5 mr-2" />
              See All Categories
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {[
              { icon: Shield, text: "No data stored" },
              { icon: UserX, text: "No login required" },
              { icon: Zap, text: "Instant results" },
              { icon: Infinity, text: "Free forever" }
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-3 py-5 px-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-colors hover:bg-white/[0.04]">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <badge.icon className="w-5 h-5 text-purple-300" />
                </div>
                <span className="text-sm font-medium text-purple-100/70 text-center">{badge.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
