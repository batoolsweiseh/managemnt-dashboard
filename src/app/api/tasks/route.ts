import { NextResponse } from 'next/server';
import { getTasks, createTask } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRole = (session.user as any).role;
  const userId = session.user.id;

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || undefined;
  const status = searchParams.get('status') || undefined;
  const priority = searchParams.get('priority') || undefined;
  const dueDate = searchParams.get('dueDate') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const data = await getTasks(
      query, 
      status, 
      priority, 
      dueDate, 
      page, 
      limit, 
      userRole === 'Admin' ? undefined : userId
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error (GET /api/tasks):', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== 'Admin') {
    return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 403 });
  }

  try {
    const body = await request.json();
    console.log("INPUT (API POST /api/tasks):", JSON.stringify(body));
    console.log("TYPE:", typeof body);

    const { title, description, status, priority, dueDate, assignedUser, assignedUserId } = body;

    // Validation
    if (!title || !description || !status || !priority || !dueDate || !assignedUser || !assignedUserId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Missing required fields.' }, 
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
      assignedUserId,
    });

    revalidatePath('/');
    revalidatePath('/tasks');
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('API Error (POST /api/tasks):', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
