import { Suspense } from "react";
import { getDashboardStats, getRecentTasks } from "@/lib/data";
import DashboardStats from "@/components/DashboardStats";
import DashboardCharts from "@/components/DashboardCharts";
import TaskList from "@/components/TaskList";
import { Sparkles, Command, ShieldCheck, Zap, ArrowRight, History } from "lucide-react";
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
      { name: 'High', value: 0 }, // We can calculate these from data if needed, using mock for visual
      { name: 'Medium', value: 0 },
      { name: 'Low', value: 0 },
    ]
  };

  return (
    <div className="min-h-screen relative pb-20">
      {/* Background Element */}
      <div className="bg-mesh-gradient" />
      
      <div className="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 animate-in fade-in slide-in-from-left duration-1000">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">System Link Active</span>
              <div className="w-px h-3 bg-zinc-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Node 01-A</span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-zinc-900 leading-none">
                Executive <span className="text-primary italic">Overview</span>
              </h1>
              <p className="text-xl font-medium text-zinc-500">
                Synchronizing mission logic and operational parameters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end -space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security</span>
              <span className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                Encrypted Session
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </span>
            </div>
            <CreateTaskButton />
          </div>
        </header>

        <main className="space-y-12">
          {/* Key Performance Indicators */}
          <Suspense fallback={<div className="h-64 bg-zinc-50 rounded-3xl animate-pulse" />}>
            <DashboardStats stats={stats} />
          </Suspense>

          {/* Analytics Grid */}
          <section className="space-y-6">
             <div className="flex items-center gap-3 px-1">
                <Command className="w-5 h-5 text-zinc-400" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">Advanced Analytics</h2>
             </div>
             <Suspense fallback={<div className="h-96 bg-zinc-50 rounded-3xl animate-pulse" />}>
                <DashboardCharts data={chartData} />
             </Suspense>
          </section>

          {/* Recent Operations */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-zinc-400" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">Recent Operations</h2>
              </div>
              <Link 
                href="/tasks" 
                className="group flex items-center gap-2 text-sm font-black text-primary hover:text-indigo-700 transition-colors"
              >
                Full Registry
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <Suspense fallback={<div className="space-y-4"><div className="h-24 bg-zinc-50 rounded-2xl animate-pulse" /></div>}>
              <TaskList tasks={recentTasks} />
            </Suspense>
          </section>
        </main>
      </div>
    </div>
  );
}
