import { NextResponse } from 'next/server';

const ELEVEN_LABS_API_KEY = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY;
const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Available voices
const VOICES = {
  'Rachel': '21m00Tcm4TlvDq8ikWAM',
  'Domi': 'AZnzlk1XvdvUeBnXmlld',
  'Bella': 'EXAVITQu4vr4xnSDxMaL',
  'Antoni': 'ErXwobaYiN019PkySvjV',
  'Josh': 'Josh',
  'Arnold': 'Arnold',
  'Adam': 'Adam',
  'Sam': 'Sam',
};

export async function POST(request: Request) {
  try {
    const { text, voice = 'Rachel', stability = 0.5, similarity_boost = 0.5 } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const voiceId = VOICES[voice as keyof typeof VOICES];
    if (!voiceId) {
      return NextResponse.json(
        { error: 'Invalid voice selected' },
        { status: 400 }
      );
    }

    const response = await fetch(`${ELEVEN_LABS_API_URL}/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_LABS_API_KEY || '',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: Number(stability),
          similarity_boost: Number(similarity_boost),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
} 