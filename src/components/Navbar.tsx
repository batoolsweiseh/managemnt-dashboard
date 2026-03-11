"use client";

import { logout } from "@/lib/actions";
import { LogOut, LayoutDashboard, User, ListTodo } from "lucide-react";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ session }: { session: Session | null }) {
  const pathname = usePathname();

  if (!session?.user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex gap-2 items-center font-bold text-xl tracking-tight text-primary mr-8 transition-transform hover:scale-105 active:scale-95">
          <LayoutDashboard className="h-6 w-6" />
          <span>TaskFlow</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-bold transition-colors hover:text-primary flex items-center gap-2 ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Overview
          </Link>
          <Link 
            href="/tasks" 
            className={`text-sm font-bold transition-colors hover:text-primary flex items-center gap-2 ${pathname === '/tasks' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <ListTodo className="w-4 h-4" />
            Missions
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm font-medium">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline-block">{session.user.name || session.user.email}</span>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline-block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
