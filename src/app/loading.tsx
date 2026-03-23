import { Command } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8 space-y-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="w-40 h-8 bg-zinc-100 rounded-2xl" />
          <div className="space-y-2">
            <div className="w-80 h-16 bg-zinc-100 rounded-3xl" />
            <div className="w-60 h-6 bg-zinc-50 rounded-xl" />
          </div>
        </div>
        <div className="w-48 h-12 bg-zinc-100 rounded-2xl" />
      </div>

      <div className="space-y-12">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-zinc-50 rounded-3xl border border-zinc-100" />
          ))}
        </div>

        {/* Analytics Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[400px] bg-zinc-50 rounded-[2.5rem] border border-zinc-100" />
          <div className="h-[400px] bg-zinc-50 rounded-[2.5rem] border border-zinc-100" />
        </div>

        {/* Tasks Skeleton */}
        <div className="space-y-4">
          <div className="w-40 h-6 bg-zinc-100 rounded-xl" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-zinc-50 rounded-3xl border border-zinc-100" />
          ))}
        </div>
      </div>

      {/* Center Spinner for good measure */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
         <div className="w-16 h-16 bg-white rounded-3xl shadow-xl border border-zinc-100 flex items-center justify-center">
            <Command className="w-8 h-8 text-primary animate-spin" />
         </div>
      </div>
    </div>
  );
}
