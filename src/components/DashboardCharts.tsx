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
import { Target, BarChart3, PieChart as PieIcon, Activity, Zap } from 'lucide-react';

interface ChartsProps {
  data: {
    statusData: { name: string; value: number }[];
    priorityData: { name: string; value: number }[];
  };
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'];
const GLOWS = ['rgba(139, 92, 246, 0.4)', 'rgba(16, 185, 129, 0.4)', 'rgba(245, 158, 11, 0.4)', 'rgba(244, 63, 94, 0.4)'];

export default function DashboardCharts({ data }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
      {/* Distribution Chart - Vibrant Neon */}
      <div className="premium-card p-12 flex flex-col bg-slate-900/40 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-violet-400">
              <PieIcon className="w-5 h-5 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Distribution</span>
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-white">Status Flux</h3>
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform duration-500">
            <Activity className="w-6 h-6 text-violet-400" />
          </div>
        </div>
        
        <div className="h-[400px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.statusData}
                cx="50%"
                cy="50%"
                innerRadius={110}
                outerRadius={145}
                paddingAngle={10}
                dataKey="value"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={2}
              >
                {data.statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    style={{ filter: `drop-shadow(0 0 8px ${GLOWS[index % GLOWS.length]})` }}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a',
                  borderRadius: '20px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  padding: '20px',
                  color: '#fff'
                }} 
                itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ paddingTop: '30px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-5 text-center pointer-events-none">
             <span className="text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {data.statusData.reduce((acc, curr) => acc + curr.value, 0)}
             </span>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-2">Core</p>
          </div>
        </div>
      </div>

      {/* Comparison Chart - Electric Bars */}
      <div className="premium-card p-12 flex flex-col bg-slate-900/40 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-blue-400">
              <BarChart3 className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Metric Comparison</span>
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-white">Priority Spectrum</h3>
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
             <Zap className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.priorityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' }}
                dy={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.02)', radius: 20 }}
                contentStyle={{ 
                  backgroundColor: '#0f172a',
                  borderRadius: '20px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  padding: '20px'
                }} 
              />
              <Bar 
                dataKey="value" 
                radius={[16, 16, 0, 0]} 
                barSize={55}
              >
                 {data.priorityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      style={{ filter: `drop-shadow(0 0 12px ${GLOWS[index % GLOWS.length]})` }}
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
