import { useCallback, useRef, useState } from 'react';

import { ConversationMessage } from '@/features/standup-calls/types';
import { useConversation } from '@11labs/react';

export function useStandupConversation() {
  const [transcription, setTranscription] = useState<ConversationMessage[]>([]);
  const [currentStep] = useState(1);
  const totalSteps = 3;
  const standupIdRef = useRef<string | null>(null);

  const conversation = useConversation({
    onConnect: async () => {
      try {
        // Create a new standup record
        const response = await fetch('/api/standups', {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error('Failed to create standup record');
        }
        const standup = await response.json();
        standupIdRef.current = standup.id;
      } catch (error) {
        console.error('Error in onConnect:', error);
      }
    },
    onDisconnect: async () => {
      try {
        if (standupIdRef.current) {
          // Update the standup record
          await fetch('/api/standups', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: standupIdRef.current,
              status: 'completed',
            }),
          });
        }
      } catch (error) {
        console.error('Error in onDisconnect:', error);
      }
    },
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
      const conversationId = await conversation.startSession({ signedUrl });

      // Create a conversation record
      await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: conversationId,
          agentId: process.env.NEXT_PUBLIC_AGENT_ID,
        }),
      });

      // Update the standup record with the conversation ID
      if (standupIdRef.current) {
        await fetch('/api/standups', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: standupIdRef.current,
            conversationId,
            status: 'in_progress',
          }),
        });
      }
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
