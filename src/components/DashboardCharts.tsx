"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const COLORS = {
  completed: 'hsl(var(--success))',
  pending: 'hsl(var(--warning))',
  overdue: 'hsl(var(--destructive))',
};

interface ChartProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
}

export default function DashboardCharts({ stats }: ChartProps) {
  const pieData = [
    { name: 'Completed', value: stats.completed, color: COLORS.completed },
    { name: 'Pending', value: stats.pending, color: COLORS.pending },
    { name: 'Overdue', value: stats.overdue, color: COLORS.overdue },
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'Completed', count: stats.completed },
    { name: 'Pending', count: stats.pending },
    { name: 'Overdue', count: stats.overdue },
  ];

  if (stats.total === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Pie Chart */}
      <div className="premium-card p-6 flex flex-col h-[400px]">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          Task Status Distribution
        </h3>
        <div className="flex-1 w-full relative min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--border)', 
                  backgroundColor: 'var(--card)', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Centered Total Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50">{stats.total}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Total Tasks</span>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="premium-card p-6 flex flex-col h-[400px]">
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          Status Comparison overview
        </h3>
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--border)', 
                  backgroundColor: 'var(--card)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar 
                dataKey="count" 
                radius={[6, 6, 0, 0]}
                barSize={60}
              >
                {barData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === 'Completed' ? COLORS.completed : entry.name === 'Pending' ? COLORS.pending : COLORS.overdue} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
