"use client";

import { Task, TaskStatus, TaskPriority } from "@/lib/data";
import { X, Calendar, User, Tag, AlignLeft, ShieldCheck } from "lucide-react";
import { createTask, updateTask } from "@/lib/actions";
import { useState, useTransition } from "react";

interface TaskFormDialogProps {
  task?: Task | null;
  onClose: () => void;
}

export default function TaskFormDialog({ task, onClose }: TaskFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = task 
        ? await updateTask(task.id, formData)
        : await createTask(formData);
      
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary via-purple-500 to-rose-500"></div>
        
        <div className="p-8 sm:p-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-foreground">
                {task ? "Update Mission Parameters" : "New Mission Protocol"}
              </h2>
              <p className="text-muted-foreground font-medium mt-1 italic">
                {task ? "Modify the existing operational details" : "Define the scope and objectives for the mission"}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 rounded-2xl bg-secondary/50 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form action={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2 group">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  Mission Designation
                </label>
                <input
                  name="title"
                  required
                  defaultValue={task?.title}
                  placeholder="e.g., Orbital Gateway Deployment"
                  className="w-full h-14 px-6 bg-secondary/30 border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <AlignLeft className="w-3 h-3 text-primary" />
                  Operational Briefing
                </label>
                <textarea
                  name="description"
                  required
                  defaultValue={task?.description}
                  rows={3}
                  placeholder="Detailed breakdown of the deployment objectives..."
                  className="w-full px-6 py-4 bg-secondary/30 border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all font-medium text-foreground resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Status Select */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <Tag className="w-3 h-3 text-primary" />
                    Status Phase
                  </label>
                  <select
                    name="status"
                    required
                    defaultValue={task?.status || "Pending"}
                    className="w-full h-14 px-6 bg-secondary/30 border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Priority Select */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    required
                    defaultValue={task?.priority || "Medium"}
                    className="w-full h-14 px-6 bg-secondary/30 border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Due Date */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-primary" />
                    Target Deadline
                  </label>
                  <input
                    name="dueDate"
                    type="date"
                    required
                    defaultValue={task?.dueDate}
                    className="w-full h-14 px-6 bg-secondary/30 border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                  />
                </div>

                {/* Assigned User */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <User className="w-3 h-3 text-primary" />
                    Operative Assigned
                  </label>
                  <input
                    name="assignedUser"
                    required
                    defaultValue={task?.assignedUser}
                    placeholder="e.g., Commander Shepard"
                    className="w-full h-14 px-6 bg-secondary/30 border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm font-bold text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span>
                {error}
              </p>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-16 rounded-2xl font-black text-muted-foreground hover:bg-secondary transition-all"
              >
                Abort
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-[2] h-16 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isPending ? "Processing..." : task ? "Update Protocol" : "Authorize Mission"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
