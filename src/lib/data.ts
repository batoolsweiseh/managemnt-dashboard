import { Task, TaskStatus, TaskPriority, User, ActivityLog, Notification } from './types';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { dbAll, dbGet, dbRun, ensurePostgresSchema } from './db-adapter';

export * from './types';

// Ensure Postgres schema on Vercel (no-op locally)
const initPromise = ensurePostgresSchema();

async function ready() {
  await initPromise;
}

// ─── Helper: map camelCase column names coming from Postgres ──────────────────
function mapTask(row: any): Task {
  if (!row) return row;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as TaskStatus,
    priority: row.priority as TaskPriority,
    dueDate: row.dueDate ?? row.duedate,
    assignedUserId: row.assignedUserId ?? row.assigneduserid,
    assignedUser: row.assignedUser ?? row.assigneduser,
  };
}

function mapLog(row: any): ActivityLog {
  if (!row) return row;
  return {
    id: row.id,
    userId: row.userId ?? row.userid,
    userName: row.userName ?? row.username,
    action: row.action,
    targetId: row.targetId ?? row.targetid,
    targetTitle: row.targetTitle ?? row.targettitle,
    taskId: row.taskId ?? row.taskid,
    details: row.details,
    timestamp: row.timestamp,
  };
}

function mapNotification(row: any): Notification {
  if (!row) return row;
  return {
    id: row.id,
    userId: row.userId ?? row.userid,
    title: row.title,
    message: row.message,
    type: row.type,
    read: Number(row.read),
    createdAt: row.createdAt ?? row.createdat,
  };
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = cache(async (userId?: string, role?: string) => {
  return await unstable_cache(
    async () => {
      await ready();
      try {
        const isAdmin = role === 'Admin';

        const baseWhere = !isAdmin && userId ? `WHERE "assignedUserId" = '${userId}'` : '';
        const andOrWhere = baseWhere ? 'AND' : 'WHERE';

        const totalRow = await dbGet(`SELECT COUNT(*) as count FROM tasks ${baseWhere}`);
        const total = Number(totalRow?.count ?? 0);

        const completedRow = await dbGet(`SELECT COUNT(*) as count FROM tasks ${baseWhere} ${andOrWhere} status = ?`, ['Completed']);
        const completed = Number(completedRow?.count ?? 0);

        const inProgressRow = await dbGet(`SELECT COUNT(*) as count FROM tasks ${baseWhere} ${andOrWhere} status = ?`, ['In Progress']);
        const inProgress = Number(inProgressRow?.count ?? 0);

        const pendingRow = await dbGet(`SELECT COUNT(*) as count FROM tasks ${baseWhere} ${andOrWhere} status = ?`, ['Pending']);
        const pending = Number(pendingRow?.count ?? 0);

        const today = new Date().toISOString().split('T')[0];
        const overdueRow = await dbGet(
          `SELECT COUNT(*) as count FROM tasks ${baseWhere} ${andOrWhere} status != ? AND "dueDate" < ?`,
          ['Completed', today]
        );
        const overdue = Number(overdueRow?.count ?? 0);

        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString();

        const recentRow = await dbGet(
          `SELECT COUNT(*) as count FROM tasks WHERE "createdAt" >= ? ${!isAdmin && userId ? 'AND "assignedUserId" = ?' : ''}`,
          !isAdmin && userId ? [sevenDaysAgo, userId] : [sevenDaysAgo]
        );
        const recentTasksCount = Number(recentRow?.count ?? 0);

        const prevRow = await dbGet(
          `SELECT COUNT(*) as count FROM tasks WHERE "createdAt" < ? AND "createdAt" >= ? ${!isAdmin && userId ? 'AND "assignedUserId" = ?' : ''}`,
          !isAdmin && userId ? [sevenDaysAgo, fourteenDaysAgo, userId] : [sevenDaysAgo, fourteenDaysAgo]
        );
        const previousTasksCount = Number(prevRow?.count ?? 0);

        const rawTrend = previousTasksCount === 0
          ? (recentTasksCount > 0 ? 100 : 0)
          : Math.round(((recentTasksCount - previousTasksCount) / previousTasksCount) * 100);
        const totalTrend = rawTrend >= 0 ? `+${rawTrend}%` : `${rawTrend}%`;

        const priorities = ['High', 'Medium', 'Low'];
        const priorityDistribution = await Promise.all(priorities.map(async (p) => {
          const r = await dbGet(
            `SELECT COUNT(*) as count FROM tasks ${baseWhere} ${andOrWhere} priority = ?`,
            [p]
          );
          return { name: p, value: Number(r?.count ?? 0) };
        }));

        return { total, completed, inProgress, pending, overdue, completionRate, totalTrend, priorityDistribution };
      } catch (error) {
        console.error('Database error in getDashboardStats:', error);
        throw new Error('Failed to fetch dashboard statistics.');
      }
    },
    [`dashboard-stats-${userId}-${role}`],
    { tags: ['dashboard', 'tasks'], revalidate: 3600 }
  )();
});

// ─── Recent Tasks ─────────────────────────────────────────────────────────────
export const getRecentTasks = cache(async (userId?: string, role?: string) => {
  return await unstable_cache(
    async () => {
      await ready();
      try {
        const isAdmin = role === 'Admin';
        let sql = 'SELECT * FROM tasks';
        const params: any[] = [];
        if (!isAdmin && userId) { sql += ' WHERE "assignedUserId" = ?'; params.push(userId); }
        sql += ' ORDER BY id DESC LIMIT 5';
        const rows = await dbAll(sql, params);
        return rows.map(mapTask);
      } catch (error) {
        console.error('Database error in getRecentTasks:', error);
        throw new Error('Failed to fetch recent tasks.');
      }
    },
    [`recent-tasks-${userId}-${role}`],
    { tags: ['tasks'], revalidate: 3600 }
  )();
});

// ─── Tasks List (paginated) ───────────────────────────────────────────────────
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
      await ready();
      try {
        let sql = 'SELECT * FROM tasks WHERE 1=1';
        let countSql = 'SELECT COUNT(*) as count FROM tasks WHERE 1=1';
        const params: any[] = [];

        if (userId) {
          sql += ' AND "assignedUserId" = ?'; countSql += ' AND "assignedUserId" = ?'; params.push(userId);
        }
        if (query) {
          const q = `%${query}%`;
          sql += ' AND (title LIKE ? OR description LIKE ?)';
          countSql += ' AND (title LIKE ? OR description LIKE ?)';
          params.push(q, q);
        }
        if (status && status !== 'all') { sql += ' AND status = ?'; countSql += ' AND status = ?'; params.push(status); }
        if (priority && priority !== 'all') { sql += ' AND priority = ?'; countSql += ' AND priority = ?'; params.push(priority); }
        if (dueDate) { sql += ' AND "dueDate" = ?'; countSql += ' AND "dueDate" = ?'; params.push(dueDate); }

        const totalRow = await dbGet(countSql, params);
        const total = Number(totalRow?.count ?? 0);
        const totalPages = Math.ceil(total / limit);
        const offset = (page - 1) * limit;

        sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        const rows = await dbAll(sql, [...params, limit, offset]);
        return { tasks: rows.map(mapTask), total, page, limit, totalPages };
      } catch (error) {
        console.error('Database error in getTasks:', error);
        throw new Error('Failed to fetch tasks.');
      }
    },
    [`tasks-list-${query}-${status}-${priority}-${dueDate}-${page}-${limit}-${userId}`],
    { tags: ['tasks'], revalidate: 3600 }
  )();
});

