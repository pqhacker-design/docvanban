import { TextToSpeechProvider } from './types';
import { GeminiProvider } from './GeminiProvider';
import { WebSpeechProvider } from './WebSpeechProvider';
import { GenericCloudProvider } from './GenericCloudProvider';
import { ProviderType } from '../types';

export function getTTSProvider(type: ProviderType): TextToSpeechProvider {
  switch (type) {
    case 'gemini':
      return new GeminiProvider();
    case 'webspeech':
      return new WebSpeechProvider();
    case 'elevenlabs':
      return new GenericCloudProvider('elevenlabs', 'ElevenLabs AI Voice');
    case 'openai':
      return new GenericCloudProvider('openai', 'OpenAI Text-to-Speech');
    case 'google-cloud':
      return new GenericCloudProvider('google-cloud', 'Google Cloud Text-to-Speech');
    case 'azure':
      return new GenericCloudProvider('azure', 'Microsoft Azure Speech');
    case 'amazon-polly':
      return new GenericCloudProvider('amazon-polly', 'Amazon Polly');
    default:
      return new GeminiProvider();
  }
}
