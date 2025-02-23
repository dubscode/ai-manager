'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Mic, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export function CallScreen() {
  const [isListening, setIsListening] = useState(false);
  const [currentStep] = useState(1);
  const [transcription, setTranscription] = useState('');
  const totalSteps = 3;

  // Simulated AI question (in a real app, this would come from an AI service)
  const aiQuestion = 'Good morning! What did you work on yesterday?';

  useEffect(() => {
    // Simulated transcription (in a real app, this would use the Web Speech API)
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setTranscription((prev) => `${prev} ${generateRandomWord()}`);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const endStandup = () => {
    // Handle ending the standup early
    console.log('Standup ended early');
  };

  const generateRandomWord = () => {
    const words = [
      'worked',
      'on',
      'the',
      'project',
      'implemented',
      'features',
      'fixed',
      'bugs',
      'reviewed',
      'code',
    ];
    return words[Math.floor(Math.random() * words.length)];
  };

  return (
    <div className='flex min-h-screen flex-col bg-background text-white'>
      <header className='border-b border-slate-800 p-4'>
        <h1 className='text-xl font-bold'>Daily Standup</h1>
      </header>
      <main className='flex flex-1 flex-col items-center justify-center p-6'>
        <Card className='w-full max-w-2xl border-slate-800 bg-card'>
          <CardContent className='p-6'>
            <div className='mb-6 rounded-lg border border-primary bg-accent p-4 shadow-[0_0_10px_rgba(0,255,255,0.1)]'>
              <p className='text-lg font-medium text-primary'>{aiQuestion}</p>
            </div>
            <div className='mb-6 h-32 overflow-auto rounded-lg border border-slate-700 bg-secondary p-4'>
              <p className='text-sm text-muted-foreground'>
                {transcription || 'Your response will appear here...'}
              </p>
            </div>
            <div className='mb-6 flex justify-center'>
              <Button
                className={`h-16 w-16 rounded-full ${
                  isListening ? 'animate-pulse bg-red-500' : 'bg-cyan-500'
                } text-white hover:bg-cyan-600`}
                onClick={toggleListening}
              >
                <Mic
                  className={`h-8 w-8 ${isListening ? 'animate-bounce' : ''}`}
                />
                <span className='sr-only'>
                  {isListening ? 'Stop' : 'Start'} recording
                </span>
              </Button>
            </div>
            <div className='mb-6'>
              <div className='mb-2 flex justify-between text-sm text-slate-400'>
                <span>Progress</span>
                <span>
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <div className='h-2 rounded-full bg-slate-700'>
                <div
                  className='h-full rounded-full bg-cyan-500 transition-all duration-500 ease-in-out'
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
            <Button
              variant='outline'
              className='w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
              onClick={endStandup}
            >
              <X className='mr-2 h-4 w-4' />
              End Standup Early
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
