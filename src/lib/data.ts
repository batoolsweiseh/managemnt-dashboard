import db from './db';
import { Task, TaskStatus, TaskPriority, User, ActivityLog } from './types';

export * from './types';

export async function getDashboardStats(userId?: string, role?: string) {
  try {
    let queryBase = 'FROM tasks';
    const params: any[] = [];

    if (role !== 'Admin' && userId) {
      queryBase += ' WHERE assignedUserId = ?';
      params.push(userId);
    }

    const total = (db.prepare(`SELECT COUNT(*) as count ${queryBase}`).get(...params) as any).count;
    
    const completedParams = [...params, 'Completed'];
    const completed = (db.prepare(`SELECT COUNT(*) as count ${queryBase} ${params.length > 0 ? 'AND' : 'WHERE'} status = ?`).get(...completedParams) as any).count;
    
    const inProgressParams = [...params, 'In Progress'];
    const inProgress = (db.prepare(`SELECT COUNT(*) as count ${queryBase} ${params.length > 0 ? 'AND' : 'WHERE'} status = ?`).get(...inProgressParams) as any).count;
    
    const pendingParams = [...params, 'Pending'];
    const pending = (db.prepare(`SELECT COUNT(*) as count ${queryBase} ${params.length > 0 ? 'AND' : 'WHERE'} status = ?`).get(...pendingParams) as any).count;

    const today = new Date().toISOString().split('T')[0];
    const overdueParams = [...params, 'Completed', today];
    const overdue = (db.prepare(`SELECT COUNT(*) as count ${queryBase} ${params.length > 0 ? 'AND' : 'WHERE'} status != ? AND dueDate < ?`).get(...overdueParams) as any).count;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Real Trends Calculation (Last 7 days vs previous 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString();
    
    const recentTasksCount = (db.prepare(`SELECT COUNT(*) as count FROM tasks WHERE createdAt >= ? ${role !== 'Admin' ? 'AND assignedUserId = ?' : ''}`).get(...(role !== 'Admin' ? [sevenDaysAgo, userId] : [sevenDaysAgo])) as any).count;
    const previousTasksCount = (db.prepare(`SELECT COUNT(*) as count FROM tasks WHERE createdAt < ? AND createdAt >= ? ${role !== 'Admin' ? 'AND assignedUserId = ?' : ''}`).get(...(role !== 'Admin' ? [sevenDaysAgo, fourteenDaysAgo, userId] : [sevenDaysAgo, fourteenDaysAgo])) as any).count;
    
    const rawTrend = previousTasksCount === 0 ? (recentTasksCount > 0 ? 100 : 0) : Math.round(((recentTasksCount - previousTasksCount) / previousTasksCount) * 100);
    const totalTrend = rawTrend >= 0 ? `+${rawTrend}%` : `${rawTrend}%`;

    const priorities = ['High', 'Medium', 'Low'];
    const priorityDistribution = priorities.map(p => {
      const pParams = [...params, p];
      const val = (db.prepare(`SELECT COUNT(*) as count ${queryBase} ${params.length > 0 ? 'AND' : 'WHERE'} priority = ?`).get(...pParams) as any).count;
      return { name: p, value: val };
    });

    return { total, completed, inProgress, pending, overdue, completionRate, totalTrend, priorityDistribution };
  } catch (error) {
    console.error("Database error in getDashboardStats:", error);
    throw new Error("Failed to fetch dashboard statistics from database.");
  }
}

export async function getRecentTasks(userId?: string, role?: string) {
  try {
    let query = 'SELECT * FROM tasks';
    const params: any[] = [];

    if (role !== 'Admin' && userId) {
      query += ' WHERE assignedUserId = ?';
      params.push(userId);
    }

    query += ' ORDER BY id DESC LIMIT 5';
    return db.prepare(query).all(...params) as Task[];
  } catch (error) {
    console.error("Database error in getRecentTasks:", error);
    throw new Error("Failed to fetch recent tasks from database.");
  }
}

export async function getTasks(
  query?: string, 
  status?: string, 
  priority?: string, 
  dueDate?: string,
  page: number = 1,
  limit: number = 10,
  userId?: string
) {
  try {
    let sql = 'SELECT * FROM tasks WHERE 1=1';
    let countSql = 'SELECT COUNT(*) as count FROM tasks WHERE 1=1';
    const params: any[] = [];

    if (userId) {
      sql += ' AND assignedUserId = ?';
      countSql += ' AND assignedUserId = ?';
      params.push(userId);
    }

    if (query) {
      const q = `%${query}%`;
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      countSql += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(q, q);
    }

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      countSql += ' AND status = ?';
      params.push(status);
    }

    if (priority && priority !== 'all') {
      sql += ' AND priority = ?';
      countSql += ' AND priority = ?';
      params.push(priority);
    }

    if (dueDate) {
      sql += ' AND dueDate = ?';
      countSql += ' AND dueDate = ?';
      params.push(dueDate);
    }

    const total = (db.prepare(countSql).get(...params) as any).count;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    const tasks = db.prepare(sql).all(...params, limit, offset) as Task[];

    return { tasks, total, page, limit, totalPages };
  } catch (error) {
    console.error("Database error in getTasks:", error);
    throw new Error("Failed to fetch tasks from database.");
  }
}

