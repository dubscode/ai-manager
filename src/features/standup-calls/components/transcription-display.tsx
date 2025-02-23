import { ConversationMessage } from '@/features/standup-calls/types';

interface TranscriptionDisplayProps {
  transcription: ConversationMessage[];
}

export function TranscriptionDisplay({
  transcription,
}: TranscriptionDisplayProps) {
  return (
    <div className='min-h-[100px] max-h-[300px] xl:max-h-[400px] overflow-y-auto rounded-lg border border-slate-700 bg-secondary p-4'>
      {transcription.length === 0 ? (
        <p className='text-sm text-muted-foreground'>
          Your response will appear here...
        </p>
      ) : (
        <div className='flex flex-col gap-3'>
          {[...transcription].reverse().map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.source === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  message.source === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {message.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
