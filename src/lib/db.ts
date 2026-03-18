import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

try {
  // Initialize tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'User',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      priority TEXT NOT NULL DEFAULT 'Medium',
      dueDate TEXT NOT NULL,
      assignedUserId TEXT,
      assignedUser TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (assignedUserId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      userName TEXT NOT NULL,
      action TEXT NOT NULL,
      targetId TEXT NOT NULL,
      targetTitle TEXT NOT NULL,
      taskId TEXT,
      details TEXT,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
    );
  `);
  console.log("Database initialized successfully.");
} catch (error) {
  console.error("Database initialization failed:", error);
}

// Seed initial users if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)');
  insertUser.run('1', 'Admin User', 'admin@gmail.com', 'password123', 'Admin');
  insertUser.run('2', 'Batool Sweiseh', 'batool@gmail.com', 'password123', 'User');

  // Seed some tasks
  const insertTask = db.prepare('INSERT INTO tasks (id, title, description, status, priority, dueDate, assignedUserId, assignedUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  insertTask.run('t1', 'Global Infrastructure Audit', 'Comprehensive review of node security protocols.', 'In Progress', 'High', today, '1', 'Admin User');
  insertTask.run('t2', 'Alpha Strike Parameter Sync', 'Coordinate landing parameters for the Alpha squad.', 'Completed', 'Medium', today, '1', 'Admin User');
  insertTask.run('t3', 'Daily Objective Sync', 'Regular check-in on mission status and registry.', 'Pending', 'Low', today, '2', 'Batool Sweiseh');
  insertTask.run('t4', 'Parameter Calibration', 'Adjust sensors for the next mission phase.', 'In Progress', 'Medium', today, '2', 'Batool Sweiseh');

  // Seed initial activity logs
  const insertLog = db.prepare('INSERT INTO activity_logs (id, userId, userName, action, targetId, targetTitle, taskId, details, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  insertLog.run('l1', '1', 'Admin User', 'CREATED', 't1', 'Global Infrastructure Audit', 't1', 'Created task "Global Infrastructure Audit"', yesterday);
  insertLog.run('l2', '1', 'Admin User', 'CREATED', 't2', 'Alpha Strike Parameter Sync', 't2', 'Created task "Alpha Strike Parameter Sync"', yesterday);
  insertLog.run('l3', '2', 'Batool Sweiseh', 'STATUS_CHANGE', 't2', 'Alpha Strike Parameter Sync', 't2', 'Changed status to Completed', today);
  insertLog.run('l4', '2', 'Batool Sweiseh', 'CREATED', 't3', 'Daily Objective Sync', 't3', 'Created task "Daily Objective Sync"', today);
}

export default db;
