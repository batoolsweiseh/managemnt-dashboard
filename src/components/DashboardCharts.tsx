"use client";

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Target, BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';

interface ChartsProps {
  data: {
    statusData: { name: string; value: number }[];
    priorityData: { name: string; value: number }[];
  };
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

export default function DashboardCharts({ data }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
      {/* Distribution Chart */}
      <div className="premium-card p-10 flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <PieIcon className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Data Visualization</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-zinc-900">Task Allocation</h3>
          </div>
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient key={`grad-${index}`} id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1}/>
                    <stop offset="100%" stopColor={color} stopOpacity={0.8}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={data.statusData}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={130}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {data.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#grad-${index % COLORS.length})`} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '24px', 
                  border: '1px solid #f1f5f9', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  padding: '16px',
                  fontWeight: '900',
                  fontSize: '12px',
                  textTransform: 'uppercase'
                }} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 text-center pointer-events-none">
             <span className="text-4xl font-black tracking-tighter text-zinc-900 leading-none">
              {data.statusData.reduce((acc, curr) => acc + curr.value, 0)}
             </span>
             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Total</p>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="premium-card p-10 flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <BarChart3 className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operational Overview</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-zinc-900">Priority Delta</h3>
          </div>
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-400">
             <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.priorityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900 }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc', radius: 16 }}
                contentStyle={{ 
                  borderRadius: '24px', 
                  border: '1px solid #f1f5f9', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  padding: '16px',
                  fontWeight: '900',
                  fontSize: '12px'
                }} 
              />
              <Bar 
                dataKey="value" 
                fill="#6366f1" 
                radius={[12, 12, 0, 0]} 
                barSize={45}
              >
                 {data.priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
