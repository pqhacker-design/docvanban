import { TTSOptions, AudioChunkResult } from '../types';

export interface TTSGenerateParams {
  text: string;
  options: TTSOptions;
  apiKey?: string;
  signal?: AbortSignal;
}

export interface TextToSpeechProvider {
  id: string;
  name: string;
  generateSpeech(params: TTSGenerateParams): Promise<AudioChunkResult>;
  isAvailable(): boolean;
}
