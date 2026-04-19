"use server";

import { signIn, signOut, auth } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { 
  createTask as createDataTask, 
  updateTask as updateDataTask, 
  deleteTask as deleteDataTask, 
  getTask, 
  addActivityLog, 
  getActivityLogs,
  createNotification,
  getAdminIds,
  TaskStatus, 
  TaskPriority 
} from "./data";
import db from "./db";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

export async function login(prevState: string | undefined, formData: FormData) {
  try {
    const form = Object.fromEntries(formData) as Record<string, any>;
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      return res.error === "CredentialsSignin" ? "Invalid credentials." : "Unable to sign in.";
    }

    const userResult = await db.select({ id: schema.users.id, name: schema.users.name })
      .from(schema.users)
      .where(eq(schema.users.email, form.email as string))
      .limit(1);

    if (userResult[0]) {
      await addActivityLog({
        userId: userResult[0].id,
        userName: userResult[0].name,
        action: 'LOGIN',
        targetId: userResult[0].id,
        targetTitle: userResult[0].name,
        details: 'User logged into the system dashboard.'
      });
      revalidatePath('/', 'page');
    }

    return undefined;
  } catch (error) {
    if (error instanceof AuthError) return "Auth error. Protocol failure.";
    return "Something went wrong. Link interrupted.";
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function signup(prevState: string | undefined, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as 'Admin' | 'User';

    if (!name || !email || !password || !role) return "All fields required.";

    const existing = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (existing[0]) return "Identity already registered.";

    const id = Math.random().toString(36).substring(2, 9);
    await db.insert(schema.users).values({ id, name, email, password, role });
    
    await addActivityLog({
      userId: id,
      userName: name,
      action: 'SIGNUP',
      targetId: id,
      targetTitle: name,
      details: `Created a new ${role} account.`
    });

    revalidatePath('/', 'page');
    await signIn("credentials", { email, password, redirect: false });
    return undefined;
  } catch (error) {
    return "Initialization failed.";
  }
}

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) return { error: 'Unauthorized.' };
  const userRole = (session.user as any)?.role;

  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as TaskStatus;
    const priority = formData.get('priority') as TaskPriority;
    const dueDate = formData.get('dueDate') as string;
    const assignedUser = formData.get('assignedUser') as string;

    if (userRole !== 'Admin') return { error: 'Admin clearance required.' };

    const userMatch = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.name, assignedUser)).limit(1);
    const assignedUserId = userMatch[0]?.id || null;

    const newTask = await createDataTask({
      title, description, status, priority, dueDate, assignedUser, assignedUserId
    });

    await addActivityLog({
      userId: session.user.id!,
      userName: session.user.name!,
      action: 'CREATED',
      taskId: newTask.id,
      targetId: newTask.id,
      targetTitle: newTask.title,
      details: `Created mission "${newTask.title}"`
    });

    if (newTask.assignedUserId) {
      await createNotification({
        userId: newTask.assignedUserId,
        title: 'New Mission Assigned',
        message: `${session.user.name} assigned you a mission: ${newTask.title}`,
        type: 'ASSIGNMENT'
      });
    }

    revalidatePath('/', 'page'); revalidatePath('/tasks', 'page');
    return { success: true };
  } catch (error) {
    return { error: 'Mission creation parity failure.' };
  }
}

