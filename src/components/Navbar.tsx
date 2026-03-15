"use client";

import { useState, useRef, useEffect } from "react";
import { logout } from "@/lib/actions";
import { LogOut, LayoutDashboard, User, ListTodo } from "lucide-react";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md border-zinc-100">
      <div className="max-w-7xl mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex gap-2 items-center font-black text-2xl tracking-tighter text-zinc-900 mr-10 transition-all hover:opacity-80 active:scale-95">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-linear-to-r from-zinc-900 to-zinc-500">TaskFlow</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link 
            href="/" 
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-zinc-50 ${pathname === '/' ? 'text-zinc-900 bg-zinc-50' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            Overview
          </Link>
          <Link 
            href="/tasks" 
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-zinc-50 flex items-center gap-2 ${pathname === '/tasks' ? 'text-zinc-900 bg-zinc-50' : 'text-zinc-500 hover:text-zinc-900'}`}
          >
            <ListTodo className="w-4 h-4" />
            Missions
          </Link>
        </div>

        <div className="ml-auto relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-2xl border transition-all active:scale-95 ${
              isMenuOpen 
              ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' 
              : 'bg-zinc-50 border-zinc-100 text-zinc-900 hover:border-zinc-200 shadow-xs'
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isMenuOpen ? 'bg-white/20' : 'bg-zinc-900'}`}>
              <User className={`h-4 w-4 ${isMenuOpen ? 'text-white' : 'text-white'}`} />
            </div>
            <span className="text-xs font-black tracking-tight hidden sm:block">
              {(session.user.name || session.user.email || 'Agent').split('@')[0].toUpperCase()}
            </span>
          </button>

          {/* Premium Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 p-2 bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-zinc-100 animate-in fade-in zoom-in-95 duration-200 ease-out z-[60]">
              <div className="px-4 py-3 mb-2 bg-zinc-50/50 rounded-xl">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Authenticated As</p>
                <p className="text-sm font-bold text-zinc-900 truncate">{session.user.email}</p>
              </div>
              
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all group active:scale-95"
              >
                <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <LogOut className="h-4 w-4" />
                </div>
                Terminates Session
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
