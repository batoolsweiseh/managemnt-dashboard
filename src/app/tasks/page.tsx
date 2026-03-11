import { Suspense } from "react";
import { getTasks } from "@/lib/data";
import TaskList from "@/components/TaskList";
import TaskFilters from "@/components/TaskFilters";
import { Plus } from "lucide-react";
import CreateTaskButton from "@/components/CreateTaskButton";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
  }>;
}

export default async function TasksPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tasks = await getTasks(params.query, params.status, params.priority, params.dueDate);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl">Mission Control</h1>
          <p className="text-muted-foreground mt-2 font-medium italic">Manage and execute your key objectives</p>
        </div>
        <CreateTaskButton />
      </div>

      <div className="premium-card p-6 bg-white/50 backdrop-blur-sm border-white/20">
        <TaskFilters />
      </div>

      <Suspense fallback={<div className="h-96 flex items-center justify-center animate-pulse text-muted-foreground font-bold italic">Scanning frequencies...</div>}>
        <TaskList tasks={tasks} />
      </Suspense>
    </div>
  );
}
