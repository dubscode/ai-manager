import { StandupSummary } from '@/features/standups/components/standup-summary';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { standups } from '@/db/schema';

interface ReportsPageProps {
  params: {
    standupId: string;
  };
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const standup = await db.query.standups.findFirst({
    where: eq(standups.id, params.standupId),
    with: {
      blockers: true,
      actions: true,
      responses: true,
      user: true,
    },
  });

  if (!standup || standup.userId !== userId) {
    notFound();
  }

  return (
    <main className='p-6'>
      <div className='grid gap-6'>
        <h1 className='text-2xl font-bold text-white'>Standup Report</h1>
        <StandupSummary standup={standup} />
      </div>
    </main>
  );
}
