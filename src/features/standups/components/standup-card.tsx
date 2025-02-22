import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AlertCircle } from 'lucide-react';

interface StandupCardProps {
  date: string;
  status: 'Completed' | 'Partial';
  yesterdayWork: string;
  todayPlan: string;
  blockers: string;
  sentiment: string;
  isBlockerAlert?: boolean;
}

export function StandupCard({
  date,
  status,
  yesterdayWork,
  todayPlan,
  blockers,
  sentiment,
  isBlockerAlert,
}: StandupCardProps) {
  const statusColor = status === 'Completed' ? 'green' : 'yellow';

  return (
    <Card className='border-slate-800 bg-[#232a45]'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-white'>{date}</CardTitle>
        <div
          className={`rounded-full bg-${statusColor}-500/20 px-2 py-1 text-xs text-${statusColor}-500`}
        >
          {status}
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div>
            <h3 className='mb-2 text-sm font-medium text-slate-200'>
              ✅ Yesterday&apos;s Work
            </h3>
            <p className='text-sm text-slate-400'>{yesterdayWork}</p>
          </div>
          <div>
            <h3 className='mb-2 text-sm font-medium text-slate-200'>
              🔄 Today&apos;s Plan
            </h3>
            <p className='text-sm text-slate-400'>{todayPlan}</p>
          </div>
          <div>
            <h3 className='mb-2 text-sm font-medium text-slate-200'>
              ⚠️ Blockers
            </h3>
            {isBlockerAlert ? (
              <p className='flex items-center text-sm text-red-400'>
                <AlertCircle className='mr-1 h-4 w-4' />
                {blockers}
              </p>
            ) : (
              <p className='text-sm text-slate-400'>{blockers}</p>
            )}
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-slate-200'>Sentiment</span>
            <span className='text-lg'>{sentiment}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
