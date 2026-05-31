import React from 'react';

export default function HomePage() {
  return (
    <main className="flex-1 bg-slate-900 text-white overflow-hidden relative font-sans flex flex-col justify-between min-h-screen">
      {/* Background glowing effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Nav bar */}
      <header className="border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-sky-500/20">
            Ω
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              OmniERM
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Enterprise Suite</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-white transition-colors">Dashboard</a>
          <a href="#" className="hover:text-white transition-colors">Resources</a>
          <a href="#" className="hover:text-white transition-colors">Finance</a>
          <a href="#" className="hover:text-white transition-colors">HR Core</a>
          <a href="#" className="hover:text-white transition-colors">Analytics</a>
        </nav>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Backend Active
          </span>
          <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs px-4 py-2 rounded-lg font-medium transition-all">
            Settings
          </button>
        </div>
      </header>

      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        {/* Left column info */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-sky-500/10 to-indigo-500/10 text-sky-400 border border-sky-500/20 w-fit">
            🚀 Decoupled Full-Stack Architecture
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Scale Resource Planning Seamlessly.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Enterprise resource orchestration powered by a modular, reactive Spring Boot 3.x backend, distributed persistence, and a highly responsive Next.js App Router front-end client interface.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <a href="http://localhost:8080/api/v1/swagger-ui.html" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-sky-500/15 transition-all text-center">
              Explore API docs
            </a>
            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold px-6 py-3 rounded-xl transition-all">
              Launch Console
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 mt-2">
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">17</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Java Target</p>
            </div>
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">3.x</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Spring Boot</p>
            </div>
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">14.x</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Next.js App</p>
            </div>
          </div>
        </div>

        {/* Right column dashboard card graphic */}
        <div className="lg:col-span-7 relative">
          {/* Decorative backdrop shapes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-gradient-to-tr from-sky-500/5 to-indigo-500/5 rounded-3xl blur-2xl -z-10" />
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Window control circles */}
            <div className="flex items-center gap-1.5 mb-6">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-xs text-slate-500 font-mono ml-3">com.enterprise.erm // System Monitor</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Analytics Metric Cards */}
              <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-4 flex flex-col justify-between min-h-[90px]">
                <span className="text-xs text-slate-400 font-medium">Memory Allocation</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-xl font-bold text-sky-400">4.2 GB</span>
                  <span className="text-[10px] text-slate-500">of 8GB</span>
                </div>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-4 flex flex-col justify-between min-h-[90px]">
                <span className="text-xs text-slate-400 font-medium">Database Pools</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-xl font-bold text-violet-400">14 / 20</span>
                  <span className="text-[10px] text-emerald-400 font-mono">OK</span>
                </div>
              </div>
              <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-4 flex flex-col justify-between min-h-[90px]">
                <span className="text-xs text-slate-400 font-medium">Core API Latency</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-xl font-bold text-pink-400">12 ms</span>
                  <span className="text-[10px] text-slate-500">avg</span>
                </div>
              </div>
            </div>

            {/* Performance wave visualization mockup */}
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-slate-300">Cluster Request Load</span>
                <span className="text-[10px] text-slate-500 font-mono">Live Syncing</span>
              </div>
              
              <div className="h-28 flex items-end gap-[3px] pt-4 px-2 border-b border-slate-800">
                {/* Visual equalizer wave */}
                <div className="flex-1 bg-sky-500/20 hover:bg-sky-500/40 rounded-t h-[40%] transition-all" />
                <div className="flex-1 bg-sky-500/20 hover:bg-sky-500/40 rounded-t h-[55%] transition-all" />
                <div className="flex-1 bg-sky-500/30 hover:bg-sky-500/60 rounded-t h-[35%] transition-all" />
                <div className="flex-1 bg-sky-500/40 hover:bg-sky-500/70 rounded-t h-[60%] transition-all" />
                <div className="flex-1 bg-indigo-500/40 hover:bg-indigo-500/70 rounded-t h-[75%] transition-all" />
                <div className="flex-1 bg-indigo-500/50 hover:bg-indigo-500/80 rounded-t h-[90%] transition-all" />
                <div className="flex-1 bg-violet-500/50 hover:bg-violet-500/80 rounded-t h-[65%] transition-all" />
                <div className="flex-1 bg-violet-500/40 hover:bg-violet-500/70 rounded-t h-[50%] transition-all" />
                <div className="flex-1 bg-pink-500/40 hover:bg-pink-500/70 rounded-t h-[80%] transition-all" />
                <div className="flex-1 bg-pink-500/60 hover:bg-pink-500/90 rounded-t h-[95%] transition-all" />
                <div className="flex-1 bg-indigo-500/30 hover:bg-indigo-500/60 rounded-t h-[45%] transition-all" />
                <div className="flex-1 bg-sky-500/30 hover:bg-sky-500/60 rounded-t h-[50%] transition-all" />
                <div className="flex-1 bg-sky-500/40 hover:bg-sky-500/70 rounded-t h-[70%] transition-all" />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 font-mono">
                <span>12:00</span>
                <span>12:15</span>
                <span>12:30</span>
                <span>12:45</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer footer info */}
      <footer className="border-t border-slate-800/80 px-6 py-6 text-slate-500 text-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© 2026 Enterprise Resource Management Platform. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Agreement</a>
          <a href="#" className="hover:text-slate-400 transition-colors">SLA Standards</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Security Audit</a>
        </div>
      </footer>
    </main>
  );
}
