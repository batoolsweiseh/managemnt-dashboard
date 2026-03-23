"use client";

import { Task } from "@/lib/types";
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
  History as HistoryIcon
} from "lucide-react";
import { deleteTask, updateTaskStatus } from "@/lib/actions";
import { useState } from "react";
import { toast } from "sonner";
import TaskFormDialog from "./TaskFormDialog";
import TaskHistoryDialog from "./TaskHistoryDialog";

interface TaskListProps {
  tasks: Task[];
  userRole: "Admin" | "User";
  users: { id: string, name: string }[];
  currentUserId?: string;
}

export default function TaskList({ tasks, userRole, users, currentUserId }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [historyTask, setHistoryTask] = useState<Task | null>(null);

  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, status: any) => {
    setIsUpdating(id);
    try {
      const result = await updateTaskStatus(id, status);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Mission phase updated to ${status}.`);
      }
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to terminate this mission?")) {
      setIsDeleting(id);
      try {
        const result = await deleteTask(id);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Mission terminated successfully.");
        }
      } finally {
        setIsDeleting(null);
      }
    }
  };

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
                    onChange={(e) => handleStatusUpdate(task.id, e.target.value as any)}
                    disabled={isUpdating === task.id || (userRole !== 'Admin' && task.assignedUserId !== currentUserId)}
                    className={`absolute inset-0 w-full h-full opacity-0 z-10 ${
                      (isUpdating === task.id || (userRole !== 'Admin' && task.assignedUserId !== currentUserId)) ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    task.status === 'Completed' ? 'bg-emerald-50 shadow-emerald-100' : 'bg-zinc-50 shadow-zinc-100'
                  } shadow-lg border border-white ${isUpdating === task.id ? 'animate-pulse opacity-50' : ''}`}>
                    {isUpdating === task.id ? <Clock className="w-4 h-4 text-zinc-400 animate-spin" /> : getStatusIcon(task.status)}
                  </div>
                </div>
                
                <div className="space-y-1 min-w-[140px]">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Mission Phase</span>
                    <span className="text-sm font-black text-zinc-900">
                      {isUpdating === task.id ? 'Syncing...' : task.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black tracking-tight text-zinc-900 group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                    {task.title}
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
                {/* History button: Admin and User who owns the task */}
                {(userRole === 'Admin' || (userRole === 'User' && task.assignedUserId === currentUserId)) && (
                  <button 
                    onClick={() => setHistoryTask(task)}
                    title="View History"
                    className="w-10 h-10 rounded-xl bg-zinc-50 text-zinc-400 hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center group/btn shadow-sm"
                  >
                    <HistoryIcon className="w-4 h-4" />
                  </button>
                )}
                
                {/* Edit button: Admin ONLY (Users use status dropdown) */}
                {userRole === 'Admin' && (
                  <button 
                    onClick={() => setEditingTask(task)}
                    className="w-10 h-10 rounded-xl bg-zinc-50 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-300 flex items-center justify-center group/btn shadow-sm"
                  >
                    <Edit3 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                  </button>
                )}
                {/* Delete button: Admin ONLY */}
                {userRole === 'Admin' && (
                  <button 
                    onClick={() => handleDelete(task.id)}
                    disabled={isDeleting === task.id}
                    className={`w-10 h-10 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-600 hover:text-white transition-all duration-300 flex items-center justify-center group/btn shadow-sm ${
                      isDeleting === task.id ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
                    }`}
                  >
                    {isDeleting === task.id ? <Clock className="w-4 h-4 animate-spin text-rose-400" /> : <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />}
                  </button>
                )}
                {userRole === 'User' && task.assignedUserId !== currentUserId && (
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-2 bg-zinc-50 rounded-xl border border-zinc-100">
                    ReadOnly Mode
                  </div>
                )}
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
          users={users}
          userRole={userRole}
          onClose={() => setEditingTask(null)} 
        />
      )}

      {historyTask && (
        <TaskHistoryDialog
          taskId={historyTask.id}
          taskTitle={historyTask.title}
          onClose={() => setHistoryTask(null)}
        />
      )}
    </>
  );
}
