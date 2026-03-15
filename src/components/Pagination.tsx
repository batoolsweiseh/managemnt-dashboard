"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Hash } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
      <div className="flex items-center bg-zinc-50/50 backdrop-blur-md border border-zinc-100 rounded-2xl p-1.5 shadow-sm">
        {/* Previous Button */}
        <Link
          href={createPageURL(currentPage - 1)}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
            currentPage <= 1 
              ? "pointer-events-none text-zinc-300" 
              : "text-zinc-600 hover:bg-white hover:text-zinc-900 hover:shadow-sm"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 px-1">
          {getVisiblePages().map((page, index) => (
            typeof page === "number" ? (
              <Link
                key={index}
                href={createPageURL(page)}
                className={`flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  currentPage === page
                    ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200 scale-105"
                    : "text-zinc-500 hover:bg-white hover:text-zinc-900"
                }`}
              >
                {page}
              </Link>
            ) : (
              <span key={index} className="px-2 text-zinc-300 font-bold">
                {page}
              </span>
            )
          ))}
        </div>

        {/* Next Button */}
        <Link
          href={createPageURL(currentPage + 1)}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
            currentPage >= totalPages 
              ? "pointer-events-none text-zinc-300" 
              : "text-zinc-600 hover:bg-white hover:text-zinc-900 hover:shadow-sm"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-50/50 backdrop-blur-md border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400">
        <Hash className="w-3 h-3" />
        <span>Page {currentPage} of {totalPages}</span>
      </div>
    </div>
  );
}
