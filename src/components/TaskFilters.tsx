"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, Calendar, SlidersHorizontal, Sliders } from "lucide-react";
import { useTransition, useEffect, useState } from "react";

export default function TaskFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("query")?.toString() || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleFilterChange("query", query);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    setQuery("");
    startTransition(() => {
      replace(pathname, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-10 w-full animate-in fade-in slide-in-from-top-6 duration-1000">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Search Bar - Futuristic Dark */}
        <div className="relative flex-1 w-full group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
            <Search className="h-5 w-5 text-violet-500 group-focus-within:text-white transition-colors animate-pulse" />
            <div className="w-[1px] h-5 bg-white/10" />
          </div>
          <input
            placeholder="Search operational data in neural registry..."
            className="w-full pl-20 pr-14 h-16 bg-white/5 border border-white/10 focus:border-violet-500 focus:ring-8 focus:ring-violet-500/10 rounded-3xl outline-none transition-all font-black text-white placeholder:text-slate-600 shadow-2xl tracking-tight"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isPending && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-3 h-16 px-10 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-3xl transition-all duration-500 font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95"
          >
            <X className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>

      {/* Quick Filters - Neon Toggles */}
      <div className="flex flex-wrap items-center gap-6 p-4 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
        <div className="flex items-center gap-3 px-4 text-slate-500">
          <Sliders className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Heuristic Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Status Select */}
          <div className="relative group">
            <select
              className="pl-6 pr-12 h-12 bg-slate-900 border border-white/10 rounded-2xl outline-none transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer hover:border-violet-500 text-white focus:ring-4 focus:ring-violet-500/10"
              onChange={(e) => handleFilterChange("status", e.target.value)}
              value={searchParams.get("status") || "all"}
            >
              <option value="all">PHASE: ALL</option>
              <option value="Pending">PENDING</option>
              <option value="In Progress">IN PROGRESS</option>
              <option value="Completed">COMPLETED</option>
            </select>
            <Filter className={`absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${searchParams.get("status") ? 'text-violet-500' : 'text-slate-600'}`} />
          </div>

          {/* Priority Select */}
          <div className="relative group">
            <select
              className="pl-6 pr-12 h-12 bg-slate-900 border border-white/10 rounded-2xl outline-none transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer hover:border-violet-500 text-white focus:ring-4 focus:ring-violet-500/10"
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              value={searchParams.get("priority") || "all"}
            >
              <option value="all">PRIORITY: ALL</option>
              <option value="High">HIGH</option>
              <option value="Medium">MEDIUM</option>
              <option value="Low">LOW</option>
            </select>
            <Filter className={`absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${searchParams.get("priority") ? 'text-amber-500' : 'text-slate-600'}`} />
          </div>

          {/* Date Picker */}
          <div className="relative group flex-1 max-w-[240px]">
            <input
              type="date"
              className="w-full pl-6 pr-12 h-12 bg-slate-900 border border-white/10 rounded-2xl outline-none transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer hover:border-violet-500 text-white focus:ring-4 focus:ring-violet-500/10"
              onChange={(e) => handleFilterChange("dueDate", e.target.value)}
              value={searchParams.get("dueDate") || ""}
            />
            <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
