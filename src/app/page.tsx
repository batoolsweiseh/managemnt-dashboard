import { Suspense } from "react";
import { getDashboardStats, getRecentTasks, getAllUsers, getRecentActivity } from "@/lib/data";
import DashboardStats from "@/components/DashboardStats";
import DashboardCharts from "@/components/DashboardCharts";
import DashboardActivity from "@/components/DashboardActivity";
import TaskList from "@/components/TaskList";
import { Sparkles, Command, ShieldCheck, Zap, ArrowRight, History, User as UserCircle } from "lucide-react";
import Link from "next/link";
import CreateTaskButton from "@/components/CreateTaskButton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950/40 p-4">
        {/* Background decoration */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -left-16 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-3xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="px-10 py-12 text-center">
              <div className="mx-auto mb-6 w-14 h-14 grid place-items-center rounded-2xl bg-primary/10 text-primary">
                <Command className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-black tracking-tight text-zinc-900">
                Welcome to the <span className="text-primary italic">Command Hub</span>
              </h1>
              <p className="mt-4 text-sm font-medium text-zinc-500">
                Choose your entry path – create an account or sign in to continue.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
              <Link
                href="/signup"
                className="group flex flex-col p-10 gap-6 hover:bg-white/90 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-zinc-900">Create Account</h2>
                    <p className="mt-1 text-sm text-zinc-500">Register as User or Admin to get started.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Admin
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <UserCircle className="w-4 h-4" /> User
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                href="/login"
                className="group flex flex-col p-10 gap-6 hover:bg-white/90 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-zinc-900">Log In</h2>
                    <p className="mt-1 text-sm text-zinc-500">Access your dashboard and resume operations.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    <span className="inline-flex items-center gap-1">
                      <Zap className="w-4 h-4" /> Fast
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Secure
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>

            <div className="px-10 py-6 text-center text-xs text-zinc-500">
              Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link> or <Link href="/signup" className="font-semibold text-primary hover:underline">create one</Link> in seconds.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userId = session.user.id;
  const userRole = (session.user as any).role;

  const [stats, recentTasks, recentActivity, users] = await Promise.all([
    getDashboardStats(userId, userRole),
    getRecentTasks(userId, userRole),
    getRecentActivity(6, userId, userRole),
    getAllUsers(),
  ]);

  const chartData = {
    statusData: [
      { name: 'Completed', value: stats.completed },
      { name: 'In Progress', value: stats.inProgress },
      { name: 'Pending', value: stats.pending },
    ],
    priorityData: stats.priorityDistribution
  };

  return (
    <div className="min-h-screen relative pb-20">
      {/* Background Element handled in layout */}
      
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
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{userRole} Node</span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-zinc-900 leading-none">
                Executive <span className="text-primary italic">Overview</span>
              </h1>
              <p className="text-xl font-medium text-zinc-500">
                {userRole === 'Admin' 
                  ? "Synchronizing global mission logic and operational parameters." 
                  : "Managing your personal mission registry and active objectives."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end -space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security</span>
              <span className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                {session.user.name}
                <ShieldCheck className="w-4 h-4 text-primary" />
              </span>
            </div>
            <CreateTaskButton users={users} userRole={userRole} />
          </div>
        </header>

        <main className="space-y-12">
          {/* Key Performance Indicators */}
          <Suspense fallback={<div className="h-64 bg-zinc-50 rounded-3xl animate-pulse" />}>
            <DashboardStats stats={stats} />
          </Suspense>

          {/* Analytics Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3 px-1">
                   <Command className="w-5 h-5 text-zinc-400" />
                   <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">Advanced Analytics</h2>
                </div>
                <Suspense fallback={<div className="h-96 bg-zinc-50 rounded-3xl animate-pulse" />}>
                   <DashboardCharts data={chartData} />
                </Suspense>
             </div>
             <div className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                   <History className="w-5 h-5 text-zinc-400" />
                   <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">Event Stream</h2>
                </div>
                <Suspense fallback={<div className="h-96 bg-zinc-50 rounded-3xl animate-pulse" />}>
                   <DashboardActivity logs={recentActivity} />
                </Suspense>
             </div>
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
              <TaskList 
                tasks={recentTasks} 
                userRole={userRole} 
                users={users} 
                currentUserId={userId} 
              />
            </Suspense>
          </section>
        </main>
      </div>
    </div>
  );
}
