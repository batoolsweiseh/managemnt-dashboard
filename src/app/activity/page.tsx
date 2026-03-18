import { getActivityLogs, getAllUsers } from "@/lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { History, User, Clock, Terminal, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function ActivityPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const userRole = (session.user as any).role;
  if (userRole !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <div className="w-20 h-20 bg-rose-50 rounded-[2.5rem] flex items-center justify-center border-2 border-rose-100 shadow-xl shadow-rose-100/50">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Access Denied</h1>
          <p className="text-zinc-500 font-medium max-w-sm mx-auto">
            The mission activity log is restricted to Executive personnel only.
          </p>
        </div>
      </div>
    );
  }

  const logs = await getActivityLogs();

  return (
    <div className="max-w-5xl mx-auto py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 animate-in slide-in-from-left duration-700">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start text-primary">
            <Terminal className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Audit Log</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">Mission <span className="text-primary italic">History</span></h1>
          <p className="text-zinc-500 font-medium italic truncate max-w-lg">Complete chronological sequence of system state transitions</p>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4 animate-in fade-in duration-1000 delay-200">
        {logs.length === 0 ? (
          <div className="premium-card p-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-zinc-50 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-zinc-200">
              <History className="w-10 h-10 text-zinc-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight text-zinc-900">No Operations Recorded</h3>
              <p className="text-zinc-500 font-medium max-w-sm">The temporal registry is currently empty.</p>
            </div>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="premium-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:ring-2 hover:ring-primary/10 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white shrink-0 ${
                log.action === 'CREATED' ? 'bg-emerald-50 text-emerald-500 shadow-emerald-100' :
                log.action === 'DELETED' ? 'bg-rose-50 text-rose-500 shadow-rose-100' :
                log.action === 'STATUS_CHANGE' ? 'bg-amber-50 text-amber-500 shadow-amber-100' :
                'bg-zinc-50 text-zinc-500 shadow-zinc-100'
              }`}>
                {log.action === 'CREATED' ? <Clock className="w-5 h-5" /> :
                 log.action === 'DELETED' ? <Terminal className="w-5 h-5" /> :
                 log.action === 'STATUS_CHANGE' ? <Terminal className="w-5 h-5" /> :
                 <History className="w-5 h-5" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                   <span className="text-xs font-black uppercase tracking-widest text-primary shrink-0">{log.action}</span>
                   <div className="h-px bg-zinc-100 flex-1"></div>
                   <span className="text-[10px] font-bold text-zinc-400 uppercase">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                   <span className="text-primary font-black italic">{log.userName}</span> 
                   {" "}{log.details}
                </h3>
              </div>

              <div className="hidden lg:flex flex-col items-end shrink-0 pl-6 border-l border-zinc-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Timestamp</span>
                <span className="text-[11px] font-bold text-zinc-900">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
