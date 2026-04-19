import { 
  pgTable, 
  text, 
  integer, 
  timestamp, 
} from "drizzle-orm/pg-core";
import { 
  text as sqliteText, 
  integer as sqliteInteger, 
  sqliteTable as sqliteTableBase, 
} from "drizzle-orm/sqlite-core";

// Helper to switch between PG and SQLite schema definitions
const isPostgres = !!process.env.POSTGRES_URL;

export const users = isPostgres 
  ? pgTable("users", {
      id: text("id").primaryKey(),
      name: text("name").notNull(),
      email: text("email").unique().notNull(),
      password: text("password").notNull(),
      role: text("role").notNull().default("User"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
    })
  : sqliteTableBase("users", {
      id: sqliteText("id").primaryKey(),
      name: sqliteText("name").notNull(),
      email: sqliteText("email").unique().notNull(),
      password: sqliteText("password").notNull(),
      role: sqliteText("role").notNull().default("User"),
      createdAt: sqliteText("createdAt").notNull().default("(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))"),
    });

export const tasks = isPostgres
  ? pgTable("tasks", {
      id: text("id").primaryKey(),
      title: text("title").notNull(),
      description: text("description"),
      status: text("status").notNull().default("Pending"),
      priority: text("priority").notNull().default("Medium"),
      dueDate: text("dueDate").notNull(),
      assignedUserId: text("assignedUserId").references(() => (users as any).id),
      assignedUser: text("assignedUser"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    })
  : sqliteTableBase("tasks", {
      id: sqliteText("id").primaryKey(),
      title: sqliteText("title").notNull(),
      description: sqliteText("description"),
      status: sqliteText("status").notNull().default("Pending"),
      priority: sqliteText("priority").notNull().default("Medium"),
      dueDate: sqliteText("dueDate").notNull(),
      assignedUserId: sqliteText("assignedUserId").references(() => (users as any).id),
      assignedUser: sqliteText("assignedUser"),
      createdAt: sqliteText("createdAt").notNull().default("(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))"),
      updatedAt: sqliteText("updatedAt").notNull().default("(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))"),
    });

export const activityLogs = isPostgres
  ? pgTable("activity_logs", {
      id: text("id").primaryKey(),
      userId: text("userId").notNull().references(() => (users as any).id),
      userName: text("userName").notNull(),
      action: text("action").notNull(),
      targetId: text("targetId").notNull(),
      targetTitle: text("targetTitle").notNull(),
      taskId: text("taskId").references(() => (tasks as any).id, { onDelete: 'cascade' }),
      details: text("details"),
      timestamp: timestamp("timestamp").defaultNow().notNull(),
    })
  : sqliteTableBase("activity_logs", {
      id: sqliteText("id").primaryKey(),
      userId: sqliteText("userId").notNull().references(() => (users as any).id),
      userName: sqliteText("userName").notNull(),
      action: sqliteText("action").notNull(),
      targetId: sqliteText("targetId").notNull(),
      targetTitle: sqliteText("targetTitle").notNull(),
      taskId: sqliteText("taskId").references(() => (tasks as any).id, { onDelete: 'cascade' }),
      details: sqliteText("details"),
      timestamp: sqliteText("timestamp").notNull().default("(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))"),
    });

export const notifications = isPostgres
  ? pgTable("notifications", {
      id: text("id").primaryKey(),
      userId: text("userId").notNull().references(() => (users as any).id, { onDelete: 'cascade' }),
      title: text("title").notNull(),
      message: text("message").notNull(),
      type: text("type").notNull(),
      read: integer("read").notNull().default(0),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
    })
  : sqliteTableBase("notifications", {
      id: sqliteText("id").primaryKey(),
      userId: sqliteText("userId").notNull().references(() => (users as any).id, { onDelete: 'cascade' }),
      title: sqliteText("title").notNull(),
      message: sqliteText("message").notNull(),
      type: sqliteText("type").notNull(),
      read: sqliteInteger("read").notNull().default(0),
      createdAt: sqliteText("createdAt").notNull().default("(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))"),
    });
