import { standups } from '@/db/schema';
import { StandupCard } from '@/features/standups/components/standup-card';
import { formatDistanceToNow } from 'date-fns';
import { type InferSelectModel } from 'drizzle-orm';

type Standup = InferSelectModel<typeof standups>;

interface RecentStandupsProps {
  recentStandups: Standup[];
}

export function RecentStandups({ recentStandups }: RecentStandupsProps) {
  return (
    <section className='grid gap-4'>
      <h2 className='text-lg font-semibold text-white'>Recent Standups</h2>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {recentStandups.map((standup) => (
          <StandupCard
            key={standup.id}
            date={formatDistanceToNow(new Date(standup.createdAt!), {
              addSuffix: true,
            })}
            status={standup.status === 'completed' ? 'Completed' : 'Partial'}
            sentiment={
              standup.overallSentiment === 'positive'
                ? '😊'
                : standup.overallSentiment === 'negative'
                ? '😞'
                : '😐'
            }
            sentimentText={standup.overallSentiment || 'neutral'}
            highlights={standup.transcriptHighlights || []}
            blockers={[]}
            actionItems={[]}
          />
        ))}
      </div>
    </section>
  );
}
