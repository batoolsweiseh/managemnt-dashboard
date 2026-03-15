"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { createTask as createDataTask, updateTask as updateDataTask, deleteTask as deleteDataTask, TaskStatus, TaskPriority } from "./data";

export async function login(prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function createTask(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as TaskStatus;
    const priority = formData.get('priority') as TaskPriority;
    const dueDate = formData.get('dueDate') as string;
    const assignedUser = formData.get('assignedUser') as string;

    if (!title || !description || !status || !priority || !dueDate || !assignedUser) {
      return { error: 'All fields are required.' };
    }

    await createDataTask({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedUser,
    });

    revalidatePath('/');
    revalidatePath('/tasks');
    return { success: true };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { error: 'Failed to create task.' };
  }
}

export async function updateTask(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const status = formData.get('status') as TaskStatus;
    const priority = formData.get('priority') as TaskPriority;
    const dueDate = formData.get('dueDate') as string;
    const assignedUser = formData.get('assignedUser') as string;

    await updateDataTask(id, {
      title: title || undefined,
      description: description || undefined,
      status: status || undefined,
      priority: priority || undefined,
      dueDate: dueDate || undefined,
      assignedUser: assignedUser || undefined,
    });

    revalidatePath('/');
    revalidatePath('/tasks');
    return { success: true };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { error: 'Failed to update task.' };
  }
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  try {
    await updateDataTask(id, { status });
    revalidatePath('/');
    revalidatePath('/tasks');
    return { success: true };
  } catch (error) {
    console.error("Failed to update task status:", error);
    return { error: 'Failed to update status.' };
  }
}

export async function deleteTask(id: string) {
  try {
    await deleteDataTask(id);
    revalidatePath('/');
    revalidatePath('/tasks');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { error: 'Failed to delete task.' };
  }
}
