import SignupForm from "@/components/SignupForm";
import { Command } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[480px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl border border-zinc-100 shadow-sm mb-4">
            <Command className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 leading-tight">
            Create <span className="text-primary italic">Account</span>
          </h1>
          <p className="text-zinc-500 font-medium">
            Join the operational nexus and manage mission parameters.
          </p>
        </div>

        <div className="premium-card p-10 bg-white/80 backdrop-blur-xl">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
