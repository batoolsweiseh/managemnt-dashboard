import db from './db';
import { Task, TaskStatus, TaskPriority, User, ActivityLog, Notification } from './types';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { eq, and, or, like, desc, sql, count, lt, gte, ne } from 'drizzle-orm';
import * as schema from './schema';

export * from './types';

// Helper to handle dates consistently
const formatDate = (date: any) => {
  if (date instanceof Date) return date.toISOString();
  return date;
};

export const getDashboardStats = cache(async (userId?: string, role?: string) => {
  return await unstable_cache(
    async () => {
      try {
        const filters: any[] = [];
        if (role !== 'Admin' && userId) {
          filters.push(eq(schema.tasks.assignedUserId, userId));
        }

        const totalResult = await db.select({ count: count() }).from(schema.tasks).where(and(...filters));
        const total = totalResult[0].count;

        const completedResult = await db.select({ count: count() }).from(schema.tasks).where(and(...filters, eq(schema.tasks.status, 'Completed')));
        const completed = completedResult[0].count;

        const inProgressResult = await db.select({ count: count() }).from(schema.tasks).where(and(...filters, eq(schema.tasks.status, 'In Progress')));
        const inProgress = inProgressResult[0].count;

        const pendingResult = await db.select({ count: count() }).from(schema.tasks).where(and(...filters, eq(schema.tasks.status, 'Pending')));
        const pending = pendingResult[0].count;

        const today = new Date().toISOString().split('T')[0];
        const overdueResult = await db.select({ count: count() }).from(schema.tasks).where(and(...filters, ne(schema.tasks.status, 'Completed'), lt(schema.tasks.dueDate, today)));
        const overdue = overdueResult[0].count;

        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Trends
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString();
        
        const recentTasksResult = await db.select({ count: count() }).from(schema.tasks).where(and(...filters, gte(schema.tasks.createdAt, sevenDaysAgo)));
        const recentTasksCount = recentTasksResult[0].count;

        const previousTasksResult = await db.select({ count: count() }).from(schema.tasks).where(and(...filters, lt(schema.tasks.createdAt, sevenDaysAgo), gte(schema.tasks.createdAt, fourteenDaysAgo)));
        const previousTasksCount = previousTasksResult[0].count;
        
        const rawTrend = previousTasksCount === 0 ? (recentTasksCount > 0 ? 100 : 0) : Math.round(((recentTasksCount - previousTasksCount) / previousTasksCount) * 100);
        const totalTrend = rawTrend >= 0 ? `+${rawTrend}%` : `${rawTrend}%`;

        const priorities: TaskPriority[] = ['High', 'Medium', 'Low'];
        const priorityDistribution = await Promise.all(priorities.map(async (p) => {
          const res = await db.select({ count: count() }).from(schema.tasks).where(and(...filters, eq(schema.tasks.priority, p)));
          return { name: p, value: res[0].count };
        }));

        return { total, completed, inProgress, pending, overdue, completionRate, totalTrend, priorityDistribution };
      } catch (error) {
        console.error("Database error in getDashboardStats:", error);
        throw new Error("Failed to fetch dashboard statistics.");
      }
    },
    [`dashboard-stats-${userId}-${role}`],
    { tags: ['dashboard', 'tasks'], revalidate: 3600 }
  )();
});

export const getRecentTasks = cache(async (userId?: string, role?: string) => {
  return await unstable_cache(
    async () => {
      try {
        const filters: any[] = [];
        if (role !== 'Admin' && userId) {
          filters.push(eq(schema.tasks.assignedUserId, userId));
        }

        const data = await db.select().from(schema.tasks)
          .where(and(...filters))
          .orderBy(desc(schema.tasks.id))
          .limit(5);
          
        return data as Task[];
      } catch (error) {
        console.error("Database error in getRecentTasks:", error);
        throw new Error("Failed to fetch recent tasks.");
      }
    },
    [`recent-tasks-${userId}-${role}`],
    { tags: ['tasks'], revalidate: 3600 }
  )();
});

export const getTasks = cache(async (
  query?: string, 
  status?: string, 
  priority?: string, 
  dueDate?: string,
  page: number = 1,
  limit: number = 10,
  userId?: string
) => {
  return await unstable_cache(
    async () => {
      try {
        const filters: any[] = [];
        if (userId) filters.push(eq(schema.tasks.assignedUserId, userId));
        if (query) filters.push(or(like(schema.tasks.title, `%${query}%`), like(schema.tasks.description, `%${query}%`)));
        if (status && status !== 'all') filters.push(eq(schema.tasks.status, status as TaskStatus));
        if (priority && priority !== 'all') filters.push(eq(schema.tasks.priority, priority as TaskPriority));
        if (dueDate) filters.push(eq(schema.tasks.dueDate, dueDate));

        const totalResult = await db.select({ count: count() }).from(schema.tasks).where(and(...filters));
        const total = totalResult[0].count;
        const totalPages = Math.ceil(total / limit);
        const offset = (page - 1) * limit;

        const tasks = await db.select().from(schema.tasks)
          .where(and(...filters))
          .orderBy(desc(schema.tasks.id))
          .limit(limit)
          .offset(offset);

        return { tasks: tasks as Task[], total, page, limit, totalPages };
      } catch (error) {
        console.error("Database error in getTasks:", error);
        throw new Error("Failed to fetch tasks.");
      }
    },
    [`tasks-list-${query}-${status}-${priority}-${dueDate}-${page}-${limit}-${userId}`],
    { tags: ['tasks'], revalidate: 3600 }
  )();
});

