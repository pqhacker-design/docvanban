import { TextToSpeechProvider, TTSGenerateParams } from './types';
import { AudioChunkResult, ProviderType } from '../types';

export class GenericCloudProvider implements TextToSpeechProvider {
  id: ProviderType;
  name: string;

  constructor(id: ProviderType, name: string) {
    this.id = id;
    this.name = name;
  }

  isAvailable(): boolean {
    return true;
  }

  async generateSpeech({ text, options, apiKey, signal }: TTSGenerateParams): Promise<AudioChunkResult> {
    const response = await fetch('/api/tts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        provider: this.id,
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
      throw new Error(errJson.message || errJson.error || `Lỗi tạo âm thanh từ ${this.name}`);
    }

    const data = await response.json();
    return {
      id: `${this.id}-chunk-${Date.now()}`,
      textSnippet: text.substring(0, 40),
      audioBase64: data.audioBase64,
      mimeType: data.mimeType || 'audio/wav',
      durationSeconds: data.durationSeconds || Math.max(1, Math.round(text.length / 15))
    };
  }
}