// ─── CRUD ─────────────────────────────────────────────────────────────────────
export async function createTask(taskData: Omit<Task, 'id'>) {
  await ready();
  try {
    const id = Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    await dbRun(
      'INSERT INTO tasks (id, title, description, status, priority, "dueDate", "assignedUserId", "assignedUser", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, taskData.title, taskData.description, taskData.status, taskData.priority, taskData.dueDate, taskData.assignedUserId ?? null, taskData.assignedUser ?? null, now, now]
    );
    return mapTask({ id, ...taskData });
  } catch (error) {
    console.error('Database error in createTask:', error);
    throw error;
  }
}

export async function updateTask(id: string, taskData: Partial<Task>) {
  await ready();
  try {
    const fields = Object.keys(taskData).filter(k => k !== 'id');
    if (fields.length === 0) return getTask(id);

    // Quote column names for Postgres compatibility
    const quotedFields = fields.map(f => `"${f}"`);
    const sets = quotedFields.map(f => `${f} = ?`).join(', ') + ', "updatedAt" = ?';
    const values = fields.map(f => (taskData as any)[f]);

    await dbRun(`UPDATE tasks SET ${sets} WHERE id = ?`, [...values, new Date().toISOString(), id]);
    const row = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);
    return mapTask(row);
  } catch (error) {
    console.error('Database error in updateTask:', error);
    throw error;
  }
}

export async function deleteTask(id: string) {
  await ready();
  try {
    await dbRun('DELETE FROM tasks WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Database error in deleteTask:', error);
    throw error;
  }
}

export const getTask = cache(async (id: string) => {
  return await unstable_cache(
    async () => {
      await ready();
      try {
        const row = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);
        return mapTask(row);
      } catch (error) {
        console.error('Database error in getTask:', error);
        throw new Error('Failed to fetch task details.');
      }
    },
    [`task-${id}`],
    { tags: [`task-${id}`, 'tasks'], revalidate: 3600 }
  )();
});

