"use client";

import { Task } from "@/lib/data";
import { Calendar, User, AlignLeft, Trash2, Edit2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { deleteTask, updateTaskStatus } from "@/lib/actions";
import { useState } from "react";
import TaskFormDialog from "./TaskFormDialog";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center glass-morphism rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary/5">
          <AlignLeft className="h-10 w-10 text-primary/60" />
        </div>
        <h2 className="text-3xl font-black mb-3 text-foreground tracking-tight">No Missions Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8 font-medium">
          Try adjusting your search filters or create a new objective to get started.
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-rose-500 shadow-rose-200';
      case 'Medium': return 'bg-amber-500 shadow-amber-200';
      default: return 'bg-blue-500 shadow-blue-200';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200 ring-green-100';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100';
    }
  };

  return (
    <div className="grid gap-6">
      {tasks.map((task, i) => (
        <div
          key={task.id}
          className="premium-card p-0 flex flex-col overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border-l-8 border-l-transparent hover:border-l-primary"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm ${getPriorityColor(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                    <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter">
                      {task.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground font-medium line-clamp-2 max-w-2xl leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-2">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="bg-secondary/50 px-3 py-1 rounded-lg">Due {task.dueDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <User className="w-4 h-4 text-primary" />
                  <span className="bg-secondary/50 px-3 py-1 rounded-lg">{task.assignedUser}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 sm:min-w-[180px] border-t sm:border-t-0 sm:border-l border-border/10 pt-4 sm:pt-0 sm:pl-6">
              <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-widest border-2 ring-4 transition-all ${getStatusStyle(task.status)}`}>
                {getStatusIcon(task.status)}
                {task.status}
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditingTask(task)}
                  className="p-3 rounded-2xl bg-secondary hover:bg-primary hover:text-white transition-all duration-300 group/btn shadow-sm"
                  title="Edit Mission"
                >
                  <Edit2 className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                </button>
                <button 
                  onClick={async () => {
                    if (confirm('Are you sure you want to abort this mission?')) {
                      await deleteTask(task.id);
                    }
                  }}
                  className="p-3 rounded-2xl bg-secondary hover:bg-rose-600 hover:text-white transition-all duration-300 group/btn shadow-sm"
                  title="Delete Mission"
                >
                  <Trash2 className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                </button>
              </div>
            </div>
          </div>

          {/* Mini progress bar at bottom of card */}
          <div className="h-1.5 w-full bg-secondary/30 relative">
             <div 
              className={`h-full transition-all duration-1000 ${task.status === 'Completed' ? 'w-full bg-green-500' : task.status === 'In Progress' ? 'w-1/2 bg-blue-500 animate-pulse' : 'w-1/4 bg-amber-500'}`}
             />
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
