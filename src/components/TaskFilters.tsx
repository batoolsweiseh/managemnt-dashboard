"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, Calendar } from "lucide-react";
import { useTransition, useEffect, useState } from "react";

export default function TaskFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("query")?.toString() || "");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    
    const timeout = setTimeout(() => {
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, pathname, replace, searchParams]);

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setQuery("");
    startTransition(() => {
      replace(pathname);
    });
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          placeholder="Search missions by title or description..."
          className="w-full pl-12 pr-4 h-14 bg-secondary/50 border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-2xl outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/60 placeholder:font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isPending && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none" />
          <select
            className="pl-10 pr-8 h-12 bg-secondary/80 hover:bg-white border-2 border-transparent hover:border-primary/20 rounded-xl outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
            onChange={(e) => handleFilterChange("status", e.target.value)}
            value={searchParams.get("status") || "all"}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none" />
          <select
            className="pl-10 pr-8 h-12 bg-secondary/80 hover:bg-white border-2 border-transparent hover:border-primary/20 rounded-xl outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            value={searchParams.get("priority") || "all"}
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <div className="relative group min-w-[150px]">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none" />
          <input
            type="date"
            className="w-full pl-10 pr-4 h-12 bg-secondary/80 hover:bg-white border-2 border-transparent hover:border-primary/20 rounded-xl outline-none transition-all font-bold text-sm appearance-none cursor-pointer text-muted-foreground focus:text-foreground"
            onChange={(e) => handleFilterChange("dueDate", e.target.value)}
            value={searchParams.get("dueDate") || ""}
          />
        </div>

        <button
          onClick={clearFilters}
          className="flex items-center justify-center gap-2 h-12 px-6 bg-secondary/50 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all font-bold text-sm text-muted-foreground"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
