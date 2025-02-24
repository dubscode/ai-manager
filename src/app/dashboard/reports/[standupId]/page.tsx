import { StandupSummary } from '@/features/standups/components/standup-summary';
import { auth } from '@clerk/nextjs/server';
import { getStandup } from '@/features/standups/api';
import { notFound } from 'next/navigation';

interface ReportsPageProps {
  params: Promise<{ standupId: string }>;
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const { userId } = await auth();
  const { standupId } = await params;

  if (!userId) {
    return null;
  }

  const standup = await getStandup(standupId);

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
