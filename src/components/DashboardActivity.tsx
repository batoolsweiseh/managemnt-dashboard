"use client";

import { ActivityLog } from "@/lib/types";
import { Clock, History, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function DashboardActivity({ logs }: { logs: ActivityLog[] }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden flex flex-col h-full">
      <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <History className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-zinc-900">Live <span className="text-primary italic">Feed</span></h2>
        </div>
        <Link 
          href="/activity" 
          className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors flex items-center gap-1.5"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex-1 divide-y divide-zinc-50 overflow-y-auto custom-scrollbar">
        {logs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-zinc-50 rounded-2xl mx-auto flex items-center justify-center border border-zinc-100/50">
              <Clock className="w-6 h-6 text-zinc-300" />
            </div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No Recent Activity</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-zinc-50/50 transition-colors group">
              <div className="flex items-start gap-4">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  log.action === 'CREATED' ? 'bg-emerald-500' :
                  log.action === 'DELETED' ? 'bg-rose-500' :
                  log.action === 'STATUS_CHANGE' ? 'bg-amber-500' :
                  'bg-zinc-400'
                } ring-4 ring-transparent group-hover:ring-zinc-100 transition-all`} />
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary truncate">
                      {log.action.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 whitespace-nowrap">
                      {Math.abs(Date.now() - new Date(log.timestamp).getTime()) < 60000 
                        ? 'Just Now' 
                        : formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-zinc-900 truncate">
                    {log.userName}
                  </p>
                  <p className="text-xs font-medium text-zinc-500 line-clamp-1">
                    {log.details}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-zinc-50/50 mt-auto border-t border-zinc-100">
        <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Real-time Telemetry Active</span>
        </div>
      </div>
    </div>
  );
}
