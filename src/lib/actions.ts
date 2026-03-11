"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { tasks, Task, TaskStatus, TaskPriority } from "./data";

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
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const status = formData.get('status') as TaskStatus;
  const priority = formData.get('priority') as TaskPriority;
  const dueDate = formData.get('dueDate') as string;
  const assignedUser = formData.get('assignedUser') as string;

  if (!title || !description || !status || !priority || !dueDate || !assignedUser) {
    return { error: 'All fields are required.' };
  }

  const newTask: Task = {
    id: Math.random().toString(36).substring(2, 9),
    title,
    description,
    status,
    priority,
    dueDate,
    assignedUser,
  };

  tasks.push(newTask);
  revalidatePath('/');
  revalidatePath('/tasks');
  return { success: true };
}

export async function updateTask(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const status = formData.get('status') as TaskStatus;
  const priority = formData.get('priority') as TaskPriority;
  const dueDate = formData.get('dueDate') as string;
  const assignedUser = formData.get('assignedUser') as string;

  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return { error: 'Task not found.' };

  tasks[index] = {
    ...tasks[index],
    title: title || tasks[index].title,
    description: description || tasks[index].description,
    status: status || tasks[index].status,
    priority: priority || tasks[index].priority,
    dueDate: dueDate || tasks[index].dueDate,
    assignedUser: assignedUser || tasks[index].assignedUser,
  };

  revalidatePath('/');
  revalidatePath('/tasks');
  return { success: true };
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return { error: 'Task not found.' };

  tasks[index].status = status;
  revalidatePath('/');
  revalidatePath('/tasks');
  return { success: true };
}

export async function deleteTask(id: string) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return { error: 'Task not found.' };

  tasks.splice(index, 1);
  revalidatePath('/');
  revalidatePath('/tasks');
  return { success: true };
}
