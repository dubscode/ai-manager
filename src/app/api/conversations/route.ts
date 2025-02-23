import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { conversations } from '@/db/schema';
import { db } from '@/db';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, agentId } = await request.json();

    // Create a new conversation record
    const [conversation] = await db
      .insert(conversations)
      .values({
        id,
        agentId,
        userId,
        status: 'processing',
      })
      .returning();

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
