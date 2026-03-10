import { CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    completionRate: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  const cards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: ListTodo,
      color: "text-primary",
      bgClass: "from-primary/10 via-primary/5 to-transparent",
      trend: "+12% vs last month",
      trendUp: true
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-green-600",
      bgClass: "from-green-600/10 via-green-600/5 to-transparent",
      trend: "+5.4% week increase",
      trendUp: true
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bgClass: "from-amber-600/10 via-amber-600/5 to-transparent",
      trend: "-2.1% decrease",
      trendUp: false
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: "text-rose-600",
      bgClass: "from-rose-600/10 via-rose-600/5 to-transparent",
      trend: "+1 since yesterday",
      trendUp: true
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index} 
              className={`premium-card p-6 stat-card-gradient transition-all hover:-translate-y-2 hover:shadow-2xl group before:bg-linear-to-br ${card.bgClass} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                    {card.title}
                  </h3>
                  <div className={`p-2.5 rounded-2xl bg-white border border-border/40 shadow-sm ${card.color} group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 relative z-10">
                  <p className={`text-5xl font-black tracking-tighter ${card.color}`}>
                    {card.value}
                  </p>
                  {index === 1 && <span className="text-sm font-bold text-muted-foreground">({stats.completionRate}%)</span>}
                </div>
              </div>
              
              <div className="mt-4 relative z-10 flex items-center gap-1.5">
                <div className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${card.trendUp ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                  {card.trendUp ? '▲' : '▼'}
                </div>
                <span className="text-xs font-medium text-muted-foreground/80">{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="premium-card p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
        <div className="flex justify-between items-end mb-3 relative z-10">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <div className="w-2 h-6 bg-primary rounded-full"></div>
              Overall Progress
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Based on completed vs total tasks</p>
          </div>
          <p className="font-bold text-2xl text-primary">{stats.completionRate}%</p>
        </div>
        <div className="h-4 w-full bg-secondary rounded-full overflow-hidden relative z-10 shadow-inner">
          <div 
            className="h-full bg-linear-to-r from-primary to-purple-500 transition-all duration-1000 ease-out relative"
            style={{ width: `${stats.completionRate}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse-subtle"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
