/**
 * Universal Database Adapter
 * - Locally:   uses better-sqlite3 (synchronous SQLite)
 * - On Vercel: uses @neondatabase/serverless (Neon Postgres)
 *
 * Detection: if DATABASE_URL or POSTGRES_URL env var is present → Postgres mode.
 * ALL public functions are async and return the same shapes regardless of the backend.
 */

const IS_VERCEL = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);

/* ──────────────────────────────────────────────
   POSTGRES helpers (Neon)
────────────────────────────────────────────── */

function getNeonClient() {
  const { neon } = require('@neondatabase/serverless');
  const connString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connString) throw new Error('No Postgres connection string found.');
  return neon(connString) as (sql: string, params?: any[]) => Promise<any[]>;
}

async function pgAll(sql: string, params: any[] = []): Promise<any[]> {
  const client = getNeonClient();
  // Replace ? placeholders with $1, $2, …
  let i = 0;
  const converted = sql.replace(/\?/g, () => `$${++i}`);
  return client(converted, params);
}

async function pgGet(sql: string, params: any[] = []): Promise<any> {
  const rows = await pgAll(sql, params);
  return rows[0] ?? null;
}

async function pgRun(sql: string, params: any[] = []): Promise<void> {
  await pgAll(sql, params);
}

/* ──────────────────────────────────────────────
   PUBLIC API (same interface for both backends)
────────────────────────────────────────────── */

export async function dbAll(sql: string, params: any[] = []): Promise<any[]> {
  if (IS_VERCEL) return pgAll(sql, params);
  const { default: db } = await import('./db');
  return db.prepare(sql).all(...params) as any[];
}

export async function dbGet(sql: string, params: any[] = []): Promise<any> {
  if (IS_VERCEL) return pgGet(sql, params);
  const { default: db } = await import('./db');
  return db.prepare(sql).get(...params);
}

export async function dbRun(sql: string, params: any[] = []): Promise<void> {
  if (IS_VERCEL) { await pgRun(sql, params); return; }
  const { default: db } = await import('./db');
  db.prepare(sql).run(...params);
}

/* ──────────────────────────────────────────────
   POSTGRES SCHEMA INIT (runs once on cold start)
────────────────────────────────────────────── */

let pgInitialized = false;

export async function ensurePostgresSchema() {
  if (!IS_VERCEL || pgInitialized) return;
  pgInitialized = true;

  const run = (sql: string, params: any[] = []) => pgRun(sql, params);

  // Users
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'User',
      "createdAt" TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    )
  `);

  // Tasks
  await run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      priority TEXT NOT NULL DEFAULT 'Medium',
      "dueDate" TEXT NOT NULL,
      "assignedUserId" TEXT,
      "assignedUser" TEXT,
      "createdAt" TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      "updatedAt" TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    )
  `);

  // Activity Logs
  await run(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "userName" TEXT NOT NULL,
      action TEXT NOT NULL,
      "targetId" TEXT NOT NULL,
      "targetTitle" TEXT NOT NULL,
      "taskId" TEXT,
      details TEXT,
      timestamp TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    )
  `);

  // Notifications
  await run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      "createdAt" TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    )
  `);

  // Seed only if users table is empty
  const countRow = await pgGet('SELECT COUNT(*)::int as count FROM users');
  const count = Number(countRow?.count ?? 0);

  if (count === 0) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    await run(`
      INSERT INTO users (id, name, email, password, role) VALUES
        ('1', 'Admin User',     'admin@gmail.com',  'password123', 'Admin'),
        ('2', 'Batool Sweiseh', 'batool@gmail.com', 'password123', 'User')
      ON CONFLICT (id) DO NOTHING
    `);

    await run(`
      INSERT INTO tasks (id, title, description, status, priority, "dueDate", "assignedUserId", "assignedUser", "createdAt", "updatedAt") VALUES
        ('t1', 'Global Infrastructure Audit', 'Comprehensive review of node security protocols.', 'In Progress', 'High',   $1, '1', 'Admin User',     $2, $2),
        ('t2', 'Alpha Strike Parameter Sync',  'Coordinate landing parameters for Alpha squad.',  'Completed',   'Medium', $1, '1', 'Admin User',     $2, $2),
        ('t3', 'Daily Objective Sync',         'Regular check-in on mission status.',             'Pending',     'Low',    $1, '2', 'Batool Sweiseh', $3, $3),
        ('t4', 'Parameter Calibration',        'Adjust sensors for the next mission phase.',      'In Progress', 'Medium', $1, '2', 'Batool Sweiseh', $3, $3)
      ON CONFLICT (id) DO NOTHING
    `.replace(/\$1/g, `'${today}'`).replace(/\$2/g, `'${yesterday}'`).replace(/\$3/g, `'${today}'`));

    await run(`
      INSERT INTO activity_logs (id, "userId", "userName", action, "targetId", "targetTitle", "taskId", details, timestamp) VALUES
        ('l1', '1', 'Admin User',     'CREATED',       't1', 'Global Infrastructure Audit', 't1', 'Created task "Global Infrastructure Audit"', '${yesterday}'),
        ('l2', '1', 'Admin User',     'CREATED',       't2', 'Alpha Strike Parameter Sync',  't2', 'Created task "Alpha Strike Parameter Sync"', '${yesterday}'),
        ('l3', '2', 'Batool Sweiseh', 'STATUS_CHANGE', 't2', 'Alpha Strike Parameter Sync',  't2', 'Changed status to Completed',               '${today}'),
        ('l4', '2', 'Batool Sweiseh', 'CREATED',       't3', 'Daily Objective Sync',         't3', 'Created task "Daily Objective Sync"',        '${today}')
      ON CONFLICT (id) DO NOTHING
    `);
  }

  console.log('✅ Postgres schema ready.');
}
