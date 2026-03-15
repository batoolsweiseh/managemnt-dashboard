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
  ChevronRight
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
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-zinc-600 bg-zinc-50 border-zinc-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-amber-500 animate-pulse" />;
      default: return <Circle className="w-4 h-4 text-zinc-300" />;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="premium-card p-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 bg-zinc-50 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-zinc-200">
          <Flag className="w-10 h-10 text-zinc-300" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight text-zinc-900">No Objectives Locked</h3>
          <p className="text-zinc-500 font-medium max-w-sm">The registry is currently clear. Initiate a new mission deployment to begin tracking.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="premium-card group hover:ring-2 hover:ring-primary/10"
          >
            <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-8">
              {/* Status Indicator */}
              <div className="flex items-start lg:items-center gap-6 lg:border-r border-zinc-100 lg:pr-8">
                <div className="relative">
                  <select 
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    task.status === 'Completed' ? 'bg-emerald-50 shadow-emerald-100' : 'bg-zinc-50 shadow-zinc-100'
                  } shadow-lg border border-white`}>
                    {getStatusIcon(task.status)}
                  </div>
                </div>
                
                <div className="space-y-1 min-w-[140px]">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Mission Phase</span>
                    <span className="text-sm font-black text-zinc-900">{task.status}</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black tracking-tight text-zinc-900 group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                    {task.title}
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                  </h3>
                </div>
                <p className="text-zinc-500 font-medium leading-relaxed max-w-3xl text-sm line-clamp-2">
                  {task.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-100">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-bold">Deadline: {task.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-100">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-bold">Operative: {task.assignedUser}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 lg:border-l border-zinc-100 lg:pl-8">
                <button 
                  onClick={() => setEditingTask(task)}
                  className="w-10 h-10 rounded-xl bg-zinc-50 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-300 flex items-center justify-center group/btn shadow-sm"
                >
                  <Edit3 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                </button>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="w-10 h-10 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-600 hover:text-white transition-all duration-300 flex items-center justify-center group/btn shadow-sm"
                >
                  <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                </button>
                <div className="hidden lg:flex w-10 h-10 rounded-xl items-center justify-center text-zinc-300 group-hover:text-zinc-600 transition-colors">
                   <ChevronRight className="w-5 h-5" />
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
