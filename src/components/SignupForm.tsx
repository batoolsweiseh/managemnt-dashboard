"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/actions";
import { Loader2, ArrowRight, Mail, Lock, User, ShieldCheck, UserCircle } from "lucide-react";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState<'Admin' | 'User'>('User');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, formAction, isPending] = useActionState(
    signup,
    undefined
  );

  useEffect(() => {
    document.documentElement.dataset.role = role;
    return () => {
      delete document.documentElement.dataset.role;
    };
  }, [role]);

  useEffect(() => {
    if (submitted && !isPending && !errorMessage) {
      router.push('/');
    }
  }, [submitted, isPending, errorMessage, router]);

  return (
    <form action={formAction} onSubmit={() => setSubmitted(true)} className="space-y-6">
      {/* Premium Role Selection Section */}
      <div className="space-y-3 mb-8">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
          Define Operational Authority
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole('User')}
            className={`relative overflow-hidden group p-5 flex flex-col items-center gap-3 rounded-[2rem] border-2 transition-all duration-500 ${
              role === 'User' 
                ? 'bg-primary/5 border-primary shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)]' 
                : 'bg-zinc-50/50 border-zinc-100 hover:border-zinc-300 hover:bg-white'
            }`}
          >
            <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              role === 'User' ? 'bg-primary text-white scale-110 rotate-3' : 'bg-zinc-100 text-zinc-400 group-hover:scale-105'
            }`}>
              <UserCircle className="w-6 h-6" />
            </div>
            <div className="relative z-10 text-center space-y-0.5">
              <span className={`block font-black text-xs uppercase tracking-widest transition-colors duration-500 ${
                role === 'User' ? 'text-primary' : 'text-zinc-500'
              }`}>
                User
              </span>
              <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
                Standard Clearance
              </span>
            </div>
            {role === 'User' && (
              <div className="absolute top-3 right-3 animate-in zoom-in duration-300">
                <div className="bg-primary text-white p-1 rounded-full shadow-lg shadow-primary/20">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              </div>
            )}
            <div className={`absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${role === 'User' ? 'opacity-100' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setRole('Admin')}
            className={`relative overflow-hidden group p-5 flex flex-col items-center gap-3 rounded-[2rem] border-2 transition-all duration-500 ${
              role === 'Admin' 
                ? 'bg-zinc-900 border-zinc-900 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]' 
                : 'bg-zinc-50/50 border-zinc-100 hover:border-zinc-300 hover:bg-white'
            }`}
          >
            <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              role === 'Admin' ? 'bg-primary text-white scale-110 -rotate-3' : 'bg-zinc-100 text-zinc-400 group-hover:scale-105'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="relative z-10 text-center space-y-0.5">
              <span className={`block font-black text-xs uppercase tracking-widest transition-colors duration-500 ${
                role === 'Admin' ? 'text-white' : 'text-zinc-500'
              }`}>
                Admin
              </span>
              <span className={`block text-[9px] font-bold uppercase tracking-tighter transition-colors duration-500 ${
                role === 'Admin' ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
                Full Override
              </span>
            </div>
            {role === 'Admin' && (
              <div className="absolute top-3 right-3 animate-in zoom-in duration-300">
                <div className="bg-primary text-white p-1 rounded-full shadow-lg shadow-primary/20">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              </div>
            )}
            <div className={`absolute inset-0 bg-linear-to-tr from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${role === 'Admin' ? 'opacity-100' : ''}`} />
          </button>
        </div>
      </div>

      <input type="hidden" name="role" value={role} />

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <User className="h-4 w-4" />
          </div>
          <label htmlFor="name" className="text-sm font-semibold tracking-tight text-foreground">
            Full Name
          </label>
        </div>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="John Doe"
          required
          className="flex h-11 w-full rounded-xl border border-input bg-card/50 px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all border-border/50 focus:border-primary/50"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <Mail className="h-4 w-4" />
          </div>
          <label htmlFor="email" className="text-sm font-semibold tracking-tight text-foreground">
            Email Address
          </label>
        </div>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="admin@gmail.com"
          required
          autoComplete="email"
          className="flex h-11 w-full rounded-xl border border-input bg-card/50 px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all border-border/50 focus:border-primary/50"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <Lock className="h-4 w-4" />
          </div>
          <label htmlFor="password" className="text-sm font-semibold tracking-tight text-foreground">
            Password
          </label>
        </div>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          className="flex h-11 w-full rounded-xl border border-input bg-card/50 px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all border-border/50 focus:border-primary/50"
        />
      </div>

      <button
        type="submit"
        aria-disabled={isPending}
        disabled={isPending}
        className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 h-10 px-4 py-2 mt-6 group"
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <span className="flex items-center">
            Initialize Access <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </button>

      {errorMessage && (
        <div className="flex h-8 items-end space-x-1">
          <p className="text-sm text-destructive">{errorMessage}</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-primary transition-colors uppercase tracking-widest">
          Already have access? <span className="text-primary italic">Sign In</span>
        </Link>
      </div>
    </form>
  );
}
