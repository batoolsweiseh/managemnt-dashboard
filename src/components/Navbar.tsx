"use client";

import { logout } from "@/lib/actions";
import { LogOut, LayoutDashboard, User } from "lucide-react";
import type { Session } from "next-auth";

export default function Navbar({ session }: { session: Session | null }) {
  if (!session?.user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <div className="flex gap-2 items-center font-bold text-xl tracking-tight text-primary">
          <LayoutDashboard className="h-6 w-6" />
          <span>TaskFlow</span>
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
