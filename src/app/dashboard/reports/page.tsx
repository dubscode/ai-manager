import { desc, eq } from 'drizzle-orm';

import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { formatDistanceToNow } from 'date-fns';
import { standups } from '@/db/schema';

export default async function ReportsPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const recentStandups = await db.query.standups.findMany({
    where: eq(standups.userId, userId),
    orderBy: [desc(standups.createdAt)],
    with: {
      blockers: true,
      actions: true,
    },
    limit: 10,
  });

  return (
    <main className='p-6'>
      <div className='grid gap-6'>
        <h1 className='text-2xl font-bold text-white'>Reports</h1>
        <div className='grid gap-4'>
          {recentStandups.map((standup) => (
            <Link
              key={standup.id}
              href={`/dashboard/reports/${standup.id}`}
              className='block'
            >
              <div className='rounded-lg border border-gray-800 bg-gray-900/50 p-6 hover:bg-gray-900/70 transition-colors'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-white'>
                      {standup.createdAt
                        ? formatDistanceToNow(new Date(standup.createdAt), {
                            addSuffix: true,
                          })
                        : 'No date'}
                    </p>
                    <p className='text-sm text-gray-400'>
                      {standup.blockers.length} blockers •{' '}
                      {standup.actions.length} actions
                    </p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-sm ${
                      standup.status === 'completed'
                        ? 'bg-green-500/20 text-green-500'
                        : standup.status === 'in_progress'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}
                  >
                    {standup.status.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
