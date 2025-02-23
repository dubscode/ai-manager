'use client';

import {
  AlertCircle,
  Calendar,
  Download,
  MessageCircle,
  RefreshCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function StandupSummary() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  const sentimentData = [
    { name: 'Mon', value: 3 },
    { name: 'Tue', value: 4 },
    { name: 'Wed', value: 3 },
    { name: 'Thu', value: 5 },
    { name: 'Fri', value: 4 },
  ];

  return (
    <div className='flex min-h-screen flex-col bg-background text-white'>
      <header className='border-b border-slate-800 p-4'>
        <h1 className='text-xl font-bold'>Post-Standup Summary</h1>
      </header>
      <main className='flex-1 p-6'>
        <div className='mx-auto max-w-4xl space-y-6'>
          <Card className='border-primary bg-card shadow-[0_0_10px_rgba(0,255,255,0.1)]'>
            <CardHeader>
              <CardTitle className='text-primary'>Standup Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <SummarySection
                title="Yesterday's Work"
                content='Completed API integration and documentation for the user authentication module.'
                icon='✅'
                expanded={expanded === 'yesterday'}
                onToggle={() => toggleExpand('yesterday')}
              />
              <SummarySection
                title="Today's Plan"
                content='Start work on frontend components for the dashboard, focusing on data visualization.'
                icon='🔄'
                expanded={expanded === 'today'}
                onToggle={() => toggleExpand('today')}
              />
              <SummarySection
                title='Blockers'
                content='Waiting for DevOps to set up the staging environment for testing.'
                icon='⚠️'
                expanded={expanded === 'blockers'}
                onToggle={() => toggleExpand('blockers')}
                isBlocker={true}
              />
              <div className='rounded-lg border border-slate-700 bg-[#1e2642] p-4'>
                <h3 className='mb-2 text-lg font-medium text-cyan-300'>
                  📊 Sentiment Analysis
                </h3>
                <div className='flex items-center justify-between'>
                  <span className='text-lg font-medium text-green-400'>
                    Positive
                  </span>
                  <span className='text-3xl'>😊</span>
                </div>
                <div className='mt-4 h-2 w-full rounded-full bg-slate-700'>
                  <div className='h-full w-3/4 rounded-full bg-green-500' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-cyan-500 bg-[#232a45] shadow-[0_0_10px_rgba(0,255,255,0.1)]'>
            <CardHeader>
              <CardTitle className='text-cyan-300'>Suggested Actions</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Button className='w-full bg-cyan-500 text-white hover:bg-cyan-600'>
                <MessageCircle className='mr-2 h-4 w-4' />
                Notify Manager about Blockers
              </Button>
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

          <Card className='border-cyan-500 bg-[#232a45] shadow-[0_0_10px_rgba(0,255,255,0.1)]'>
            <CardHeader>
              <CardTitle className='text-cyan-300'>
                Team Sentiment Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-64 w-full'>
                <ResponsiveContainer
                  width='100%'
                  height='100%'
                >
                  <LineChart data={sentimentData}>
                    <XAxis
                      dataKey='name'
                      stroke='#94a3b8'
                    />
                    <YAxis stroke='#94a3b8' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e2642',
                        border: '1px solid #475569',
                      }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Line
                      type='monotone'
                      dataKey='value'
                      stroke='#22d3ee'
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className='border-cyan-500 bg-[#232a45] shadow-[0_0_10px_rgba(0,255,255,0.1)]'>
            <CardHeader>
              <CardTitle className='text-cyan-300'>
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='list-inside list-disc space-y-2 text-slate-300'>
                <li>
                  Consider breaking down the frontend task into smaller,
                  manageable chunks.
                </li>
                <li>
                  Follow up with DevOps team to expedite the staging environment
                  setup.
                </li>
                <li>Your positive attitude is great! Keep up the momentum.</li>
              </ul>
            </CardContent>
          </Card>

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
          <p className='text-muted-foreground'>{content}</p>
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
