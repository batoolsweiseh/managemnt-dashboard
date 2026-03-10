"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions";
import { Loader2, ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    login,
    undefined
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <Mail className="h-4 w-4" />
          </div>
          <label
            htmlFor="email"
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            Email Address
          </label>
        </div>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="batool@gmail.com"
          required
          autoComplete="email"
          className="flex h-11 w-full rounded-xl border border-input bg-card/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all border-border/50 focus:border-primary/50"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <Lock className="h-4 w-4" />
          </div>
          <label
            htmlFor="password"
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            Password
          </label>
        </div>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="password123"
          required
          autoComplete="current-password"
          className="flex h-11 w-full rounded-xl border border-input bg-card/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all border-border/50 focus:border-primary/50"
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
            Sign In <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </button>

      {errorMessage && (
        <div className="flex h-8 items-end space-x-1">
          <p className="text-sm text-destructive">{errorMessage}</p>
        </div>
      )}

      <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border text-xs text-muted-foreground">
        <strong>Demo Credentials:</strong><br />
        Email: batool@gmail.com<br />
        Password: password123
      </div>
    </form>
  );
}