export async function updateTask(id: string, formData: FormData) {
  const session = await auth();
  if (!session || !session.user) return { error: 'Unauthorized' };
  const userRole = (session.user as any).role;
  const userId = session.user.id;

  try {
    const task = await getTask(id);
    if (!task) return { error: 'Mission not found.' };

    if (userRole !== 'Admin' && task.assignedUserId !== userId) {
      return { error: 'Forbidden: Security clearance insufficient.' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as TaskStatus;
    const priority = formData.get('priority') as TaskPriority;
    const dueDate = formData.get('dueDate') as string;
    const assignedUser = formData.get('assignedUser') as string;

    const updateData: any = {};
    if (userRole === 'Admin') {
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (priority) updateData.priority = priority;
      if (dueDate) updateData.dueDate = dueDate;
      if (status) updateData.status = status;
      if (assignedUser) {
        updateData.assignedUser = assignedUser;
        const userM = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.name, assignedUser)).limit(1);
        updateData.assignedUserId = userM[0]?.id || null;
      }
    } else {
      if (status) updateData.status = status;
    }

    const updatedTask = await updateDataTask(id, updateData);

    await addActivityLog({
      userId: session.user.id!,
      userName: session.user.name!,
      action: 'UPDATED',
      taskId: updatedTask.id,
      targetId: updatedTask.id,
      targetTitle: updatedTask.title,
      details: `Updated mission "${updatedTask.title}" parameters.`
    });

    // Notify assigned user if modified by Admin
    if (userRole === 'Admin' && updatedTask.assignedUserId) {
      const fieldChanged = (task.assignedUserId !== updatedTask.assignedUserId) ||
                          (task.status !== updatedTask.status) ||
                          (task.priority !== updatedTask.priority) ||
                          (task.dueDate !== updatedTask.dueDate) ||
                          (task.title !== updatedTask.title);

      if (fieldChanged) {
        const isNewAssignment = task.assignedUserId !== updatedTask.assignedUserId;
        await createNotification({
          userId: updatedTask.assignedUserId,
          title: isNewAssignment ? 'New Mission Assigned' : 'Mission Parameters Updated',
          message: isNewAssignment 
            ? `${session.user.name} assigned you a mission: ${updatedTask.title}`
            : `Mission "${updatedTask.title}" has been updated by the command hub. Check for changes.`,
          type: isNewAssignment ? 'ASSIGNMENT' : 'STATUS_UPDATE'
        });
      }
    }

    revalidatePath('/', 'page'); revalidatePath('/tasks', 'page');
    return { success: true };
  } catch (error) {
    return { error: 'Update sync failure.' };
  }
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const session = await auth();
  if (!session || !session.user) return { error: 'Unauthorized' };
  const userRole = (session.user as any).role;
  const userId = session.user.id;

  try {
    const task = await getTask(id);
    if (!task) return { error: 'Mission not found' };

    if (userRole !== 'Admin' && task.assignedUserId !== userId) {
      return { error: 'Security clearance denied.' };
    }

    const updatedTask = await updateDataTask(id, { status });

    await addActivityLog({
      userId: session.user.id!,
      userName: session.user.name!,
      action: 'STATUS_CHANGE',
      taskId: updatedTask.id,
      targetId: updatedTask.id,
      targetTitle: updatedTask.title,
      details: `Changed phase status to ${status}`
    });

    if (userRole === 'Admin') {
      if (updatedTask.assignedUserId) {
        await createNotification({
          userId: updatedTask.assignedUserId,
          title: 'Mission Status Updated',
          message: `Mission "${updatedTask.title}" status updated to ${status} by HQ.`,
          type: 'STATUS_UPDATE'
        });
      }
    } else {
      const admins = await getAdminIds();
      for (const admin of admins) {
        await createNotification({
          userId: admin.id,
          title: 'Operative Update',
          message: `${session.user.name} updated status of "${updatedTask.title}" to ${status}`,
          type: 'STATUS_UPDATE'
        });
      }
    }

    revalidatePath('/', 'page'); revalidatePath('/tasks', 'page');
    return { success: true };
  } catch (error) {
    return { error: 'Status update protocol failed.' };
  }
}

export async function deleteTask(id: string) {
  const session = await auth();
  if (!session || !session.user) return { error: 'Unauthorized.' };
  const userRole = (session.user as any)?.role;

  try {
    const task = await getTask(id);
    if (!task) return { error: 'Mission already terminated.' };
    if (userRole !== 'Admin') return { error: 'Admin clearance required for termination.' };
    
    await deleteDataTask(id);

    await addActivityLog({
      userId: session.user.id!,
      userName: session.user.name!,
      action: 'DELETED',
      taskId: id,
      targetId: id,
      targetTitle: task.title,
      details: `Terminated mission "${task.title}"`
    });

    revalidatePath('/', 'page'); revalidatePath('/tasks', 'page');
    return { success: true };
  } catch (error) {
    return { error: 'Termination process failed.' };
  }
}

export async function getUserNotifications() {
  const session = await auth();
  if (!session || !session.user) return [];
  const { getNotifications } = await import("./data");
  return await getNotifications(session.user.id!);
}

export async function readNotification(id: string) {
  const session = await auth();
  if (!session || !session.user) return { error: 'Unauthorized' };
  const { markNotificationRead } = await import("./data");
  const result = await markNotificationRead(id);
  revalidatePath('/', 'page');
  return result;
}

export async function clearAllNotifications() {
  const session = await auth();
  if (!session || !session.user) return { error: 'Unauthorized' };
  const { markAllRead } = await import("./data");
  const result = await markAllRead(session.user.id!);
  revalidatePath('/', 'page');
  return result;
}

export async function getTaskActivity(taskId: string) {
  return await getActivityLogs(taskId);
}
