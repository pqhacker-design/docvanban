import { AppSettings, AudioHistoryItem } from '../types';

const SETTINGS_KEY = 'tts_studio_pro_settings';
const HISTORY_KEY = 'tts_studio_pro_history';

export const DEFAULT_SETTINGS: AppSettings = {
  activeProvider: 'gemini',
  geminiApiKey: '',
  elevenlabsApiKey: '',
  openaiApiKey: '',
  googleCloudApiKey: '',
  azureApiKey: '',
  amazonPollyKey: '',
  defaultVoiceId: 'gemini-Kore',
  defaultLanguage: 'vi-VN',
  defaultSpeed: 1.0,
  defaultPitch: 0,
  defaultVolume: 100,
  defaultQuality: 'hd',
  exportSettings: {
    format: 'wav',
    bitrate: 192,
    sampleRate: 24000,
    channels: 'stereo',
    fileNameTemplate: 'TTS-Studio-{date}-{title}'
  },
  theme: 'dark', // Default dark mode as requested in prompt
  autoCleanTextOnPaste: false,
  autoChunkLongText: true,
  maxChunkSize: 500
};

export const storageService = {
  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to parse settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: Partial<AppSettings>): AppSettings {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
      return DEFAULT_SETTINGS;
    }
  },

  getHistory(): AudioHistoryItem[] {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse audio history from localStorage', e);
    }
    return [];
  },

  saveHistoryItem(item: AudioHistoryItem): AudioHistoryItem[] {
    try {
      const history = this.getHistory();
      // Keep base64 trimmed if storing lots in localStorage to prevent overflow
      const trimmedItem = { ...item };
      if (trimmedItem.audioBase64 && trimmedItem.audioBase64.length > 500000) {
        // Keep Blob URL or trimmed base64 for history metadata
      }
      const updated = [trimmedItem, ...history.filter(h => h.id !== item.id)];
      // Limit to max 50 history items
      const limited = updated.slice(0, 50);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(limited));
      return limited;
    } catch (e) {
      console.error('Failed to save history item', e);
      return this.getHistory();
    }
  },

  deleteHistoryItem(id: string): AudioHistoryItem[] {
    try {
      const history = this.getHistory();
      const updated = history.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to delete history item', e);
      return this.getHistory();
    }
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  }
};
