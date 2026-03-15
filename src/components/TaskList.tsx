"use client";

import { Task } from "@/lib/data";
import { Calendar, User, AlignLeft, Trash2, Edit2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { deleteTask } from "@/lib/actions";
import { useState } from "react";
import TaskFormDialog from "./TaskFormDialog";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center rounded-[2.5rem] border border-zinc-200 bg-white shadow-sm">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100">
          <AlignLeft className="h-8 w-8 text-zinc-300" />
        </div>
        <h2 className="text-2xl font-black mb-2 text-zinc-900 tracking-tight">System Clear</h2>
        <p className="text-zinc-500 max-w-sm mx-auto mb-8 font-medium italic">
          No active missions detected. Ready for new objective deployment.
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-zinc-900 text-white border-zinc-900';
      case 'In Progress': return 'bg-white text-zinc-900 border-zinc-200';
      default: return 'bg-zinc-100 text-zinc-600 border-zinc-100';
    }
  };

  return (
    <div className="grid gap-4">
      {tasks.map((task, i) => (
        <div
          key={task.id}
          className="group relative bg-white rounded-3xl border border-zinc-100 p-6 sm:p-8 hover:border-primary/20 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] transition-all duration-500"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getPriorityStyle(task.priority)}`}>
                  {task.priority}
                </span>
                <h3 className="text-xl font-black text-zinc-900 group-hover:text-primary transition-colors tracking-tight">
                  {task.title}
                </h3>
              </div>
              
              <p className="text-zinc-500 font-medium line-clamp-2 max-w-3xl leading-relaxed text-sm">
                {task.description}
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Due {task.dueDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                  <User className="w-3.5 h-3.5" />
                  <span>{task.assignedUser}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 lg:pl-8 lg:border-l lg:border-zinc-100">
              <div className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] border transition-all flex items-center gap-2 shadow-sm ${getStatusStyle(task.status)}`}>
                {getStatusIcon(task.status)}
                {task.status}
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditingTask(task)}
                  className="p-3 rounded-xl bg-zinc-50 hover:bg-zinc-900 hover:text-white transition-all duration-300 group/btn border border-zinc-100 shadow-xs"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this mission?')) {
                      await deleteTask(task.id);
                    }
                  }}
                  className="p-3 rounded-xl bg-zinc-50 hover:bg-rose-500 hover:text-white transition-all duration-300 group/btn border border-zinc-100 shadow-xs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {editingTask && (
        <TaskFormDialog 
          task={editingTask} 
          onClose={() => setEditingTask(null)} 
        />
      )}
    </div>
  );
}
