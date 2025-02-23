'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { standups } from '@/db/schema';
import { formatDistanceToNow } from 'date-fns';
import { type InferSelectModel } from 'drizzle-orm';
import * as React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type StandupWithRelations = InferSelectModel<typeof standups> & {
  blockers: { id: string }[];
  actions: { id: string }[];
};

type ChartData = {
  date: string;
  sentiment: number; // 1 = positive, 0 = neutral, -1 = negative
  blockers: number;
  actions: number;
};

type Props = {
  standups: StandupWithRelations[];
};

type TooltipEntry = {
  name: keyof typeof chartConfig;
  value: number;
  payload: ChartData;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
};

const chartConfig = {
  sentiment: {
    label: 'Sentiment',
    color: 'hsl(var(--chart-1))',
  },
  blockers: {
    label: 'Blockers',
    color: 'hsl(var(--chart-2))',
  },
  actions: {
    label: 'Actions',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload) return null;
  return (
    <div className='rounded-lg border bg-background p-2 shadow-sm'>
      <div className='grid gap-2'>
        <div className='flex flex-col'>
          <span className='text-[0.70rem] uppercase text-muted-foreground'>
            {label && formatDistanceToNow(new Date(label), { addSuffix: true })}
          </span>
        </div>
        {payload.map((entry) => (
          <div
            key={entry.name}
            className='flex items-center gap-2'
          >
            <div
              className='h-2 w-2 rounded-full'
              style={{
                backgroundColor: chartConfig[entry.name]?.color,
              }}
            />
            <span className='text-[0.70rem] uppercase text-muted-foreground'>
              {chartConfig[entry.name]?.label}:
            </span>
            <span className='font-bold'>
              {entry.name === 'sentiment'
                ? entry.value === 2
                  ? 'Positive'
                  : entry.value === 0
                  ? 'Negative'
                  : 'Neutral'
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export function StandupTrendChart({ standups }: Props) {
  const [timeRange, setTimeRange] = React.useState('30d');

  // Process standup data into chart format
  const chartData: ChartData[] = standups
    .map((standup) => {
      return {
        date: standup.createdAt?.toISOString() || '',
        sentiment:
          standup.overallSentiment === 'positive'
            ? 2
            : standup.overallSentiment === 'negative'
            ? 0
            : 1,
        blockers: standup.blockers?.length || 0,
        actions: standup.actions?.length || 0,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter data based on time range
  const filteredData = React.useMemo(() => {
    const now = new Date();
    const days = parseInt(timeRange);
    const startDate = new Date(now.setDate(now.getDate() - days));

    return chartData.filter((item) => new Date(item.date) >= startDate);
  }, [chartData, timeRange]);

  return (
    <Card>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='grid flex-1 gap-1 text-center sm:text-left'>
          <CardTitle>Standup Trends</CardTitle>
          <CardDescription>
            Tracking sentiment and activity over time
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger
            className='w-[160px] rounded-lg sm:ml-auto'
            aria-label='Select time range'
          >
            <SelectValue placeholder='Last 30 days' />
          </SelectTrigger>
          <SelectContent className='rounded-xl'>
            <SelectItem
              value='90d'
              className='rounded-lg'
            >
              Last 3 months
            </SelectItem>
            <SelectItem
              value='30d'
              className='rounded-lg'
            >
              Last 30 days
            </SelectItem>
            <SelectItem
              value='7d'
              className='rounded-lg'
            >
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='h-[250px] w-full'
        >
          <ResponsiveContainer
            width='100%'
            height='100%'
          >
            <ComposedChart data={filteredData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  return formatDistanceToNow(new Date(value), {
                    addSuffix: true,
                  });
                }}
              />
              <YAxis
                yAxisId='sentiment'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 2]}
                ticks={[0, 1, 2]}
                tickFormatter={(value) => {
                  switch (value) {
                    case 2:
                      return 'Positive';
                    case 1:
                      return 'Neutral';
                    case 0:
                      return 'Negative';
                    default:
                      return '';
                  }
                }}
              />
              <YAxis
                yAxisId='count'
                orientation='right'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey='sentiment'
                fill={chartConfig.sentiment.color}
                stroke={chartConfig.sentiment.color}
                name='sentiment'
                yAxisId='sentiment'
                radius={[4, 4, 0, 0]}
                stackId='a'
              />
              <Bar
                yAxisId='count'
                dataKey='blockers'
                fill={chartConfig.blockers.color}
                stroke={chartConfig.blockers.color}
                name='blockers'
                radius={[4, 4, 0, 0]}
                stackId='b'
              />
              <Bar
                yAxisId='count'
                dataKey='actions'
                fill={chartConfig.actions.color}
                stroke={chartConfig.actions.color}
                name='actions'
                radius={[4, 4, 0, 0]}
                stackId='b'
              />
              <ChartLegend content={<ChartLegendContent />} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
