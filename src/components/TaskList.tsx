"use client";

import { Task } from "@/lib/data";
import { 
  Calendar, 
  User, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Flag,
  Circle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Zap
} from "lucide-react";
import { deleteTask, updateTaskStatus } from "@/lib/actions";
import { useState } from "react";
import TaskFormDialog from "./TaskFormDialog";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'In Progress': return <Clock className="w-5 h-5 text-amber-400 animate-pulse" />;
      default: return <Circle className="w-5 h-5 text-slate-500" />;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="premium-card p-24 flex flex-col items-center justify-center text-center space-y-8 bg-slate-900/40">
        <div className="w-28 h-28 bg-white/5 rounded-[3rem] flex items-center justify-center border-2 border-dashed border-white/10">
          <Flag className="w-12 h-12 text-slate-600" />
        </div>
        <div className="space-y-3">
          <h3 className="text-3xl font-black tracking-tighter text-white">Registry Void</h3>
          <p className="text-slate-500 font-bold max-w-sm uppercase tracking-widest text-xs">Awaiting new mission deployments.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="premium-card group hover:ring-2 hover:ring-violet-500/20 bg-slate-900/40 border-white/5"
          >
            <div className="p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center gap-10">
              {/* Status Box - Vibrant */}
              <div className="flex items-start lg:items-center gap-8 lg:border-r border-white/5 lg:pr-10">
                <div className="relative group/status">
                  <select 
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    task.status === 'Completed' ? 'bg-emerald-500/10 shadow-emerald-500/20' : 'bg-white/5 shadow-black/20'
                  } shadow-2xl border border-white/10 group-hover/status:scale-110 group-hover/status:border-violet-500/50`}>
                    {getStatusIcon(task.status)}
                  </div>
                </div>
                
                <div className="space-y-2 min-w-[150px]">
                  <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority} LEVEL
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Phase</span>
                    <span className="text-md font-black text-white">{task.status}</span>
                  </div>
                </div>
              </div>

              {/* Mission Details */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black tracking-tighter text-white group-hover:text-violet-400 transition-colors cursor-pointer flex items-center gap-3">
                    {task.title}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 text-violet-500 transition-all" />
                  </h3>
                </div>
                <p className="text-slate-400 font-medium leading-relaxed max-w-3xl text-sm line-clamp-2">
                  {task.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-8 pt-2">
                  <div className="flex items-center gap-3 text-slate-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <Calendar className="w-4 h-4 text-violet-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Target: {task.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Agent: {task.assignedUser}</span>
                  </div>
                </div>
              </div>

              {/* Action Array */}
              <div className="flex items-center justify-end gap-4 lg:border-l border-white/5 lg:pl-10">
                <button 
                  onClick={() => setEditingTask(task)}
                  className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 hover:bg-white hover:text-slate-950 transition-all duration-500 flex items-center justify-center group/btn shadow-xl"
                >
                  <Edit3 className="w-5 h-5 group-hover/btn:rotate-12" />
                </button>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-500 flex items-center justify-center group/btn shadow-xl shadow-rose-500/5"
                >
                  <Trash2 className="w-5 h-5 group-hover/btn:scale-125" />
                </button>
                <div className="hidden lg:flex w-12 h-12 rounded-2xl items-center justify-center text-slate-800 group-hover:text-violet-500 transition-colors">
                   <ChevronRight className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingTask && (
        <TaskFormDialog 
          task={editingTask} 
          onClose={() => setEditingTask(null)} 
        />
      )}
    </>
  );
}
