"use client";

import { ActivityLog } from "@/lib/types";
import { getTaskActivity } from "@/lib/actions";
import { X, History, User, Clock, Terminal, ArrowRight, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

import { useQuery } from "@tanstack/react-query";

interface TaskHistoryDialogProps {
  taskId: string;
  taskTitle: string;
  onClose: () => void;
}

export default function TaskHistoryDialog({ taskId, taskTitle, onClose }: TaskHistoryDialogProps) {
  const { data: logs = [], isLoading, isError } = useQuery<ActivityLog[]>({
    queryKey: ['task-activity', taskId],
    queryFn: () => getTaskActivity(taskId),
    staleTime: 300000, // Reuse data for 5 minutes
  });

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white overflow-hidden animate-in zoom-in-95 duration-500">
        {/* Header Section */}
        <div className="p-8 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <History className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operational History</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900">
              Audit Log: <span className="text-primary italic">{taskTitle}</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600 transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Accessing Registry...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 text-rose-500">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
                <AlertTriangle className="w-8 h-8 opacity-50" />
              </div>
              <div>
                <p className="font-black uppercase tracking-widest text-xs">Registry Connection Lost</p>
                <p className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-tighter text-rose-400">Error retrieving mission parameters</p>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100">
                <Terminal className="w-8 h-8 text-zinc-300" />
              </div>
              <p className="text-zinc-500 font-medium">No activity records found for this objective.</p>
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:left-[21px] before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-100">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-12 group">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 w-11 h-11 rounded-xl border-4 border-white shadow-md flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${
                    log.action === 'CREATED' ? 'bg-emerald-500' :
                    log.action === 'DELETED' ? 'bg-rose-500' :
                    log.action === 'STATUS_CHANGE' ? 'bg-amber-500' :
                    'bg-zinc-900'
                  }`}>
                    {log.action === 'CREATED' ? <Clock className="w-4 h-4 text-white" /> :
                     log.action === 'STATUS_CHANGE' ? <ArrowRight className="w-4 h-4 text-white" /> :
                     <Terminal className="w-4 h-4 text-white" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                        log.action === 'CREATED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        log.action === 'DELETED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-zinc-50 text-zinc-600 border-zinc-100'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400">
                        {Math.abs(Date.now() - new Date(log.timestamp).getTime()) < 60000 
                          ? 'Just Now' 
                          : formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 group-hover:border-primary/20 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-zinc-200 flex items-center justify-center text-[10px] font-bold">
                          {log.userName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-zinc-900">{log.userName}</span>
                      </div>
                      <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                        {log.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-100 text-center">
            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Secure Audit Trail — End of Record</span>
        </div>
      </div>
    </div>
  );
}
