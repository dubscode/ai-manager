import { RecentStandups } from '@/features/standups/components/recent-standups';
import { TodayStandup } from '@/features/standups/components/today-standup';

export default function DashboardPage() {
  return (
    <main className='p-6'>
      <div className='grid gap-6'>
        <TodayStandup />
        <RecentStandups />
      </div>
    </main>
  );
}
