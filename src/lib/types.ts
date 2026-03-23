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

export type NotificationType = 'ASSIGNMENT' | 'STATUS_UPDATE';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: number; // 0 or 1
  createdAt: string;
}
