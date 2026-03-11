"use client";

import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import TaskFormDialog from "./TaskFormDialog";

export default function CreateTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative inline-flex items-center justify-center whitespace-nowrap rounded-[1.25rem] text-sm font-black transition-all hover:scale-105 active:scale-95 bg-zinc-900 text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] h-14 px-8 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10 transition-transform duration-500 group-hover:translate-x-0.5">
          <div className="relative">
            <Plus className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-primary animate-pulse group-hover:scale-125 transition-transform" />
          </div>
          <span className="text-sm uppercase tracking-widest font-black">Begin Strategy</span>
        </div>
      </button>

      {isOpen && (
        <TaskFormDialog onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
