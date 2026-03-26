"use server";

import { signIn, signOut, auth } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";
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
  TaskPriority,
  Notification 
} from "./data";
import db from "./db";

export async function getTaskActivity(taskId: string) {
  return await getActivityLogs(taskId);
}

export async function login(prevState: string | undefined, formData: FormData) {
  try {
    const form = Object.fromEntries(formData) as Record<string, any>;
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        return "Invalid credentials.";
      }
      return "Unable to sign in.";
    }

    // Add activity log for successful login
    const user = db.prepare('SELECT id, name FROM users WHERE email = ?').get(form.email) as { id: string, name: string } | undefined;
    if (user) {
      await addActivityLog({
        userId: user.id,
        userName: user.name,
        action: 'LOGIN',
        targetId: user.id,
        targetTitle: user.name,
        details: 'User logged into the system dashboard.'
      });
      revalidatePath('/', 'page');
    }

    // Success - will be handled by the client-side router.push('/')
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    console.error("Unexpected login error:", error);
    return "Something went wrong. Please try again later.";
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function signup(prevState: string | undefined, formData: FormData) {
  // Input Validation & Logging (User Advice)
  const rawForm = Object.fromEntries(formData.entries());
  console.log("INPUT (Signup):", JSON.stringify(rawForm));
  console.log("TYPE:", typeof rawForm);

  if (!formData || formData.entries().next().done) {
    return "Required fields are missing.";
  }

  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as 'Admin' | 'User';

    if (!name || !email || !password || !role) {
      return "All fields are required.";
    }

    // DB Query: Check User
    let existingUser;
    try {
      existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    } catch (e) {
      console.error("Database error during signup check:", e);
      return "Internal database error. Please try again.";
    }

    if (existingUser) {
      return "User already exists.";
    }

    const id = Math.random().toString(36).substring(2, 9);
    
    try {
      db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)').run(id, name, email, password, role);
      
      await addActivityLog({
        userId: id,
        userName: name,
        action: 'SIGNUP',
        targetId: id,
        targetTitle: name,
        details: `Created a new ${role} account.`
      });

      revalidatePath('/', 'page');

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        return "Signup succeeded but login failed.";
      }
    } catch (e) {
      console.error("Database error during user insertion:", e);
      return "Failed to save user in database.";
    }
  } catch (error) {
    if (error instanceof AuthError) return "Auth error during signup.";
    console.error("Signup error:", error);
    return "An unexpected error occurred during signup.";
  }
}

export async function createTask(formData: FormData) {
  // Input Validation & Logging (User Advice)
  const rawForm = Object.fromEntries(formData.entries());
  console.log("INPUT (CreateTask):", JSON.stringify(rawForm));
  console.log("TYPE:", typeof rawForm);

  if (!formData || formData.entries().next().done) {
    return { error: 'Input is empty' };
  }

  const session = await auth();
  if (!session || !session.user) {
    return { error: 'Unauthorized.' };
  }

  const userRole = (session.user as any)?.role;

  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as TaskStatus;
    const priority = formData.get('priority') as TaskPriority;
    const dueDate = formData.get('dueDate') as string;

    if (userRole !== 'Admin') {
      return { error: 'Forbidden: Only admins can create tasks.' };
    }

    const assignedUser = formData.get('assignedUser') as string;
    let assignedUserId = formData.get('assignedUserId') as string | null;

    // If assignedUserId is empty or null, try to find the user by their name
    if (!assignedUserId || assignedUserId === '') {
      try {
        const user = db.prepare('SELECT id FROM users WHERE name = ?').get(assignedUser) as { id: string } | undefined;
        assignedUserId = user?.id || null;
      } catch (e) {
        console.error("Database error looking up user:", e);
      }
    }

    if (!title || !description || !status || !priority || !dueDate || !assignedUser) {
      return { error: 'All fields are required.' };
    }

    const newTask = await createDataTask({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedUser,
      assignedUserId: assignedUserId || null, 
    });

    await addActivityLog({
      userId: session.user?.id || 'unknown',
      userName: session.user?.name || 'Unknown',
      action: 'CREATED',
      taskId: newTask.id,
      targetId: newTask.id,
      targetTitle: newTask.title,
      details: `Created task "${newTask.title}"`
    });

    if (newTask.assignedUserId) {
      await createNotification({
        userId: newTask.assignedUserId,
        title: 'New Task Assigned',
        message: `${session.user?.name || 'An admin'} assigned you a new task: ${newTask.title}`,
        type: 'ASSIGNMENT'
      });
    }

    revalidatePath('/', 'page');
    revalidatePath('/tasks', 'page');
    return { success: true };
  } catch (error: any) {
    console.error("CRITICAL ERROR in createTask:", error.message || error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      return { error: `Task creation failed: Data constraint violation (${error.message})` };
    }
    return { error: `System error while creating task: ${error.message || 'Unknown error'}` };
  }
}

