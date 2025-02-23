import { ElevenLabsClient } from 'elevenlabs';

export const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});
