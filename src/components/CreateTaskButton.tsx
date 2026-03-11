"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import TaskFormDialog from "./TaskFormDialog";

export default function CreateTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-black ring-offset-background transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/40 h-16 px-8 group tracking-tight"
      >
        <Plus className="mr-3 h-6 w-6 transition-transform group-hover:rotate-90" />
        <span className="text-lg">Initialize Mission</span>
      </button>

      {isOpen && (
        <TaskFormDialog onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
