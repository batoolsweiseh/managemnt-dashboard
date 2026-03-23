import { Flag } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8 space-y-12 animate-pulse">
      {/* Search and Filters Section */}
      <div className="w-full h-24 bg-zinc-50 rounded-[2rem] border border-zinc-100 flex items-center justify-between px-8">
        <div className="w-1/3 h-10 bg-zinc-100 rounded-xl" />
        <div className="w-1/4 h-10 bg-zinc-100 rounded-xl" />
      </div>

      <div className="space-y-6">
        {/* Registry Headers */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-zinc-100 rounded" />
          <div className="w-40 h-6 bg-zinc-100 rounded-xl" />
        </div>

        {/* List Items */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-zinc-50 rounded-3xl border border-zinc-100" />
          ))}
        </div>
      </div>

       <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
         <div className="w-16 h-16 bg-white rounded-3xl shadow-xl border border-zinc-100 flex items-center justify-center">
            <Flag className="w-8 h-8 text-primary animate-spin" />
         </div>
      </div>
    </div>
  );
}
