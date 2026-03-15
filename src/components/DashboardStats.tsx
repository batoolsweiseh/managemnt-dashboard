"use client";

import { CheckCircle2, CircleDashed, Clock, Target, TrendingUp, Zap, Sparkle } from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    overdue: number;
    completionRate: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  const statItems = [
    {
      label: "Total Missions",
      value: stats.total,
      icon: Target,
      color: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      glow: "shadow-violet-500/10",
      description: "Active registry operational capacity"
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      glow: "shadow-emerald-500/10",
      description: "Successful mission closures"
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Zap,
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      glow: "shadow-blue-500/10",
      description: "Currently executing operations"
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: Clock,
      color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      glow: "shadow-rose-500/10",
      description: "Exceeded operational deadline"
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-1000">
      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statItems.map((item, index) => (
          <div key={index} className={`premium-card p-8 group relative overflow-hidden bg-slate-900/40 border-white/5`}>
            {/* Dynamic Hover Glow */}
            <div className={`absolute -inset-1 bg-linear-to-r ${item.color.includes('violet') ? 'from-violet-600 to-indigo-600' : item.color.includes('emerald') ? 'from-emerald-600 to-teal-600' : item.color.includes('blue') ? 'from-blue-600 to-cyan-600' : 'from-rose-600 to-pink-600'} rounded-[2.25rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
            
            <div className="relative z-10 space-y-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${item.color} ${item.glow} group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                <item.icon className="w-7 h-7" />
              </div>
              
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{item.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-5xl font-black tracking-tighter text-white group-hover:text-primary transition-colors">{item.value}</h3>
                  <Sparkle className="w-4 h-4 text-slate-600" />
                </div>
              </div>

              <p className="text-[11px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-widest">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hero Progress Section - Ultra Vibrant */}
      <div className="premium-card p-12 bg-linear-to-br from-violet-950 via-slate-950 to-indigo-950 border-white/10 group relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] group-hover:scale-125 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="space-y-8 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-100">Performance Quotient</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] gradient-text">
                Mission Success <br /> <span className="text-white italic">Calibrated.</span>
              </h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-md">
                Operational efficiency is currently peaking at sub-atomic precision levels. Continue deployment for maximum yield.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="relative w-64 h-64 flex items-center justify-center p-4">
              {/* Outer Glow Circle */}
              <div className="absolute inset-0 rounded-full border border-white/5 animate-pulse-slow"></div>
              
              <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <circle
                  cx="112" cy="112" r="100"
                  fill="none"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="16"
                />
                <circle
                  cx="112" cy="112" r="100"
                  fill="none"
                  stroke="url(#vibrantGradient)"
                  strokeWidth="16"
                  strokeDasharray={628.3}
                  strokeDashoffset={628.3 - (628.3 * stats.completionRate) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1500 cubic-bezier(0.34, 1.56, 0.64, 1)"
                />
                <defs>
                  <linearGradient id="vibrantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-6xl font-black tracking-tighter text-white drop-shadow-2xl">{stats.completionRate}%</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Efficiency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
