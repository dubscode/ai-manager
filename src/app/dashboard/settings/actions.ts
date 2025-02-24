'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import { z } from 'zod';

const UpdateSettingsSchema = z.object({
  managerEmail: z.string().email('Please enter a valid email address'),
  linearApiKey: z.string().min(1, 'Linear API key is required'),
});

export async function getCurrentUserData() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user;
}

export async function updateManagerEmail(formData: FormData) {
  'use server';

  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const rawFormData = {
    managerEmail: formData.get('managerEmail'),
    linearApiKey: formData.get('linearApiKey'),
  };

  const validatedFields = UpdateSettingsSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return { error: 'Invalid form data' };
  }

  try {
    await db
      .update(users)
      .set({
        managerEmail: validatedFields.data.managerEmail,
        linearApiKey: validatedFields.data.linearApiKey,
      })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to update settings:', error);
    return { error: 'Failed to update settings' };
  }
}
