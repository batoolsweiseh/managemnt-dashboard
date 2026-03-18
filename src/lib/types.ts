export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedUserId?: string | null;
  assignedUser?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'STATUS_CHANGE' | 'SIGNUP' | 'LOGIN';
  targetId: string;
  targetTitle: string;
  taskId?: string;
  timestamp: string;
  details: string;
}