// ─── Users ────────────────────────────────────────────────────────────────────
export const getAllUsers = cache(async () => {
  return await unstable_cache(
    async () => {
      await ready();
      try {
        return await dbAll('SELECT id, name, email, role FROM users') as User[];
      } catch (error) {
        console.error('Database error in getAllUsers:', error);
        throw new Error('Failed to fetch users list.');
      }
    },
    ['all-users'],
    { tags: ['users'], revalidate: 3600 }
  )();
});

export async function getUserByEmail(email: string, password: string) {
  await ready();
  const row = await dbGet('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
  return row ?? null;
}

export async function getUserById(id: string) {
  await ready();
  const row = await dbGet('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
  return row ?? null;
}

export async function createUser(id: string, name: string, email: string, password: string, role: string) {
  await ready();
  await dbRun('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)', [id, name, email, password, role]);
}

export async function findUserByEmail(email: string) {
  await ready();
  return await dbGet('SELECT * FROM users WHERE email = ?', [email]);
}

export async function findUserByName(name: string): Promise<{ id: string } | null> {
  await ready();
  return await dbGet('SELECT id FROM users WHERE name = ?', [name]);
}

export const getAdminIds = cache(async () => {
  return await unstable_cache(
    async () => {
      await ready();
      try {
        return await dbAll("SELECT id FROM users WHERE role = 'Admin'") as { id: string }[];
      } catch (error) {
        console.error('Database error in getAdminIds:', error);
        return [];
      }
    },
    ['admin-ids'],
    { tags: ['users'], revalidate: 3600 }
  )();
});

// ─── Activity Logs ────────────────────────────────────────────────────────────
export async function addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>) {
  await ready();
  try {
    const id = Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    await dbRun(
      'INSERT INTO activity_logs (id, "userId", "userName", action, "targetId", "targetTitle", "taskId", details, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, log.userId, log.userName, log.action, log.targetId, log.targetTitle, log.taskId ?? null, log.details, now]
    );
    return { id, ...log, timestamp: now };
  } catch (error) {
    console.error('Database error in addActivityLog:', error);
    return { id: 'failed', ...log, timestamp: new Date().toISOString() };
  }
}

export const getActivityLogs = cache(async (taskId?: string) => {
  return await unstable_cache(
    async () => {
      await ready();
      try {
        let sql = 'SELECT * FROM activity_logs';
        const params: any[] = [];
        if (taskId) { sql += ' WHERE "targetId" = ? ORDER BY timestamp DESC'; params.push(taskId); }
        const rows = await dbAll(sql, params);
        return rows.map(mapLog);
      } catch (error) {
        console.error('Database error in getActivityLogs:', error);
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
      await ready();
      try {
        let sql = 'SELECT * FROM activity_logs';
        const params: any[] = [];
        if (role !== 'Admin' && userId) { sql += ' WHERE "userId" = ?'; params.push(userId); }
        sql += ' ORDER BY timestamp DESC LIMIT ?';
        const rows = await dbAll(sql, [...params, limit]);
        return rows.map(mapLog);
      } catch (error) {
        console.error('Database error in getRecentActivity:', error);
        return [];
      }
    },
    [`recent-activity-${limit}-${userId}-${role}`],
    { tags: ['logs'], revalidate: 3600 }
  )();
});

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = cache(async (userId: string) => {
  return await unstable_cache(
    async () => {
      await ready();
      try {
        const rows = await dbAll('SELECT * FROM notifications WHERE "userId" = ? ORDER BY "createdAt" DESC', [userId]);
        return rows.map(mapNotification);
      } catch (error) {
        console.error('Database error in getNotifications:', error);
        return [];
      }
    },
    [`notifications-${userId}`],
    { tags: [`notifications-${userId}`], revalidate: 3600 }
  )();
});

export async function createNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
  await ready();
  try {
    const id = Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    await dbRun(
      'INSERT INTO notifications (id, "userId", title, message, type, "createdAt") VALUES (?, ?, ?, ?, ?, ?)',
      [id, notification.userId, notification.title, notification.message, notification.type, now]
    );
    return { id, ...notification, read: 0, createdAt: now };
  } catch (error) {
    console.error('Database error in createNotification:', error);
    return null;
  }
}

export async function markNotificationRead(id: string) {
  await ready();
  try {
    await dbRun('UPDATE notifications SET read = 1 WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error('Database error in markNotificationRead:', error);
    return { success: false };
  }
}

export async function markAllRead(userId: string) {
  await ready();
  try {
    await dbRun('UPDATE notifications SET read = 1 WHERE "userId" = ?', [userId]);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
