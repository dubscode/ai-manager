import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

export function TodayStandup() {
  return (
    <section className='grid gap-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-white'>
          Today&apos;s Standup
        </h2>
        <Button className='bg-cyan-500 text-white hover:bg-cyan-600'>
          <Mic className='mr-2 h-4 w-4' />
          Start Standup
        </Button>
      </div>
      <Card className='border-slate-800 bg-[#232a45]'>
        <CardHeader>
          <CardTitle className='text-white'>Status: Scheduled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-2 overflow-hidden rounded bg-slate-700'>
            <div className='w-1/3 bg-green-500' />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
