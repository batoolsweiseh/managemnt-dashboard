"use client";

import { CheckCircle2, CircleDashed, Clock, Target, TrendingUp, Zap } from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    overdue: number;
    completionRate: number;
    totalTrend?: string;
  };
  role?: string;
}

export default function DashboardStats({ stats, role = 'User' }: StatsProps) {
  const COLORS = ['var(--primary)', '#10b981', '#f59e0b', '#f43f5e'];
  const statItems = [
    {
      label: role === 'Admin' ? "System Missions" : "My Missions",
      value: stats.total,
      icon: Target,
      color: "bg-primary/10 text-primary",
      trend: (stats as any).totalTrend || "+0%",
      description: "Total registry capacity"
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "bg-emerald-50/50 text-emerald-600",
      trend: "85% Success",
      description: "Closed operations"
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Zap,
      color: "bg-amber-50/50 text-amber-600",
      trend: "Optimal",
      description: "Active execution"
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: CircleDashed,
      color: "bg-indigo-50/50 text-indigo-600",
      trend: "Queued",
      description: "Awaiting execution"
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-6 duration-1000">
      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, index) => (
          <div key={index} className="premium-card p-8 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-zinc-100/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="relative z-10 space-y-4">
              <div className={`icon-box ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6" />
              </div>
              
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{item.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black tracking-tight text-zinc-900">{item.value}</h3>
                  <span className="text-[10px] font-bold text-zinc-400 mb-1">UNIT</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500">{item.description}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.color.replace('50', '100')}`}>
                  {item.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hero Progress Section */}
      <div className="premium-card p-10 bg-linear-to-br from-zinc-900 via-indigo-950 to-zinc-950 text-white relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] delay-1000"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-4 max-w-lg text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
              <TrendingUp className="w-3 h-3 text-primary-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground">Performance Metric</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
              Operational Success <span className="text-primary italic">Manifest</span>
            </h2>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Your overall mission completion velocity is currently exceeding baseline parameters. 
              Efficiency levels are optimal for high-priority executive objectives.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 min-w-[280px]">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="96" cy="96" r="88"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                />
                <circle
                  cx="96" cy="96" r="88"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="12"
                  strokeDasharray={552.9}
                  strokeDashoffset={552.9 - (552.9 * stats.completionRate) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black tracking-tighter">{stats.completionRate}%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Yield</span>
              </div>
            </div>
            <div className="flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
                <span>Mission Success</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                <span>Buffer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
