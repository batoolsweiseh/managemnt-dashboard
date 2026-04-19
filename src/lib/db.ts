import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/vercel-postgres';
import { sql as vercelPgSql } from '@vercel/postgres';
import { count } from 'drizzle-orm';
import Database from 'better-sqlite3';
import path from 'path';
import * as schema from './schema';

const isPostgres = !!process.env.POSTGRES_URL;

let db: any;

if (isPostgres) {
  // Use Vercel Postgres in Production
  db = drizzlePg(vercelPgSql, { schema });
  console.log("Using Vercel Postgres.");
  
  // Automate Postgres table creation if they don't exist
  const initPostgres = async () => {
    try {
      await vercelPgSql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'User',
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;
      await vercelPgSql`
        CREATE TABLE IF NOT EXISTS tasks (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL DEFAULT 'Pending',
          priority TEXT NOT NULL DEFAULT 'Medium',
          "dueDate" TEXT NOT NULL,
          "assignedUserId" TEXT REFERENCES users(id),
          "assignedUser" TEXT,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;
      await vercelPgSql`
        CREATE TABLE IF NOT EXISTS activity_logs (
          id TEXT PRIMARY KEY,
          "userId" TEXT NOT NULL REFERENCES users(id),
          "userName" TEXT NOT NULL,
          action TEXT NOT NULL,
          "targetId" TEXT NOT NULL,
          "targetTitle" TEXT NOT NULL,
          "taskId" TEXT REFERENCES tasks(id) ON DELETE CASCADE,
          details TEXT,
          timestamp TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;
      await vercelPgSql`
        CREATE TABLE IF NOT EXISTS notifications (
          id TEXT PRIMARY KEY,
          "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          type TEXT NOT NULL,
          read INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `;
      
      // Seed production if empty
      const userCount = await db.select({ count: count() }).from(schema.users);
      if (userCount[0].count === 0) {
        console.log("Seeding Vercel Postgres because it's empty...");
        const today = new Date().toISOString().split('T')[0];
        await db.insert(schema.users).values({
          id: '1',
          name: 'Admin User',
          email: 'admin@gmail.com',
          password: 'password123',
          role: 'Admin'
        });
        await db.insert(schema.tasks).values({
          id: 't1',
          title: 'Global Infrastructure Audit',
          description: 'Initial production task.',
          status: 'In Progress',
          priority: 'High',
          dueDate: today,
          assignedUserId: '1',
          assignedUser: 'Admin User'
        });
      }
    } catch (e) {
      console.error("Postgres initialization/seeding failed:", e);
    }
  };
  initPostgres();
} else {
  // Use Better SQLite3 in Development
  const dbPath = path.resolve(process.cwd(), 'database.sqlite');
  const sqlite = new Database(dbPath);
  
  // Basic SQLite table creation logic (for local development)
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'User',
      createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
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
      createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      updatedAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
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
      timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Ensure taskId exists in activity_logs (fix for user's previous error)
    PRAGMA table_info(activity_logs);
  `);

  // Ensure taskId exists (robust check)
  try { sqlite.exec("ALTER TABLE activity_logs ADD COLUMN taskId TEXT;"); } catch(e) {}

  db = drizzleSqlite(sqlite, { schema });
  
  console.log("Using local SQLite with Drizzle.");
}

export default db;
