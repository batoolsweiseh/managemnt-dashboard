"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, Calendar, SlidersHorizontal } from "lucide-react";
import { useTransition, useEffect, useState } from "react";

export default function TaskFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("query")?.toString() || "");

  // Handle Search Input with Debounce
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
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Search Bar - Premium Design */}
        <div className="relative flex-1 w-full group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <div className="w-[1px] h-4 bg-zinc-200" />
          </div>
          <input
            placeholder="Search missions by title, description or operative..."
            className="w-full pl-16 pr-12 h-14 bg-white border border-zinc-200 focus:border-zinc-900 focus:ring-8 focus:ring-zinc-900/5 rounded-2xl outline-none transition-all font-semibold text-zinc-900 placeholder:text-zinc-400 shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isPending && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 h-14 px-6 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-2xl transition-all font-bold text-sm text-zinc-500 hover:text-zinc-900 shadow-sm active:scale-95"
          >
            <X className="w-4 h-4" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Quick Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 mr-2 text-zinc-400">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Filter By</span>
        </div>

        {/* Status Filter */}
        <div className="relative flex-1 min-w-[140px] max-w-[200px]">
          <select
            className="w-full pl-4 pr-10 h-10 bg-white border border-zinc-200 rounded-xl outline-none transition-all font-bold text-xs appearance-none cursor-pointer hover:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
            onChange={(e) => handleFilterChange("status", e.target.value)}
            value={searchParams.get("status") || "all"}
          >
            <option value="all">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 pointer-events-none" />
        </div>

        {/* Priority Filter */}
        <div className="relative flex-1 min-w-[140px] max-w-[200px]">
          <select
            className="w-full pl-4 pr-10 h-10 bg-white border border-zinc-200 rounded-xl outline-none transition-all font-bold text-xs appearance-none cursor-pointer hover:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            value={searchParams.get("priority") || "all"}
          >
            <option value="all">Priority: All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 pointer-events-none" />
        </div>

        {/* Date Filter */}
        <div className="relative flex-1 min-w-[160px] max-w-[200px] group">
          <input
            type="date"
            className="w-full pl-4 pr-10 h-10 bg-white border border-zinc-200 rounded-xl outline-none transition-all font-bold text-xs appearance-none cursor-pointer hover:border-zinc-400 focus:ring-4 focus:ring-zinc-100 text-zinc-900"
            onChange={(e) => handleFilterChange("dueDate", e.target.value)}
            value={searchParams.get("dueDate") || ""}
          />
          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
