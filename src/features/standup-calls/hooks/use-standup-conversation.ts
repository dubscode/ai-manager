import { useCallback, useState } from 'react';

import { ConversationMessage } from '@/features/standup-calls/types';
import { useConversation } from '@11labs/react';

export function useStandupConversation() {
  const [transcription, setTranscription] = useState<ConversationMessage[]>([]);
  const [currentStep] = useState(1);
  const totalSteps = 3;

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message: ConversationMessage) => {
      console.log('Message:', message);
      setTranscription((prev) => [...prev, message]);
    },
    onError: (error: Error) => console.error('Error:', error),
  });

  const getSignedUrl = async (): Promise<string> => {
    const response = await fetch('/api/get-signed-url');
    if (!response.ok) {
      throw new Error(`Failed to get signed url: ${response.statusText}`);
    }
    const { signedUrl } = await response.json();
    return signedUrl;
  };

  const startRecording = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const signedUrl = await getSignedUrl();
      await conversation.startSession({ signedUrl });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopRecording = useCallback(async () => {
    await conversation.endSession();
    // Additional cleanup or navigation logic here
  }, [conversation]);

  return {
    transcription,
    currentStep,
    totalSteps,
    isRecording: conversation.status === 'connected',
    isSpeaking: conversation.isSpeaking,
    startRecording,
    stopRecording,
  };
}
