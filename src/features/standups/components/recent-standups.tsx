import { StandupCard } from '@/features/standups/components/standup-card';

const RECENT_STANDUPS = [
  {
    date: 'Yesterday',
    status: 'Completed' as const,
    yesterdayWork: 'Completed API integration and documentation',
    todayPlan: 'Start work on frontend components',
    blockers: 'None reported',
    sentiment: '😊',
  },
  {
    date: '2 Days Ago',
    status: 'Partial' as const,
    yesterdayWork: 'Code review and bug fixes',
    todayPlan: 'Continue with API development',
    blockers: 'Waiting for DevOps support',
    sentiment: '😐',
    isBlockerAlert: true,
  },
  {
    date: '3 Days Ago',
    status: 'Completed' as const,
    yesterdayWork: 'Initial project setup and planning',
    todayPlan: 'Begin API development',
    blockers: 'None reported',
    sentiment: '😊',
  },
];

export function RecentStandups() {
  return (
    <section className='grid gap-4'>
      <h2 className='text-lg font-semibold text-white'>Recent Standups</h2>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {RECENT_STANDUPS.map((standup) => (
          <StandupCard
            key={standup.date}
            {...standup}
          />
        ))}
      </div>
    </section>
  );
}