export async function createTask(taskData: Omit<Task, 'id'>) {
  try {
    const id = Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    await db.insert(schema.tasks).values({
      id,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      assignedUserId: taskData.assignedUserId,
      assignedUser: taskData.assignedUser,
      createdAt: now,
      updatedAt: now,
    });
    return { id, ...taskData };
  } catch (error) {
    console.error("Database error in createTask:", error);
    throw error;
  }
}

export async function updateTask(id: string, taskData: Partial<Task>) {
  try {
    const now = new Date().toISOString();
    await db.update(schema.tasks)
      .set({ ...taskData, updatedAt: now })
      .where(eq(schema.tasks.id, id));
    
    const result = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id));
    return result[0] as Task;
  } catch (error) {
    console.error("Database error in updateTask:", error);
    throw error;
  }
}

export async function deleteTask(id: string) {
  try {
    await db.delete(schema.tasks).where(eq(schema.tasks.id, id));
    return { success: true };
  } catch (error) {
    console.error("Database error in deleteTask:", error);
    throw error;
  }
}

export const getTask = cache(async (id: string) => {
  return await unstable_cache(
    async () => {
      try {
        const result = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id));
        return result[0] as Task;
      } catch (error) {
        console.error("Database error in getTask:", error);
        throw new Error("Failed to fetch task details.");
      }
    },
    [`task-${id}`],
    { tags: [`task-${id}`, 'tasks'], revalidate: 3600 }
  )();
});

export const getAllUsers = cache(async () => {
  return await unstable_cache(
    async () => {
      try {
        const res = await db.select({
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
          role: schema.users.role,
        }).from(schema.users);
        return res as User[];
      } catch (error) {
        console.error("Database error in getAllUsers:", error);
        throw new Error("Failed to fetch users list.");
      }
    },
    ['all-users'],
    { tags: ['users'], revalidate: 3600 }
  )();
});

export async function addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>) {
  try {
    const id = Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    await db.insert(schema.activityLogs).values({
      id,
      userId: log.userId,
      userName: log.userName,
      action: log.action,
      targetId: log.targetId,
      targetTitle: log.targetTitle,
      taskId: log.taskId || null,
      details: log.details,
      timestamp: now,
    });
    return { id, ...log, timestamp: now };
  } catch (error) {
    console.error("Database error in addActivityLog:", error);
    return { id: 'failed', ...log, timestamp: new Date().toISOString() };
  }
}

export const getActivityLogs = cache(async (taskId?: string) => {
  return await unstable_cache(
    async () => {
      try {
        if (taskId) {
          const res = await db.select().from(schema.activityLogs)
            .where(eq(schema.activityLogs.targetId, taskId))
            .orderBy(desc(schema.activityLogs.timestamp));
          return res as ActivityLog[];
        }
        const res = await db.select().from(schema.activityLogs).orderBy(desc(schema.activityLogs.timestamp));
        return res as ActivityLog[];
      } catch (error) {
        console.error("Database error in getActivityLogs:", error);
        return [];
      }
    },
    [`activity-logs-${taskId}`],
    { tags: ['logs', taskId ? `logs-${taskId}` : 'all-logs'], revalidate: 3600 }
  )();
});

export const getRecentActivity = cache(async (limit: number = 5, userId?: string, role?: string) => {
  return await unstable_cache(
    async () => {
      try {
        const filters = [];
        if (role !== 'Admin' && userId) {
          filters.push(eq(schema.activityLogs.userId, userId));
        }

        const res = await db.select().from(schema.activityLogs)
          .where(and(...filters))
          .orderBy(desc(schema.activityLogs.timestamp))
          .limit(limit);
        return res as ActivityLog[];
      } catch (error) {
        console.error("Database error in getRecentActivity:", error);
        return [];
      }
    },
    [`recent-activity-${limit}-${userId}-${role}`],
    { tags: ['logs'], revalidate: 3600 }
  )();
});

export const getNotifications = cache(async (userId: string) => {
  try {
    const res = await db.select().from(schema.notifications)
      .where(eq(schema.notifications.userId, userId))
      .orderBy(desc(schema.notifications.createdAt));
    return res as unknown as Notification[];
  } catch (error) {
    console.error("Database error in getNotifications:", error);
    return [];
  }
});

export async function createNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
  try {
    const id = Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    await db.insert(schema.notifications).values({
      id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: 0,
      createdAt: now,
    });
    return { id, ...notification, read: 0, createdAt: now };
  } catch (error) {
    console.error("Database error in createNotification:", error);
    return null;
  }
}

export async function markNotificationRead(id: string) {
  try {
    await db.update(schema.notifications)
      .set({ read: 1 })
      .where(eq(schema.notifications.id, id));
    return { success: true };
  } catch (error) {
    console.error("Database error in markNotificationRead:", error);
    return { success: false };
  }
}

export async function markAllRead(userId: string) {
  try {
    await db.update(schema.notifications)
      .set({ read: 1 })
      .where(eq(schema.notifications.userId, userId));
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export const getAdminIds = cache(async () => {
  try {
    const res = await db.select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.role, 'Admin'));
    return res as { id: string }[];
  } catch (error) {
    console.error("Database error in getAdminIds:", error);
    return [];
  }
});