export async function updateTask(id: string, formData: FormData) {
  // Input Validation & Logging (User Advice)
  const rawForm = Object.fromEntries(formData.entries());
  console.log("INPUT (UpdateTask):", JSON.stringify(rawForm));
  console.log("TYPE:", typeof rawForm);

  if (!id) {
    return { error: 'Task ID is required' };
  }

  const session = await auth();
  if (!session || !session.user) return { error: 'Unauthorized' };

  const userRole = (session.user as any).role;
  const userId = session.user.id;

  try {
    const task = await getTask(id).catch(e => {
      console.error("Database error fetching task:", e);
      throw new Error("Failed to retrieve task from database.");
    });
    
    if (!task) return { error: 'Task not found.' };

    if (userRole !== 'Admin' && task.assignedUserId !== userId) {
      return { error: 'Forbidden: You can only update your own tasks.' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as TaskStatus;
    const priority = formData.get('priority') as TaskPriority;
    const dueDate = formData.get('dueDate') as string;
    const assignedUser = formData.get('assignedUser') as string;
    let assignedUserId = formData.get('assignedUserId') as string | null;

    // Mapping for Admin if they typed a name
    if (userRole === 'Admin' && (!assignedUserId || assignedUserId === '')) {
      try {
        const user = db.prepare('SELECT id FROM users WHERE name = ?').get(assignedUser) as { id: string } | undefined;
        assignedUserId = user?.id || null;
      } catch (e) {
        console.error("Database error mapping user:", e);
      }
    }

    const updateData: any = {};
    if (userRole === 'Admin') {
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (priority) updateData.priority = priority;
      if (dueDate) updateData.dueDate = dueDate;
      if (assignedUser) updateData.assignedUser = assignedUser;
      updateData.assignedUserId = assignedUserId;
      if (status) updateData.status = status;
    } else {
      if (status) updateData.status = status;
      else return { error: 'Forbidden: Users can only update task status.' };
    }

    const updatedTask = await updateDataTask(id, updateData);

    await addActivityLog({
      userId: session.user?.id || 'unknown',
      userName: session.user?.name || 'Unknown',
      action: 'UPDATED',
      taskId: updatedTask.id,
      targetId: updatedTask.id,
      targetTitle: updatedTask.title,
      details: `Updated task "${updatedTask.title}"`
    });

    // Notify assigned user of any relevant change if the action was by an Admin
    if (userRole === 'Admin' && updatedTask.assignedUserId) {
      const fieldChanged = (task.assignedUserId !== updatedTask.assignedUserId) ||
                          (task.status !== updatedTask.status) ||
                          (task.priority !== updatedTask.priority) ||
                          (task.dueDate !== updatedTask.dueDate) ||
                          (task.title !== updatedTask.title) ||
                          (task.description !== updatedTask.description);

      if (fieldChanged) {
        const isNewAssignment = task.assignedUserId !== updatedTask.assignedUserId;
        await createNotification({
          userId: updatedTask.assignedUserId,
          title: isNewAssignment ? 'New Task Assigned' : 'Task Parameters Updated',
          message: isNewAssignment 
            ? `${session.user?.name || 'An admin'} assigned you a new task: ${updatedTask.title}`
            : `The mission "${updatedTask.title}" has been updated by the command hub. Check for parameter changes (status, priority, or deadline).`,
          type: isNewAssignment ? 'ASSIGNMENT' : 'STATUS_UPDATE'
        });
      }
    }

    revalidatePath('/', 'page');
    revalidatePath('/tasks', 'page');
    
    
    return { success: true };
  } catch (error: any) {
    console.error("CRITICAL ERROR in updateTask:", error.message || error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      return { error: `Task update failed: Database constraint error (${error.message})` };
    }
    return { error: `Failed to update task: ${error.message || 'Unknown error'}` };
  }
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  console.log("INPUT (UpdateStatus):", JSON.stringify({ id, status }));
  console.log("TYPE:", typeof status);

  if (!id || !status) {
    return { error: 'Missing task ID or status' };
  }

  const session = await auth();
  if (!session || !session.user) return { error: 'Unauthorized' };

  const userRole = (session.user as any).role;
  const userId = session.user.id;

  try {
    const task = await getTask(id);
    if (!task) return { error: 'Task not found' };

    if (userRole !== 'Admin' && task.assignedUserId !== userId) {
      return { error: 'Forbidden: You can only update your own tasks.' };
    }

    const updatedTask = await updateDataTask(id, { status });

    await addActivityLog({
      userId: session.user?.id || 'unknown',
      userName: session.user?.name || 'Unknown',
      action: 'STATUS_CHANGE',
      taskId: updatedTask.id,
      targetId: updatedTask.id,
      targetTitle: updatedTask.title,
      details: `Changed status to ${status}`
    });

    if (userRole === 'Admin') {
      if (updatedTask.assignedUserId) {
        await createNotification({
          userId: updatedTask.assignedUserId,
          title: 'Task Status Updated',
          message: `The status of mission "${updatedTask.title}" was updated to ${status} by ${session.user?.name || 'the operative'}`,
          type: 'STATUS_UPDATE'
        });
      }
    } else {
      const admins = await getAdminIds();
      for (const admin of admins) {
        await createNotification({
          userId: admin.id,
          title: 'Operative Update',
          message: `${session.user?.name || 'An operative'} updated the status of "${updatedTask.title}" to ${status}`,
          type: 'STATUS_UPDATE'
        });
      }
    }

    revalidatePath('/', 'page');
    revalidatePath('/tasks', 'page');
    
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update task status (Database/Logic):", error);
    return { error: 'Failed to update status. Please try again.' };
  }
}

export async function deleteTask(id: string) {
  console.log("INPUT (DeleteTask):", id);
  console.log("TYPE:", typeof id);

  if (!id) return { error: 'Task ID is required' };

  const session = await auth();
  if (!session || !session.user) {
    return { error: 'Unauthorized.' };
  }

  const userRole = (session.user as any)?.role;

  try {
    const task = await getTask(id);
    if (!task) return { error: 'Task already deleted or not found.' };

    // Only Admin can delete tasks
    if (userRole !== 'Admin') {
      return { error: 'Forbidden: Users cannot delete tasks.' };
    }
    
    try {
      await deleteDataTask(id);
    } catch (e) {
      console.error("Database error during task deletion:", e);
      return { error: 'Database failed to delete the task.' };
    }

    await addActivityLog({
      userId: session.user?.id || 'unknown',
      userName: session.user?.name || 'Unknown',
      action: 'DELETED',
      taskId: id,
      targetId: id,
      targetTitle: task.title,
      details: `Deleted task "${task.title}"`
    });

    revalidatePath('/', 'page');
    revalidatePath('/tasks', 'page');
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task (Logic/Log):", error);
    return { error: 'Failed to complete deletion process.' };
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
