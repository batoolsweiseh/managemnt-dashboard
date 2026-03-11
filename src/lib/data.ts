export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedUser: string;
}

// Mock tasks data
export let tasks: Task[] = [
  { 
    id: '1', 
    title: 'Design landing page', 
    description: 'Create a high-fidelity design for the new landing page with premium aesthetics.',
    status: 'Completed', 
    priority: 'High',
    dueDate: '2026-03-01',
    assignedUser: 'John Doe'
  },
  { 
    id: '2', 
    title: 'Implement Auth system', 
    description: 'Setup NextAuth with credentials provider and middleware protection.',
    status: 'Completed', 
    priority: 'High',
    dueDate: '2026-03-05',
    assignedUser: 'Jane Smith'
  },
  { 
    id: '3', 
    title: 'Create dashboard UI', 
    description: 'Build the main dashboard layout with stats cards and charts.',
    status: 'In Progress', 
    priority: 'Medium',
    dueDate: '2026-03-12',
    assignedUser: 'John Doe'
  },
  { 
    id: '4', 
    title: 'Database schema design', 
    description: 'Define Prisma schema for tasks, users, and projects.',
    status: 'Pending', 
    priority: 'Medium',
    dueDate: '2026-03-14',
    assignedUser: 'Jane Smith'
  },
  { 
    id: '5', 
    title: 'Setup CI/CD pipeline', 
    description: 'Configure GitHub Actions for automated testing and deployment.',
    status: 'Pending', 
    priority: 'Low',
    dueDate: '2026-03-08',
    assignedUser: 'Bob Wilson'
  },
  { 
    id: '6', 
    title: 'Write API documentation', 
    description: 'Document all REST endpoints using Swagger/OpenAPI.',
    status: 'Pending', 
    priority: 'Low',
    dueDate: '2026-03-15',
    assignedUser: 'Alice Green'
  },
  { 
    id: '7', 
    title: 'Fix bug in user profile', 
    description: 'Resolve the issue where profile pictures are not uploading correctly.',
    status: 'Completed', 
    priority: 'Medium',
    dueDate: '2026-03-09',
    assignedUser: 'Bob Wilson'
  },
  { 
    id: '8', 
    title: 'Client presentation', 
    description: 'Prepare and deliver the sprint demo to the client.',
    status: 'Pending', 
    priority: 'High',
    dueDate: '2026-03-07',
    assignedUser: 'Jane Smith'
  },
];

export async function getDashboardStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  
  // Define overdue as not completed and due date passed
  const today = new Date().toISOString().split('T')[0];
  const overdue = tasks.filter(t => t.status !== 'Completed' && t.dueDate < today).length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, inProgress, pending, overdue, completionRate };
}

export async function getRecentTasks() {
  return [...tasks].reverse().slice(0, 5);
}

export async function getTasks(query?: string, status?: string, priority?: string, dueDate?: string) {
  let filteredTasks = [...tasks];

  if (query) {
    filteredTasks = filteredTasks.filter(t => 
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (status && status !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.status === status);
  }

  if (priority && priority !== 'all') {
    filteredTasks = filteredTasks.filter(t => t.priority === priority);
  }

  if (dueDate) {
    filteredTasks = filteredTasks.filter(t => t.dueDate === dueDate);
  }

  return filteredTasks;
}
