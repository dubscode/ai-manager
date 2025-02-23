import { and, desc, eq, gte } from 'drizzle-orm';
import { db, standups as standupsTable } from '@/db';

import { RecentStandups } from '@/features/standups/components/recent-standups';
import { StandupTrendChart } from '@/features/standups/components/standup-trend-chart';
import { TodayStandup } from '@/features/standups/components/today-standup';
import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const standups = await db.query.standups.findMany({
    where: and(
      eq(standupsTable.userId, userId),
      gte(standupsTable.createdAt, yesterday)
    ),
    orderBy: [desc(standupsTable.createdAt)],
    with: {
      blockers: true,
      actions: true,
    },
  });

  // Get recent standups (excluding today's if it exists)
  const recentStandups = await db.query.standups.findMany({
    where: and(
      eq(standupsTable.userId, userId),
      gte(
        standupsTable.createdAt,
        new Date(today.setDate(today.getDate() - 90))
      )
    ),
    orderBy: [desc(standupsTable.createdAt)],
    with: {
      blockers: true,
      actions: true,
    },
  });

  return (
    <main className='p-6'>
      <div className='grid gap-6'>
        <TodayStandup todayStandups={standups} />
        <StandupTrendChart standups={recentStandups} />
        <RecentStandups recentStandups={recentStandups.slice(0, 3)} />
      </div>
    </main>
  );
}
