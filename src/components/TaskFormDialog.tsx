"use client";

import { Task, TaskStatus, TaskPriority } from "@/lib/data";
import { X, Calendar, User, Tag, AlignLeft, ShieldCheck, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface TaskFormDialogProps {
  task?: Task | null;
  onClose: () => void;
}

export default function TaskFormDialog({ task, onClose }: TaskFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    startTransition(async () => {
      try {
        const url = task ? `/api/tasks/${task.id}` : '/api/tasks';
        const method = task ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const result = await response.json();
          setError(result.error || 'Operation failed');
        } else {
          router.refresh();
          onClose();
        }
      } catch (err) {
        console.error('Form submission error:', err);
        setError('Network mismatch or server down. Please try again.');
      }
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white overflow-hidden animate-in zoom-in-95 duration-500">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 w-full h-[6px] bg-linear-to-r from-primary via-indigo-500 to-primary"></div>
        
        <div className="p-8 sm:p-10">
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operational Console</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-900">
                {task ? "Edit Mission" : "New Objective"}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-all active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                  Mission Title
                </label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <input
                    name="title"
                    required
                    defaultValue={task?.title}
                    placeholder="Enter mission name..."
                    className="w-full h-12 pl-11 pr-4 bg-zinc-50 border border-zinc-200 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl outline-none transition-all font-semibold text-zinc-900 placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                  Briefing Notes
                </label>
                <div className="relative group">
                  <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <textarea
                    name="description"
                    required
                    defaultValue={task?.description}
                    rows={3}
                    placeholder="Describe the operational goals..."
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl outline-none transition-all font-medium text-zinc-700 resize-none min-h-[100px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status Select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                    Phase
                  </label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                    <select
                      name="status"
                      required
                      defaultValue={task?.status || "Pending"}
                      className="w-full h-12 pl-11 pr-4 bg-zinc-50 border border-zinc-200 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl outline-none transition-all font-bold text-zinc-900 appearance-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Priority Select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                    Priority
                  </label>
                  <div className="relative group">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                    <select
                      name="priority"
                      required
                      defaultValue={task?.priority || "Medium"}
                      className="w-full h-12 pl-11 pr-4 bg-zinc-50 border border-zinc-200 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl outline-none transition-all font-bold text-zinc-900 appearance-none cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Due Date */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                    Deadline
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                    <input
                      name="dueDate"
                      type="date"
                      required
                      defaultValue={task?.dueDate}
                      className="w-full h-12 pl-11 pr-4 bg-zinc-50 border border-zinc-200 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl outline-none transition-all font-bold text-zinc-900"
                    />
                  </div>
                </div>

                {/* Assigned User */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
                    Operative
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input
                      name="assignedUser"
                      required
                      defaultValue={task?.assignedUser}
                      placeholder="Name..."
                      className="w-full h-12 pl-11 pr-4 bg-zinc-50 border border-zinc-200 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-xl outline-none transition-all font-bold text-zinc-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 text-xs font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-[2] h-12 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 shadow-lg shadow-zinc-200 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isPending ? "Deploying..." : task ? "Update Mission" : "Create Objective"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
