'use client';

import {
  AlertCircle,
  Calendar,
  Download,
  MessageCircle,
  RefreshCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { StandupWithRelations } from '@/features/standups/types';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface StandupSummaryProps {
  standup: StandupWithRelations;
}

export function StandupSummary({ standup }: StandupSummaryProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!standup) {
    return null;
  }

  const toggleExpand = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  // Group responses by type
  const yesterdayWork = standup.responses.find((r) =>
    r.question.toLowerCase().includes('yesterday')
  );
  const todayPlan = standup.responses.find((r) =>
    r.question.toLowerCase().includes('today')
  );

  const sentiment = standup.overallSentiment || 'neutral';
  const sentimentEmoji =
    sentiment === 'positive' ? '😊' : sentiment === 'negative' ? '😞' : '😐';
  const sentimentProgress =
    sentiment === 'positive'
      ? 'w-3/4 bg-green-500'
      : sentiment === 'negative'
      ? 'w-1/4 bg-red-500'
      : 'w-1/2 bg-yellow-500';

  return (
    <div className='flex min-h-screen flex-col bg-background text-white'>
      <header className='border-b border-slate-800 p-4'>
        <h1 className='text-xl font-bold'>
          Standup Report -{' '}
          {standup.createdAt
            ? formatDistanceToNow(new Date(standup.createdAt), {
                addSuffix: true,
              })
            : 'No date'}
        </h1>
      </header>
      <main className='flex-1 p-6'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <Card className='border-primary bg-card shadow-[0_0_10px_rgba(0,255,255,0.1)]'>
            <CardHeader>
              <CardTitle className='text-primary'>Standup Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {yesterdayWork && (
                <SummarySection
                  title="Yesterday's Work"
                  content={yesterdayWork.response}
                  icon='✅'
                  expanded={expanded === 'yesterday'}
                  onToggle={() => toggleExpand('yesterday')}
                />
              )}
              {todayPlan && (
                <SummarySection
                  title="Today's Plan"
                  content={todayPlan.response}
                  icon='🔄'
                  expanded={expanded === 'today'}
                  onToggle={() => toggleExpand('today')}
                />
              )}
              {standup.blockers.length > 0 && (
                <SummarySection
                  title='Blockers'
                  content={standup.blockers.map((b) => b.blocker).join('\n')}
                  icon='⚠️'
                  expanded={expanded === 'blockers'}
                  onToggle={() => toggleExpand('blockers')}
                  isBlocker={true}
                />
              )}
              <div className='rounded-lg border border-slate-700 bg-[#1e2642] p-4'>
                <h3 className='mb-2 text-lg font-medium text-cyan-300'>
                  📊 Sentiment Analysis
                </h3>
                <div className='flex items-center justify-between'>
                  <span className='text-lg font-medium text-green-400'>
                    {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                  </span>
                  <span className='text-3xl'>{sentimentEmoji}</span>
                </div>
                <div className='mt-4 h-2 w-full rounded-full bg-slate-700'>
                  <div className={`h-full rounded-full ${sentimentProgress}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-cyan-500 bg-[#232a45] shadow-[0_0_10px_rgba(0,255,255,0.1)]'>
            <CardHeader>
              <CardTitle className='text-cyan-300'>Suggested Actions</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {standup.blockers.length > 0 && (
                <Button className='w-full bg-cyan-500 text-white hover:bg-cyan-600'>
                  <MessageCircle className='mr-2 h-4 w-4' />
                  Notify Manager about Blockers
                </Button>
              )}
              <Button className='w-full bg-cyan-500 text-white hover:bg-cyan-600'>
                <Calendar className='mr-2 h-4 w-4' />
                Schedule a Follow-up Meeting
              </Button>
              <Button className='w-full bg-cyan-500 text-white hover:bg-cyan-600'>
                <RefreshCcw className='mr-2 h-4 w-4' />
                Re-run Standup
              </Button>
            </CardContent>
          </Card>

          {standup.transcriptHighlights &&
            standup.transcriptHighlights.length > 0 && (
              <Card className='border-cyan-500 bg-[#232a45] shadow-[0_0_10px_rgba(0,255,255,0.1)]'>
                <CardHeader>
                  <CardTitle className='text-cyan-300'>
                    Transcript Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='list-inside list-disc space-y-2 text-slate-300'>
                    {standup.transcriptHighlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          {standup.actions.length > 0 && (
            <Card className='border-cyan-500 bg-[#232a45] shadow-[0_0_10px_rgba(0,255,255,0.1)]'>
              <CardHeader>
                <CardTitle className='text-cyan-300'>
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='list-inside list-disc space-y-2 text-slate-300'>
                  {standup.actions.map((action, index) => (
                    <li key={index}>
                      {action.actionTitle}
                      {action.actionSummary && (
                        <p className='ml-6 text-sm text-slate-400'>
                          {action.actionSummary}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className='flex justify-end'>
            <Button className='bg-cyan-500 text-white hover:bg-cyan-600'>
              <Download className='mr-2 h-4 w-4' />
              Download Report
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SummarySection({
  title,
  content,
  icon,
  expanded,
  onToggle,
  isBlocker = false,
}: {
  title: string;
  content: string;
  icon: string;
  expanded: boolean;
  onToggle: () => void;
  isBlocker?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border ${
        isBlocker ? 'border-destructive' : 'border-border'
      } bg-secondary p-4`}
    >
      <div
        className='flex cursor-pointer items-center justify-between'
        onClick={onToggle}
      >
        <h3 className='text-lg font-medium text-primary'>
          {icon} {title}
        </h3>
        {isBlocker && <AlertCircle className='h-5 w-5 text-destructive' />}
      </div>
      {expanded && (
        <div className='mt-2'>
          <p className='text-muted-foreground whitespace-pre-line'>{content}</p>
          <textarea
            className='mt-2 w-full rounded border border-border bg-background p-2 text-foreground'
            rows={3}
            placeholder='Add comments or edit your response...'
          />
        </div>
      )}
    </div>
  );
}
