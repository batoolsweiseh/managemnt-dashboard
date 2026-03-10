import { Suspense } from "react";
import { getDashboardStats, getRecentTasks } from "@/lib/data";
import DashboardStats from "@/components/DashboardStats";
import DashboardCharts from "@/components/DashboardCharts";
import { Plus, ArrowUpRight, Calendar } from "lucide-react";

export default async function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 mb-4 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Task Overview</h1>
          <p className="text-muted-foreground mt-2 font-medium italic">Monitor your metrics and progress with real-time insights</p>
        </div>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold ring-offset-background transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg shadow-primary/25 h-12 px-6 group">
          <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
          <span>New Mission</span>
        </button>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();
  const recentTasks = await getRecentTasks();

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
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg h-10 px-6 py-2">
          Create Empty Task
        </button>
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
          <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group bg-primary/5 px-4 py-2 rounded-full border border-primary/10 hover:border-primary/30">
            View All Missions <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="grid gap-5">
          {recentTasks.map((task, i) => (
            <div 
              key={task.id} 
              className="premium-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-white transition-all duration-500 overflow-hidden relative border-l-4 border-l-transparent hover:border-l-primary"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner ${
                  task.status === 'completed' ? 'bg-green-100 text-green-600 shadow-green-200/50' : 
                  task.status === 'pending' ? 'bg-amber-100 text-amber-600 shadow-amber-200/50' : 
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
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border-2 shadow-sm ${
                  task.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                  task.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                  'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                }`}>
                  <div className={`w-2 h-2 rounded-full shadow-sm ${
                    task.status === 'completed' ? 'bg-green-500' : 
                    task.status === 'pending' ? 'bg-amber-500' : 
                    'bg-rose-500 shadow-rose-400'
                  }`} />
                  {task.status}
                </div>
                <button className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
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
