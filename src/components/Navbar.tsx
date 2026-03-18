"use client";

import { logout } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { LogOut, LayoutDashboard, User, ListTodo, ChevronDown, Settings, Shield, History as HistoryIcon } from "lucide-react";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  const role = (session.user as any)?.role;
  const displayName = session.user.name || "Special Operative";

  const userInitials = displayName 
    ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : session.user.email?.substring(0, 2).toUpperCase() || "OP";

  return (
    <nav className="sticky top-0 z-[60] w-full border-b border-zinc-100 bg-white/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-20 items-center px-4 md:px-8">
        {/* Logo Section */}
        <Link href="/" className="flex gap-2.5 items-center mr-12 group">
          <div className="relative">
            <div className={cn(
              "absolute inset-0 blur-lg rounded-full transition-all duration-500",
              "bg-primary/20",
              "group-hover:bg-primary/30"
            )} />
            <div className="relative bg-zinc-900 p-2 rounded-xl text-white shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <LayoutDashboard className="h-6 w-6" />
            </div>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className={cn("font-black text-xl tracking-tighter transition-colors text-primary", "group-hover:text-zinc-900")}>TASKFLOW</span>
            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-400">OS V5.0</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-50 p-1.5 rounded-2xl border border-zinc-100">
          <Link 
            href="/" 
            className={`px-6 py-2 rounded-xl text-sm font-black tracking-tight transition-all duration-300 ${
              pathname === '/' 
                ? 'bg-white text-zinc-900 shadow-sm shadow-zinc-200' 
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Overview
          </Link>
          <Link 
            href="/tasks" 
            className={`px-6 py-2 rounded-xl text-sm font-black tracking-tight transition-all duration-300 flex items-center gap-2 ${
              pathname === '/tasks' 
                ? 'bg-white text-zinc-900 shadow-sm shadow-zinc-200' 
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            Missions
          </Link>
          {(session.user as any)?.role === 'Admin' && (
            <Link 
              href="/activity" 
              className={`px-6 py-2 rounded-xl text-sm font-black tracking-tight transition-all duration-300 flex items-center gap-2 ${
                pathname === '/activity' 
                  ? 'bg-white text-zinc-900 shadow-sm shadow-zinc-200' 
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <HistoryIcon className="w-4 h-4" />
              Logs
            </Link>
          )}
        </div>

        {/* User Profile Section */}
        <div className="ml-auto relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all duration-300 border ${
              isOpen 
                ? 'bg-zinc-950 border-zinc-900 text-white shadow-2xl' 
                : 'bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-md'
            }`}
          >
            <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center font-black text-sm transition-all duration-500 ${
              isOpen ? `bg-primary text-primary-foreground scale-90` : 'bg-zinc-100 text-zinc-600'
            }`}>
              {userInitials}
            </div>
            <div className="flex flex-col items-start -space-y-0.5 text-left">
              <span className={`text-[11px] font-black uppercase tracking-widest ${isOpen ? 'text-zinc-400' : 'text-zinc-400'}`}>Agent Profile</span>
              <span className="text-sm font-bold truncate max-w-[120px]">{displayName}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isOpen ? `rotate-180 text-primary` : 'text-zinc-400'}`} />
          </button>

          {/* Premium Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-[2rem] border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 origin-top-right">
              {/* Profile Header */}
              <div className="p-6 bg-zinc-50/50 border-b border-zinc-100">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg",
                    `bg-linear-to-tr from-primary to-primary/80`,
                    "shadow-primary/20"
                  )}>
                    {userInitials}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded-full border border-green-100 w-fit mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active Status</span>
                    </div>
                    <span className="font-black text-zinc-900 truncate max-w-[140px]">{displayName}</span>
                    <span className="text-xs font-medium text-zinc-400 truncate max-w-[140px]">{session.user.email}</span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-3 bg-white">
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all font-bold text-sm group">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center group-hover:bg-white transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    Account Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all font-bold text-sm group">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center group-hover:bg-white transition-colors">
                      <Shield className="w-4 h-4" />
                    </div>
                    Security Protocol
                  </button>
                </div>

                <div className="my-3 mx-2 h-px bg-zinc-100"></div>

                <button
                  onClick={() => logout()}
                  className="w-full flex items-center justify-between px-4 py-4 rounded-[1.25rem] bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-200 group-hover:scale-110 transition-transform duration-300">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="font-black text-sm">Terminate Session</span>
                      <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-0.5">Logout Securely</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-zinc-50/50 text-center">
                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Secure Node 01-A</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
