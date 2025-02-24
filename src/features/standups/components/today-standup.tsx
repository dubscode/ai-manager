'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { standups } from '@/db/schema';
import { formatDistanceToNow } from 'date-fns';
import { type InferSelectModel } from 'drizzle-orm';
import { Mic } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Standup = InferSelectModel<typeof standups>;

interface TodayStandupProps {
  todayStandups: Standup[];
}

export function TodayStandup({ todayStandups }: TodayStandupProps) {
  const hasStandup = todayStandups.length > 0;
  const latestStandup = hasStandup ? todayStandups[0] : null;
  const [allowMultipleStandups, setAllowMultipleStandups] = useState(false);

  return (
    <section className='grid gap-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-white'>
          Today&apos;s Standup
        </h2>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Switch
              id='allow-multiple'
              checked={allowMultipleStandups}
              onCheckedChange={setAllowMultipleStandups}
            />
            <Label
              htmlFor='allow-multiple'
              className='text-white'
            >
              Allow Multiple Standups
            </Label>
          </div>
          {hasStandup && !allowMultipleStandups ? (
            <Button
              disabled
              className='bg-slate-700 text-slate-400 cursor-not-allowed'
            >
              <Mic className='mr-2 h-4 w-4' />
              Already Completed
            </Button>
          ) : (
            <Link href='/dashboard/standup-call'>
              <Button className='bg-cyan-500 text-white hover:bg-cyan-600'>
                <Mic className='mr-2 h-4 w-4' />
                Start Standup
              </Button>
            </Link>
          )}
        </div>
      </div>
      <Card className='border-slate-800 bg-[#232a45]'>
        <CardHeader>
          <CardTitle className='text-white'>
            Status -{' '}
            {hasStandup
              ? `completed ${formatDistanceToNow(
                  new Date(latestStandup!.createdAt!),
                  {
                    addSuffix: true,
                  }
                )}`
              : 'not completed'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-2 overflow-hidden rounded bg-slate-700'>
            <div
              className={`${hasStandup ? 'w-full' : 'w-1/3'} bg-green-500`}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
