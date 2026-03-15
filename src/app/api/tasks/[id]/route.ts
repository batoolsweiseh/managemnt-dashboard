import { NextResponse } from 'next/server';
import { updateTask, deleteTask, getTask } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const task = await getTask(id);
    return NextResponse.json(task);
  } catch (error) {
    console.error(`API Error (GET /api/tasks/${id}):`, error);
    
    if (error instanceof Error && error.message === 'Task not found') {
      return NextResponse.json({ error: 'Not Found', message: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch task' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updatedTask = await updateTask(id, body);

    revalidatePath('/');
    revalidatePath('/tasks');
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(`API Error (PUT /api/tasks/${id}):`, error);
    
    if (error instanceof Error && error.message === 'Task not found') {
      return NextResponse.json({ error: 'Not Found', message: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to update task' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteTask(id);

    revalidatePath('/');
    revalidatePath('/tasks');
    
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(`API Error (DELETE /api/tasks/${id}):`, error);

    if (error instanceof Error && error.message === 'Task not found') {
      return NextResponse.json({ error: 'Not Found', message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to delete task' }, 
      { status: 500 }
    );
  }
}
