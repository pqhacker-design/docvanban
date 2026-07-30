import { TextToSpeechProvider, TTSGenerateParams } from './types';
import { AudioChunkResult } from '../types';

export class GeminiProvider implements TextToSpeechProvider {
  id = 'gemini';
  name = 'Google Gemini 3.1 TTS';

  isAvailable(): boolean {
    return true; // Supported server-side via Gemini API or API Key
  }

  async generateSpeech({ text, options, apiKey, signal }: TTSGenerateParams): Promise<AudioChunkResult> {
    const response = await fetch('/api/tts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voiceId: options.voiceId,
        languageCode: options.languageCode,
        speed: options.speed,
        pitch: options.pitch,
        volume: options.volume,
        emotion: options.emotion,
        styleMode: options.styleMode,
        quality: options.quality,
        apiKey
      }),
      signal
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errJson.message || errJson.error || 'Lỗi tạo âm thanh Gemini TTS');
    }

    const data = await response.json();
    return {
      id: `gemini-chunk-${Date.now()}`,
      textSnippet: text.substring(0, 40),
      audioBase64: data.audioBase64,
      mimeType: data.mimeType || 'audio/wav',
      durationSeconds: data.durationSeconds || Math.max(1, Math.round(text.length / 15))
    };
  }
}
