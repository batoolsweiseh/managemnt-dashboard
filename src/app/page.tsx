import { Suspense } from "react";
import { getDashboardStats, getRecentTasks } from "@/lib/data";
import DashboardStats from "@/components/DashboardStats";
import DashboardCharts from "@/components/DashboardCharts";
import { Plus, ArrowUpRight, Calendar } from "lucide-react";
import CreateTaskButton from "@/components/CreateTaskButton";
import Link from "next/link";

export default async function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 mb-4 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Task Overview</h1>
          <p className="text-muted-foreground mt-2 font-medium italic">Monitor your metrics and progress with real-time insights</p>
        </div>
        <CreateTaskButton />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const [stats, recentTasks] = await Promise.all([
    getDashboardStats(),
    getRecentTasks()
  ]);

  if (stats.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center glass-morphism rounded-2xl border-white/10 dark:border-white/5 border border-dashed">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-primary/20">
          <Plus className="h-10 w-10 text-primary animate-pulse-subtle" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-foreground">No tasks available</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Get started with your productivity journey by creating your first task today.
        </p>
        <div className="flex justify-center">
          <CreateTaskButton />
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardStats stats={stats} />
      <DashboardCharts stats={stats} />

      <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-2xl font-black flex items-center gap-3 tracking-tight">
              <div className="w-2.5 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"></div>
              Recent Activity
            </h3>
            <p className="text-sm text-muted-foreground font-medium ml-5">Latest updates from your missions</p>
          </div>
          <Link href="/tasks" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group bg-primary/5 px-4 py-2 rounded-full border border-primary/10 hover:border-primary/30">
            View All Missions <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid gap-5">
          {recentTasks.map((task, i) => (
            <div
              key={task.id}
              className="premium-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-white transition-all duration-500 overflow-hidden relative border-l-4 border-l-transparent hover:border-l-primary"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner ${task.status === 'Completed' ? 'bg-green-100 text-green-600 shadow-green-200/50' :
                    task.status === 'Pending' ? 'bg-amber-100 text-amber-600 shadow-amber-200/50' :
                      'bg-rose-100 text-rose-600 shadow-rose-200/50'
                  }`}>
                  {task.title[0]}
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-foreground group-hover:text-primary transition-colors tracking-tight">{task.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold mt-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Due {task.dueDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border-2 shadow-sm ${task.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                    task.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  }`}>
                  <div className={`w-2 h-2 rounded-full shadow-sm ${task.status === 'Completed' ? 'bg-green-500' :
                      task.status === 'Pending' ? 'bg-amber-500' :
                        'bg-rose-500 shadow-rose-400'
                    }`} />
                  {task.status}
                </div>
              </div>

              {/* Decorative dynamic background */}
              <div className="absolute top-0 right-0 w-48 h-full bg-linear-to-l from-primary/5 to-transparent translate-x-48 group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-secondary rounded-xl"></div>
        ))}
      </div>
      <div className="h-28 bg-secondary rounded-xl"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px] bg-secondary rounded-xl"></div>
        <div className="h-[400px] bg-secondary rounded-xl"></div>
      </div>
    </div>
  );
}
