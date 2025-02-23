import { AlertCircle, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StandupCardProps {
  date: string;
  status: 'Completed' | 'Partial';
  sentiment: string;
  sentimentText: 'positive' | 'negative' | 'neutral';
  highlights: string[];
  blockers: string[];
  actionItems: Array<{
    title: string;
    type: string;
  }>;
  responses?: Array<{
    question: string;
    response: string;
  }>;
}

export function StandupCard({
  date,
  status,
  sentiment,
  sentimentText,
  highlights,
  blockers,
  actionItems,
  responses,
}: StandupCardProps) {
  const statusColor = status === 'Completed' ? 'green' : 'yellow';

  return (
    <Card className='border-slate-800 bg-[#232a45]'>
      <CardHeader className='space-y-2'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-sm font-medium text-white'>
            {date}
          </CardTitle>
          <div
            className={`rounded-full bg-${statusColor}-500/20 px-2 py-1 text-xs text-${statusColor}-500`}
          >
            {status}
          </div>
        </div>
        <div className='flex items-center justify-between border-t border-slate-800 pt-2'>
          <span className='text-sm text-slate-200'>Sentiment</span>
          <div className='flex items-center gap-2'>
            <span className='text-lg'>{sentiment}</span>
            <span className='text-sm capitalize text-slate-400'>
              {sentimentText}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {highlights.length > 0 && (
            <div>
              <h3 className='mb-2 text-sm font-medium text-slate-200'>
                ✨ Highlights
              </h3>
              <ul className='list-inside list-disc space-y-1'>
                {highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className='text-sm text-slate-400'
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {blockers.length > 0 && (
            <div>
              <h3 className='mb-2 flex items-center text-sm font-medium text-slate-200'>
                <AlertCircle className='mr-1 h-4 w-4 text-red-400' />
                Blockers
              </h3>
              <ul className='list-inside list-disc space-y-1'>
                {blockers.map((blocker, index) => (
                  <li
                    key={index}
                    className='text-sm text-red-400'
                  >
                    {blocker}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {actionItems.length > 0 && (
            <div>
              <h3 className='mb-2 flex items-center text-sm font-medium text-slate-200'>
                <ListChecks className='mr-1 h-4 w-4 text-cyan-400' />
                Action Items
              </h3>
              <ul className='list-inside list-disc space-y-1'>
                {actionItems.map((action, index) => (
                  <li
                    key={index}
                    className='text-sm text-cyan-400'
                  >
                    {action.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {responses && responses.length > 0 && (
            <div className='border-t border-slate-800 pt-4'>
              <h3 className='mb-2 text-sm font-medium text-slate-200'>
                Q&A Summary
              </h3>
              <div className='space-y-2'>
                {responses.map((qa, index) => (
                  <div key={index}>
                    <p className='text-sm font-medium text-slate-300'>
                      {qa.question}
                    </p>
                    <p className='text-sm text-slate-400'>{qa.response}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
