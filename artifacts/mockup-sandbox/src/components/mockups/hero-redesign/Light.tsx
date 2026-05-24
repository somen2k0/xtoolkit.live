import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Zap, Lock, Infinity, Wrench, ArrowRight, LayoutGrid } from "lucide-react";

export function Light() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
      {/* Background Dot Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      {/* Gradient Blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 container max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        {/* Branding & Badge */}
        <div className="flex flex-col items-center space-y-6 mb-8">
          <div className="flex items-center space-x-2 text-indigo-600 font-semibold tracking-tight text-lg mb-4">
            <Wrench className="w-5 h-5" />
            <span>X Toolkit</span>
          </div>
          
          <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-sm font-medium text-indigo-600 backdrop-blur-sm shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
            44+ free tools · no signup required
          </div>
        </div>

        {/* Headlines */}
        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Free online tools for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">SEO, creators & developers</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop wasting time looking for the right utilities. Get instant access to dozens of fast, privacy-friendly tools built to streamline your workflow.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Button size="lg" className="h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-200 transition-all hover:scale-105">
            Browse All Tools
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-slate-200 text-slate-700 hover:bg-slate-100 transition-all hover:scale-105">
            <LayoutGrid className="mr-2 w-4 h-4" />
            See All Categories
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-sm font-medium text-slate-700">No data stored</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-sm font-medium text-slate-700">No login required</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-sm font-medium text-slate-700">Instant results</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-3">
              <Infinity className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-sm font-medium text-slate-700">Free forever</span>
          </div>
        </div>
      </div>
    </div>
  );
}
