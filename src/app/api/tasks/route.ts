import { NextResponse } from 'next/server';
import { getTasks, createTask } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || undefined;
  const status = searchParams.get('status') || undefined;
  const priority = searchParams.get('priority') || undefined;
  const dueDate = searchParams.get('dueDate') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const data = await getTasks(query, status, priority, dueDate, page, limit);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error (GET /api/tasks):', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks', message: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, status, priority, dueDate, assignedUser } = body;

    // Validation
    if (!title || !description || !status || !priority || !dueDate || !assignedUser) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Missing required fields: title, description, status, priority, dueDate, and assignedUser are required.' }, 
        { status: 400 }
      );
    }

    const newTask = await createTask({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedUser,
    });

    revalidatePath('/');
    revalidatePath('/tasks');
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('API Error (POST /api/tasks):', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to create task' }, 
      { status: 500 }
    );
  }
}
