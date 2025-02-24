import { db, standups } from '@/db';

import { eq } from 'drizzle-orm';

export async function getStandup(standupId: string) {
  return await db.query.standups.findFirst({
    where: eq(standups.id, standupId),
    with: {
      blockers: true,
      actions: true,
      responses: true,
      user: true,
    },
  });
}
