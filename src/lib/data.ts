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

// Use global state to persist tasks during development and prevent resets on hot-reload
declare global {
  var _tasks: Task[] | undefined;
}

const initialTasks: Task[] = [
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
  { 
    id: '9', 
    title: 'Security audit', 
    description: 'Review the codebase for any potential security vulnerabilities.',
    status: 'Pending', 
    priority: 'High',
    dueDate: '2026-03-20',
    assignedUser: 'John Doe'
  },
  { 
    id: '10', 
    title: 'Optimize images', 
    description: 'Compress and optimize all static images for better performance.',
    status: 'Completed', 
    priority: 'Low',
    dueDate: '2026-03-10',
    assignedUser: 'Bob Wilson'
  },
  { 
    id: '11', 
    title: 'Mobile responsiveness', 
    description: 'Ensure the dashboard is fully responsive on mobile devices.',
    status: 'In Progress', 
    priority: 'Medium',
    dueDate: '2026-03-18',
    assignedUser: 'Alice Green'
  },
  { 
    id: '12', 
    title: 'Add dark mode', 
    description: 'Implement dark mode toggle and styles.',
    status: 'Pending', 
    priority: 'Medium',
    dueDate: '2026-03-25',
    assignedUser: 'John Doe'
  }
];

if (!globalThis._tasks) {
  globalThis._tasks = [...initialTasks];
}

export const tasks = globalThis._tasks;

export async function getDashboardStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  
  // Define overdue as not completed and due date passed
  const today = new Date().toISOString().split('T')[0];
  const overdue = tasks.filter(t => t.status !== 'Completed' && t.dueDate < today).length;
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Calculate priority distribution
  const priorityDistribution = [
    { name: 'High', value: tasks.filter(t => t.priority === 'High').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length },
    { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length },
  ];

  return { 
    total, 
    completed, 
    inProgress, 
    pending, 
    overdue, 
    completionRate,
    priorityDistribution
  };
}

export async function getRecentTasks() {
  return [...tasks].reverse().slice(0, 5);
}

export async function getTask(id: string) {
  const task = tasks.find(t => t.id === id);
  if (!task) {
    throw new Error('Task not found');
  }
  return task;
}

export async function getTasks(
  query?: string, 
  status?: string, 
  priority?: string, 
  dueDate?: string,
  page: number = 1,
  limit: number = 10
) {
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

  // Sort by newest first (assuming higher ID or simply the order they were pushed)
  // Reversing the array since new items are pushed to the end
  filteredTasks.reverse();

  const total = filteredTasks.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + limit);

  return {
    tasks: paginatedTasks,
    total,
    page,
    limit,
    totalPages
  };
}

export async function createTask(taskData: Omit<Task, 'id'>) {
  const newTask: Task = {
    id: Math.random().toString(36).substring(2, 9),
    ...taskData
  };
  tasks.push(newTask);
  return newTask;
}

export async function updateTask(id: string, taskData: Partial<Task>) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Task not found');
  }
  
  tasks[index] = {
    ...tasks[index],
    ...taskData,
    id // Ensure ID cannot be changed
  };
  
  return tasks[index];
}

export async function deleteTask(id: string) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Task not found');
  }
  
  tasks.splice(index, 1);
  return { success: true };
}
