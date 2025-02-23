'use client';

import { Card, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { CallButton } from './call-button';
import { ConversationMessage } from '@/features/standups/types';
import { Header } from './header';
import { TestTube } from 'lucide-react';
import { TranscriptionDisplay } from './transcription-display';
import { useStandupConversation } from '@/features/standups/hooks/use-standup-conversation';
import { useState } from 'react';

const TEST_MESSAGES: ConversationMessage[] = [
  { source: 'ai', message: 'Good morning! What did you work on yesterday?' },
  {
    source: 'user',
    message:
      'Yesterday I worked on the new authentication system. I implemented OAuth with Google and added some unit tests.',
  },
  {
    source: 'ai',
    message: 'That sounds productive! Any challenges you encountered?',
  },
  {
    source: 'user',
    message:
      'Yes, I had some issues with token refresh logic but managed to solve it by implementing a better error handling system.',
  },
  {
    source: 'ai',
    message: 'Great solution! What are you planning to work on today?',
  },
  {
    source: 'user',
    message:
      "Today I'll be focusing on implementing the user profile page and adding the ability to update user settings.",
  },
  {
    source: 'ai',
    message: 'Sounds good! Any blockers or things you need help with?',
  },
  {
    source: 'user',
    message:
      'Not at the moment, but I might need a design review for the profile page layout once I have the initial version ready.',
  },
  {
    source: 'ai',
    message:
      "Perfect, I'll make sure to schedule that. Is there anything else you'd like to discuss?",
  },
  { source: 'user', message: 'No, that covers everything for now. Thanks!' },
];

export function CallScreen() {
  const {
    transcription,
    isRecording,
    isSpeaking,
    startRecording,
    stopRecording,
  } = useStandupConversation();
  const [useTestData, setUseTestData] = useState(false);

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const displayedTranscription = useTestData ? TEST_MESSAGES : transcription;

  return (
    <div className='flex h-screen flex-col overflow-hidden bg-background text-white'>
      <Header />
      <main className='flex-1 p-4'>
        <Card className='h-full w-full border-slate-800 bg-card'>
          <CardContent className='flex h-full flex-col gap-4 p-6'>
            <div className='flex gap-2'>
              <CallButton
                isRecording={isRecording}
                isSpeaking={isSpeaking}
                onClick={handleToggleRecording}
              />
              <Button
                variant='ghost'
                size='icon'
                className='shrink-0'
                onClick={() => setUseTestData(!useTestData)}
                title={
                  useTestData ? 'Show real messages' : 'Show test messages'
                }
              >
                <TestTube className='h-5 w-5' />
              </Button>
            </div>
            <div className='flex-1 min-h-[100px] overflow-hidden'>
              <TranscriptionDisplay transcription={displayedTranscription} />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