export async function createTask(taskData: Omit<Task, 'id'>) {
  try {
    const id = Math.random().toString(36).substring(2, 9);
    const stmt = db.prepare('INSERT INTO tasks (id, title, description, status, priority, dueDate, assignedUserId, assignedUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, taskData.title, taskData.description, taskData.status, taskData.priority, taskData.dueDate, taskData.assignedUserId, taskData.assignedUser);
    return { id, ...taskData };
  } catch (error) {
    console.error("Database error in createTask:", error);
    throw error; // Let the action handle specific UI messages
  }
}

export async function updateTask(id: string, taskData: Partial<Task>) {
  try {
    const fields = Object.keys(taskData).filter(k => k !== 'id');
    if (fields.length === 0) return await getTask(id);

    const sets = fields.map(f => `${f} = ?`).join(', ') + ', updatedAt = datetime(\'now\')';
    const values = fields.map(f => (taskData as any)[f]);

    const stmt = db.prepare(`UPDATE tasks SET ${sets} WHERE id = ?`);
    stmt.run(...values, id);
    
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task;
  } catch (error) {
    console.error("Database error in updateTask:", error);
    throw error;
  }
}

export async function deleteTask(id: string) {
  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return { success: true };
  } catch (error) {
    console.error("Database error in deleteTask:", error);
    throw error;
  }
}

export async function getTask(id: string) {
  try {
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task;
  } catch (error) {
    console.error("Database error in getTask:", error);
    throw new Error("Failed to fetch task details.");
  }
}

export async function getAllUsers() {
  try {
    return db.prepare('SELECT id, name, email, role FROM users').all() as User[];
  } catch (error) {
    console.error("Database error in getAllUsers:", error);
    throw new Error("Failed to fetch users list.");
  }
}

export async function addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>) {
  try {
    const id = Math.random().toString(36).substring(2, 9);
    const stmt = db.prepare('INSERT INTO activity_logs (id, userId, userName, action, targetId, targetTitle, taskId, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, log.userId, log.userName, log.action, log.targetId, log.targetTitle, log.taskId || null, log.details);
    return { id, ...log, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error("Database error in addActivityLog:", error);
    // Non-critical failure, don't crash the whole process for a log
    return { id: 'failed', ...log, timestamp: new Date().toISOString() };
  }
}

export async function getActivityLogs(taskId?: string) {
  try {
    let query = 'SELECT * FROM activity_logs';
    if (taskId) {
      query += ' WHERE targetId = ? ORDER BY timestamp DESC';
      return db.prepare(query).all(taskId) as ActivityLog[];
    }
    return db.prepare(query).all() as ActivityLog[];
  } catch (error) {
    console.error("Database error in getActivityLogs:", error);
    return [];
  }
}

export async function getRecentActivity(limit: number = 5, userId?: string, role?: string) {
  try {
    let query = 'SELECT * FROM activity_logs';
    const params: any[] = [];

    if (role !== 'Admin' && userId) {
      query += ' WHERE userId = ?';
      params.push(userId);
    }

    query += ' ORDER BY timestamp DESC LIMIT ?';
    return db.prepare(query).all(...params, limit) as ActivityLog[];
  } catch (error) {
    console.error("Database error in getRecentActivity:", error);
    return [];
  }
}
