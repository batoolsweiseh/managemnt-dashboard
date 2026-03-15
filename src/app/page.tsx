import { Suspense } from "react";
import { getDashboardStats, getRecentTasks } from "@/lib/data";
import DashboardStats from "@/components/DashboardStats";
import DashboardCharts from "@/components/DashboardCharts";
import TaskList from "@/components/TaskList";
import { Sparkles, Command, ShieldCheck, Zap, ArrowRight, History, Activity } from "lucide-react";
import Link from "next/link";
import CreateTaskButton from "@/components/CreateTaskButton";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentTasks = await getRecentTasks();

  const chartData = {
    statusData: [
      { name: 'Completed', value: stats.completed },
      { name: 'In Progress', value: stats.inProgress },
      { name: 'Pending', value: stats.pending },
      { name: 'Overdue', value: stats.overdue },
    ],
    priorityData: [
      { name: 'High', value: 4 }, // Mocked for visual impact
      { name: 'Medium', value: 6 },
      { name: 'Low', value: 2 },
    ]
  };

  return (
    <div className="min-h-screen relative pb-32 overflow-hidden">
      {/* Dynamic Vibrant Background */}
      <div className="bg-vibrant-mesh" />
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-violet-600/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto pt-20 px-6 sm:px-12 lg:px-16 space-y-20 relative z-10">
        
        {/* Futuristic Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 animate-in fade-in slide-in-from-top-12 duration-1200">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]"></span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">Neural Link: Online</span>
              <div className="w-px h-4 bg-white/10" />
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400">Stable</span>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-white leading-[0.85] drop-shadow-2xl">
                CORTEX <br /> <span className="gradient-text italic">DASHBOARD</span>
              </h1>
              <p className="text-2xl font-bold text-slate-400 tracking-tight max-w-2xl">
                Synchronizing high-priority objective logic and real-time operational heuristics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end -space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-2">Protocol</span>
              <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 shadow-xl">
                 <span className="text-sm font-black text-white">LEVEL 5 ACCESS</span>
                 <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div className="scale-125 origin-right">
               <CreateTaskButton />
            </div>
          </div>
        </header>

        <main className="space-y-24">
          {/* Key Metrics */}
          <Suspense fallback={<div className="h-80 bg-white/5 rounded-[3rem] animate-pulse" />}>
            <DashboardStats stats={stats} />
          </Suspense>

          {/* Visual Data Spectrum */}
          <section className="space-y-10">
             <div className="flex items-center gap-4 px-2">
                <Command className="w-6 h-6 text-violet-500" />
                <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-500">Neural Analytics Spectrum</h2>
             </div>
             <Suspense fallback={<div className="h-[500px] bg-white/5 rounded-[3rem] animate-pulse" />}>
                <DashboardCharts data={chartData} />
             </Suspense>
          </section>

          {/* Activity Log */}
          <section className="space-y-10">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <History className="w-6 h-6 text-emerald-500" />
                <h2 className="text-sm font-black uppercase tracking-[0.5em] text-slate-500">Live Mission Feed</h2>
              </div>
              <Link 
                href="/tasks" 
                className="group flex items-center gap-3 text-sm font-black text-violet-400 hover:text-white transition-all"
              >
                ACCESS FULL ARCHIVE
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            
            <Suspense fallback={<div className="space-y-6"><div className="h-32 bg-white/5 rounded-3xl animate-pulse" /></div>}>
              <div className="p-1 rounded-[2.5rem] bg-linear-to-b from-white/10 to-transparent">
                 <TaskList tasks={recentTasks} />
              </div>
            </Suspense>
          </section>
        </main>
      </div>
    </div>
  );
}
