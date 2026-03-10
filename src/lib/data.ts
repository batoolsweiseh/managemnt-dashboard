export type TaskStatus = 'completed' | 'pending' | 'overdue';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
}

// Mock tasks data
export const tasks: Task[] = [
  { id: '1', title: 'Design landing page', status: 'completed', dueDate: '2026-03-01' },
  { id: '2', title: 'Implement Auth system', status: 'completed', dueDate: '2026-03-05' },
  { id: '3', title: 'Create dashboard UI', status: 'pending', dueDate: '2026-03-12' },
  { id: '4', title: 'Database schema design', status: 'pending', dueDate: '2026-03-14' },
  { id: '5', title: 'Setup CI/CD pipeline', status: 'overdue', dueDate: '2026-03-08' },
  { id: '6', title: 'Write API documentation', status: 'pending', dueDate: '2026-03-15' },
  { id: '7', title: 'Fix bug in user profile', status: 'completed', dueDate: '2026-03-09' },
  { id: '8', title: 'Client presentation', status: 'overdue', dueDate: '2026-03-07' },
];

export async function getDashboardStats() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const overdue = tasks.filter(t => t.status === 'overdue').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, pending, overdue, completionRate };
}

export async function getRecentTasks() {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return tasks.slice(0, 5);
}
