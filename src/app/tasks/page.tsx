import { Suspense } from "react";
import { getTasks, getAllUsers } from "@/lib/data";
import TaskList from "@/components/TaskList";
import TaskFilters from "@/components/TaskFilters";
import { Plus, ListTodo, Sliders } from "lucide-react";
import CreateTaskButton from "@/components/CreateTaskButton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Pagination from "@/components/Pagination";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    page?: string;
  }>;
}

export default async function TasksPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const userRole = (session.user as any).role;
  const userId = session.user.id;

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const [{ tasks, total, totalPages }, users] = await Promise.all([
    getTasks(
      params.query, 
      params.status, 
      params.priority, 
      params.dueDate,
      currentPage,
      10,
      userRole === 'Admin' ? undefined : userId
    ),
    getAllUsers(),
  ]);

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 animate-in slide-in-from-left duration-700">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start text-primary">
            <ListTodo className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Central Registry</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">Mission Control</h1>
          <p className="text-zinc-500 font-medium italic">Execute and manage operational tasks with precision</p>
        </div>
        <CreateTaskButton users={users} userRole={userRole} />
      </div>

      {/* Filter & Search Dashboard - Premium Background */}
      <div className="bg-zinc-50/50 backdrop-blur-xl border border-zinc-100 rounded-[2.5rem] p-8 lg:p-10 shadow-sm relative overflow-hidden group hover:border-zinc-200 transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-200/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:scale-150 transition-transform duration-1000"></div>
        <TaskFilters />
        
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-zinc-100">
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
            <div className={`w-2 h-2 rounded-full ${total > 0 ? 'bg-green-500 animate-pulse' : 'bg-zinc-300'}`} />
            <span>{total} {total === 1 ? 'OBJECTIVE' : 'OBJECTIVES'} IDENTIFIED</span>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="animate-in fade-in duration-1000 delay-200">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Synchronizing...</span>
          </div>
        }>
          <TaskList 
            tasks={tasks} 
            userRole={userRole} 
            users={users} 
            currentUserId={userId} 
          />
        </Suspense>

        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
