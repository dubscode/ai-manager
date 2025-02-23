import { db } from '@/db';
import { standups } from '@/db/schema';
import { inngest } from '@/lib/inngest';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a new standup record
    const [standup] = await db
      .insert(standups)
      .values({
        userId,
        status: 'in_progress',
      })
      .returning();

    return NextResponse.json(standup);
  } catch (error) {
    console.error('Error creating standup:', error);
    return NextResponse.json(
      { error: 'Failed to create standup' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, conversationId, status } = await request.json();

    await inngest.send({
      name: 'conversation/update',
      data: {
        conversationId,
      },
    });

    // Update the standup record
    const [updatedStandup] = await db
      .update(standups)
      .set({
        conversationId,
        status,
        ...(status === 'completed' ? { endTime: new Date() } : {}),
      })
      .where(eq(standups.id, id))
      .returning();

    if (!updatedStandup) {
      return NextResponse.json(
        { error: 'Standup not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedStandup);
  } catch (error) {
    console.error('Error updating standup:', error);
    return NextResponse.json(
      { error: 'Failed to update standup' },
      { status: 500 }
    );
  }
}
