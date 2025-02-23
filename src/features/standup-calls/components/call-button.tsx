import { Mic, MicOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CallButtonProps {
  isRecording: boolean;
  isSpeaking: boolean;
  onClick: () => void;
}

export function CallButton({
  isRecording,
  isSpeaking,
  onClick,
}: CallButtonProps) {
  return (
    <Button
      size='lg'
      variant='outline'
      className={cn(
        'relative mb-2 w-full',
        isRecording
          ? 'border-red-500 text-red-500 hover:bg-red-500'
          : 'border-cyan-500 text-cyan-500 hover:bg-cyan-500',
        'hover:text-white',
        isRecording && 'animate-none'
      )}
      onClick={onClick}
    >
      {isRecording && (
        <span className='absolute inset-0 rounded-lg bg-red-500/5 animate-[pulse_2s_ease-in-out_infinite]' />
      )}
      {isSpeaking && (
        <span className='absolute inset-0 rounded-lg bg-cyan-500/10 animate-[pulse_2s_ease-in-out_infinite]' />
      )}
      <span
        className={cn(
          'flex items-center justify-center',
          isRecording && 'animate-pulse',
          isSpeaking && 'animate-bounce'
        )}
      >
        {isRecording ? (
          <MicOff className='mr-2 h-5 w-5' />
        ) : (
          <Mic className='mr-2 h-5 w-5' />
        )}
        {isRecording ? 'Stop Standup Meeting' : 'Start Standup Meeting'}
      </span>
    </Button>
  );
}
