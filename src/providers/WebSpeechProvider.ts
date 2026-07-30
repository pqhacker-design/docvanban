import { TextToSpeechProvider, TTSGenerateParams } from './types';
import { AudioChunkResult } from '../types';

export class WebSpeechProvider implements TextToSpeechProvider {
  id = 'webspeech';
  name = 'Web Speech Synthesis (Browser)';

  isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  async generateSpeech({ text, options }: TTSGenerateParams): Promise<AudioChunkResult> {
    if (!this.isAvailable()) {
      throw new Error('Trình duyệt của bạn không hỗ trợ Web Speech Synthesis API');
    }

    return new Promise((resolve, reject) => {
      const synth = window.speechSynthesis;
      synth.cancel(); // Clear queued speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.5, Math.min(2.0, options.speed));
      utterance.pitch = Math.max(0.5, Math.min(1.5, 1 + options.pitch / 20));
      utterance.volume = Math.max(0, Math.min(1.0, options.volume / 100));

      if (options.languageCode) {
        utterance.lang = options.languageCode;
      }

      // Find best browser voice match if available
      const voices = synth.getVoices();
      if (voices.length > 0) {
        const matched = voices.find(v => 
          v.lang.toLowerCase().includes(options.languageCode.toLowerCase()) ||
          v.lang.toLowerCase().includes('vi')
        );
        if (matched) utterance.voice = matched;
      }

      utterance.onend = () => {
        // Return dummy result as browser Web Speech doesn't output raw audio file directly
        resolve({
          id: `webspeech-${Date.now()}`,
          textSnippet: text.substring(0, 40),
          audioBase64: '', // Handled directly by browser speech synthesis
          mimeType: 'audio/speech-synthesis',
          durationSeconds: Math.max(1, Math.round(text.length / 15))
        });
      };

      utterance.onerror = (e) => {
        reject(new Error(`Lỗi đọc giọng nói trình duyệt: ${e.error || 'không xác định'}`));
      };

      synth.speak(utterance);
    });
  }
}
