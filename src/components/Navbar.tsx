"use client";

import { logout } from "@/lib/actions";
import { LogOut, LayoutDashboard, User, ListTodo, ChevronDown, Settings, Shield, Zap } from "lucide-react";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const userInitials = session.user.name 
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : session.user.email?.substring(0, 2).toUpperCase() || "OP";

  return (
    <nav className="sticky top-0 z-[60] w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto flex h-24 items-center px-6 md:px-12">
        {/* Logo Section - Vibrant */}
        <Link href="/" className="flex gap-4 items-center mr-16 group">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-600/40 blur-2xl rounded-full group-hover:bg-violet-500/60 transition-all duration-700"></div>
            <div className="relative bg-linear-to-br from-violet-600 to-indigo-700 p-2.5 rounded-2xl text-white shadow-2xl shadow-violet-500/20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
              <LayoutDashboard className="h-7 w-7" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter text-white group-hover:text-violet-400 transition-colors">TASKFLOW</span>
            <span className="text-[10px] font-black tracking-[0.4em] text-violet-500/80">ULTRA NEON</span>
          </div>
        </Link>

        {/* Navigation Links - Dark Neumorphic */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 shadow-inner">
          <Link 
            href="/" 
            className={`px-8 py-2.5 rounded-xl text-xs font-black tracking-[0.2em] uppercase transition-all duration-500 ${
              pathname === '/' 
                ? 'bg-violet-600 text-white shadow-xl shadow-violet-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Overview
          </Link>
          <Link 
            href="/tasks" 
            className={`px-8 py-2.5 rounded-xl text-xs font-black tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-3 ${
              pathname === '/tasks' 
                ? 'bg-violet-600 text-white shadow-xl shadow-violet-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-4 h-4" />
            Registry
          </Link>
        </div>

        {/* User Profile - Vibrant Dropdown */}
        <div className="ml-auto relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-4 p-2 pr-5 rounded-2xl transition-all duration-500 border ${
              isOpen 
                ? 'bg-white text-slate-950 border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-500 ${
              isOpen ? 'bg-violet-600 text-white' : 'bg-linear-to-br from-violet-500 to-indigo-600 text-white'
            } shadow-lg`}>
              {userInitials}
            </div>
            <div className="flex flex-col items-start -space-y-0.5 text-left hidden sm:flex">
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isOpen ? 'text-slate-500' : 'text-slate-500'}`}>Authenticated</span>
              <span className="text-sm font-black truncate max-w-[140px]">{session.user.name || "Specialist"}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isOpen ? 'rotate-180' : 'text-slate-500'}`} />
          </button>

          {/* Premium Dark Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-4 w-80 bg-slate-900 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500 origin-top-right">
              <div className="p-8 bg-linear-to-br from-white/5 to-transparent border-b border-white/5">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-linear-to-tr from-violet-500 via-indigo-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-primary/40 ring-4 ring-white/5">
                    {userInitials}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 w-fit mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Operational</span>
                    </div>
                    <span className="font-black text-lg text-white truncate max-w-[160px]">{session.user.name || "Operative"}</span>
                    <span className="text-xs font-bold text-slate-500 truncate max-w-[160px]">{session.user.email}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-bold text-sm group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  Profile Core
                </button>
                <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all font-bold text-sm group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  Security Log
                </button>

                <div className="my-4 mx-4 h-px bg-white/5"></div>

                <button
                  onClick={() => logout()}
                  className="w-full flex items-center justify-between px-5 py-5 rounded-[1.75rem] bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all duration-500 group shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-2xl shadow-rose-500/40 group-hover:bg-white group-hover:text-rose-500 transition-all duration-500">
                      <LogOut className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-black text-sm uppercase tracking-wider">Terminate</span>
                      <span className="text-[9px] font-black opacity-60 uppercase tracking-[0.2em] mt-1">End Session</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
