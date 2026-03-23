"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Note: Checking if Button exists elsewhere, currently using class names

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-16 -left-16 w-[40rem] h-[40rem] bg-rose-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-[40rem] h-[40rem] bg-rose-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(255,100,100,0.3)] border border-rose-100/50 overflow-hidden p-12 text-center animate-in zoom-in-95 duration-700">
        <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-rose-200 shadow-inner group">
          <AlertTriangle className="w-12 h-12 text-rose-500 animate-in spin-in-180 duration-1000" />
        </div>

        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 rounded-full border border-rose-100 mb-4">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">System Failure Critical</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 leading-none">
            Operational <span className="text-rose-500 italic">Disruption</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-md mx-auto leading-relaxed">
            The mission registry encountered an unforeseen anomaly. Critical parameters failed to synchronize with the command hub.
          </p>
          {error.digest && (
             <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100 max-w-sm mx-auto">
               <p className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">Trace ID: {error.digest}</p>
             </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-zinc-950/20 hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Link Sequence
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-50 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
          >
            <Home className="w-4 h-4" />
            Return to Nexus
          </Link>
        </div>

        <p className="mt-12 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300">
          End of Error Record — Accessing Contingency Protocols
        </p>
      </div>
    </div>
  );
}
