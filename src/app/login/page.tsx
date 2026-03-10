import LoginForm from "@/components/LoginForm";
import { LayoutDashboard } from "lucide-react";

export const metadata = {
  title: "Sign In | TaskFlow",
  description: "Sign in to access your dashboard",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-primary to-purple-600 opacity-20 blur-xl animate-pulse-subtle"></div>
        <div className="relative glass-morphism rounded-2xl p-8 shadow-2xl premium-card border-white/10">
          <div className="flex flex-col space-y-2 text-center mb-8">
            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 ring-1 ring-primary/20 text-primary">
              <LayoutDashboard size={40} className="animate-float" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage your tasks efficiently
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
