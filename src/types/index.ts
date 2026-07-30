export type NavigationTab = 'home' | 'studio' | 'files' | 'history' | 'settings';

export type ProviderType = 
  | 'gemini' 
  | 'google-cloud' 
  | 'openai' 
  | 'elevenlabs' 
  | 'azure' 
  | 'amazon-polly' 
  | 'webspeech';

export type Gender = 'male' | 'female' | 'neutral';
export type RegionTag = 'Miền Bắc' | 'Miền Nam' | 'Miền Trung' | 'Toàn Quốc';

export type EmotionType = 
  | 'neutral' 
  | 'happy' 
  | 'sad' 
  | 'energetic' 
  | 'professional' 
  | 'storytelling' 
  | 'news' 
  | 'teaching' 
  | 'audiobook';

export type StyleMode = 
  | 'normal' 
  | 'news' 
  | 'storytelling' 
  | 'teacher' 
  | 'mc' 
  | 'podcast' 
  | 'voiceover' 
  | 'advertising';

export type QualitySetting = 'standard' | 'hd' | 'ultra_hd';

export type ExportFormat = 'mp3' | 'wav' | 'ogg' | 'aac' | 'flac';

export type AudioChannel = 'mono' | 'stereo';

export interface VoiceOption {
  id: string;
  name: string;
  displayName: string;
  languageCode: string;
  languageName: string;
  gender: Gender;
  provider: ProviderType;
  region?: RegionTag;
  sampleText?: string;
  previewAudioUrl?: string;
  description?: string;
  tags?: string[];
}

export interface TTSOptions {
  voiceId: string;
  languageCode: string;
  speed: number; // 0.5 to 2.0
  pitch: number; // -20 to +20
  volume: number; // 0 to 200 (%)
  emotion: EmotionType;
  styleMode: StyleMode;
  quality: QualitySetting;
  punctuationEmphasis: boolean;
  autoPause: boolean;
}

export interface ExportSettings {
  format: ExportFormat;
  bitrate: number; // 64, 128, 192, 256, 320 kbps
  sampleRate: number; // 22050, 24000, 44100, 48000
  channels: AudioChannel;
  fileNameTemplate: string;
}

export interface AudioChunkResult {
  id: string;
  textSnippet: string;
  audioBase64: string;
  mimeType: string;
  durationSeconds: number;
}

export interface AudioHistoryItem {
  id: string;
  title: string;
  rawText: string;
  cleanedText?: string;
  voiceId: string;
  voiceName: string;
  languageCode: string;
  languageName: string;
  provider: ProviderType;
  createdAt: string;
  durationSeconds: number;
  characterCount: number;
  wordCount: number;
  speed: number;
  pitch: number;
  quality: QualitySetting;
  format: ExportFormat;
  audioUrl: string; // Blob URL or Data URI
  audioBase64?: string;
  mimeType: string;
  fileSizeFormatted: string;
}

export interface TextCleanResult {
  originalText: string;
  cleanedText: string;
  modifications: {
    type: 'abbreviation' | 'punctuation' | 'whitespace' | 'date' | 'unit' | 'number';
    original: string;
    replacedWith: string;
  }[];
  characterDiff: number;
}

export interface TextChunk {
  id: string;
  index: number;
  text: string;
  characterCount: number;
  wordCount: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  audioBase64?: string;
  errorMessage?: string;
}

export interface AppSettings {
  activeProvider: ProviderType;
  geminiApiKey: string;
  elevenlabsApiKey: string;
  openaiApiKey: string;
  googleCloudApiKey: string;
  azureApiKey: string;
  amazonPollyKey: string;
  defaultVoiceId: string;
  defaultLanguage: string;
  defaultSpeed: number;
  defaultPitch: number;
  defaultVolume: number;
  defaultQuality: QualitySetting;
  exportSettings: ExportSettings;
  theme: 'light' | 'dark' | 'system';
  autoCleanTextOnPaste: boolean;
  autoChunkLongText: boolean;
  maxChunkSize: number; // Max characters per chunk (e.g. 500)
}

export interface ProviderInfo {
  id: ProviderType;
  name: string;
  description: string;
  requiresApiKey: boolean;
  keyName?: string;
  supportedFormats: ExportFormat[];
  badge?: string;
}
