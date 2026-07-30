import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  NavigationTab, 
  TTSOptions, 
  AppSettings, 
  AudioHistoryItem, 
  TextChunk, 
  VoiceOption, 
  TextCleanResult,
  ExportSettings
} from '../types';
import { storageService } from '../services/storageService';
import { VOICE_CATALOG } from '../data/voices';
import { getTTSProvider } from '../providers';
import { 
  splitTextIntoChunks, 
  base64ToBlobUrl, 
  pcmToWavBlob, 
  concatenateAudioBlobs, 
  estimateReadingTime,
  formatFileSize 
} from '../lib/utils';

import { ApiKeyModal } from '../components/common/ApiKeyModal';

interface ActiveAudioState {
  id?: string;
  title: string;
  url: string;
  blob?: Blob;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  playbackRate: number;
}

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface TTSContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  rawText: string;
  setRawText: (text: string) => void;
  cleanedText: string;
  setCleanedText: (text: string) => void;
  useCleanedText: boolean;
  setUseCleanedText: (val: boolean) => void;
  
  // Options & Voice
  selectedVoice: VoiceOption;
  setSelectedVoice: (voice: VoiceOption) => void;
  options: TTSOptions;
  setOptions: React.Dispatch<React.SetStateAction<TTSOptions>>;
  
  // Settings & History
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  history: AudioHistoryItem[];
  saveToHistory: (item: AudioHistoryItem) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  
  // Chunking
  chunks: TextChunk[];
  
  // Audio Player State
  currentAudio: ActiveAudioState | null;
  playAudio: (audioUrl?: string, title?: string, blob?: Blob) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  seekAudio: (seconds: number) => void;
  setAudioVolume: (val: number) => void;
  setAudioPlaybackRate: (rate: number) => void;
  
  // Operations
  isGenerating: boolean;
  generationProgress: number;
  generationStatusText: string;
  generateSpeech: () => Promise<void>;
  
  // AI Cleaning
  isCleaningText: boolean;
  lastCleanResult: TextCleanResult | null;
  cleanTextWithAI: () => Promise<void>;
  
  // Notifications
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // File Import
  handleFileImport: (file: File) => Promise<void>;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('studio');
  const [settings, setSettingsState] = useState<AppSettings>(() => storageService.getSettings());
  const [history, setHistory] = useState<AudioHistoryItem[]>(() => storageService.getHistory());
  
  const [rawText, setRawText] = useState<string>(
    'Xin chào! Đây là AI Text-to-Speech Studio Pro. Bạn có thể nhập bất kỳ đoạn văn bản nào, AI sẽ làm sạch và chuyển đổi thành giọng nói vô cùng tự nhiên và truyền cảm bằng công nghệ Gemini AI.'
  );
  const [cleanedText, setCleanedText] = useState<string>('');
  const [useCleanedText, setUseCleanedText] = useState<boolean>(false);

  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(() => {
    const found = VOICE_CATALOG.find(v => v.id === settings.defaultVoiceId);
    return found || VOICE_CATALOG[0];
  });

  const [options, setOptions] = useState<TTSOptions>({
    voiceId: settings.defaultVoiceId,
    languageCode: settings.defaultLanguage,
    speed: settings.defaultSpeed,
    pitch: settings.defaultPitch,
    volume: settings.defaultVolume,
    emotion: 'neutral',
    styleMode: 'normal',
    quality: settings.defaultQuality,
    punctuationEmphasis: true,
    autoPause: true
  });

  const [chunks, setChunks] = useState<TextChunk[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStatusText, setGenerationStatusText] = useState<string>('');
  
  const [isCleaningText, setIsCleaningText] = useState<boolean>(false);
  const [lastCleanResult, setLastCleanResult] = useState<TextCleanResult | null>(null);

  const [currentAudio, setCurrentAudio] = useState<ActiveAudioState | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Update chunks whenever active text or maxChunkSize changes
  useEffect(() => {
    const textToChunk = useCleanedText && cleanedText ? cleanedText : rawText;
    const computed = splitTextIntoChunks(textToChunk, settings.maxChunkSize);
    setChunks(computed);
  }, [rawText, cleanedText, useCleanedText, settings.maxChunkSize]);

  // Audio HTML5 element setup
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentAudio(prev => prev ? { ...prev, currentTime: audio.currentTime } : null);
    };

    const handleLoadedMetadata = () => {
      setCurrentAudio(prev => prev ? { ...prev, duration: audio.duration || prev.duration } : null);
    };

    const handleEnded = () => {
      setCurrentAudio(prev => prev ? { ...prev, isPlaying: false, currentTime: 0 } : null);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = storageService.saveSettings(newSettings);
    setSettingsState(updated);
    showToast('Đã lưu cấu hình cài đặt!', 'success');
  };

  const saveToHistory = (item: AudioHistoryItem) => {
    const updated = storageService.saveHistoryItem(item);
    setHistory(updated);
  };

  const deleteHistoryItem = (id: string) => {
    const updated = storageService.deleteHistoryItem(id);
    setHistory(updated);
    showToast('Đã xóa tập tin khỏi lịch sử', 'info');
  };

  const clearHistory = () => {
    storageService.clearHistory();
    setHistory([]);
    showToast('Đã xóa toàn bộ lịch sử', 'info');
  };

  // Audio Player Controls
  const playAudio = (audioUrl?: string, title?: string, blob?: Blob) => {
    if (!audioRef.current) return;

    if (audioUrl && (!currentAudio || currentAudio.url !== audioUrl)) {
      audioRef.current.src = audioUrl;
      audioRef.current.playbackRate = options.speed;
      audioRef.current.volume = Math.min(1.0, options.volume / 100);
      
      const newAudioState: ActiveAudioState = {
        title: title || 'Bản thu giọng nói AI',
        url: audioUrl,
        blob,
        duration: audioRef.current.duration || 0,
        currentTime: 0,
        isPlaying: true,
        volume: options.volume,
        playbackRate: options.speed
      };
      
      setCurrentAudio(newAudioState);
      audioRef.current.play().catch(err => {
        console.error('Play error', err);
        showToast('Không thể phát âm thanh', 'error');
      });
    } else if (currentAudio) {
      audioRef.current.play();
      setCurrentAudio(prev => prev ? { ...prev, isPlaying: true } : null);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentAudio(prev => prev ? { ...prev, isPlaying: false } : null);
    }
  };

  const resumeAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setCurrentAudio(prev => prev ? { ...prev, isPlaying: true } : null);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentAudio(prev => prev ? { ...prev, isPlaying: false, currentTime: 0 } : null);
    }
  };

  const seekAudio = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentAudio(prev => prev ? { ...prev, currentTime: seconds } : null);
    }
  };

  const setAudioVolume = (val: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1.0, val / 100));
      setCurrentAudio(prev => prev ? { ...prev, volume: val } : null);
    }
  };

  const setAudioPlaybackRate = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setCurrentAudio(prev => prev ? { ...prev, playbackRate: rate } : null);
    }
  };

  // AI Text Cleaner
  const cleanTextWithAI = async () => {
    const textToClean = rawText.trim();
    if (!textToClean) {
      showToast('Vui lòng nhập văn bản trước khi làm sạch', 'warning');
      return;
    }

    if (!settings.geminiApiKey || !settings.geminiApiKey.trim()) {
      showToast('Vui lòng nhập Gemini API Key cá nhân của bạn để sử dụng!', 'warning');
      setPendingAction(() => () => cleanTextWithAI());
      setIsKeyModalOpen(true);
      return;
    }

    setIsCleaningText(true);
    try {
      const res = await fetch('/api/tts/clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToClean,
          apiKey: settings.geminiApiKey
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Lỗi từ dịch vụ AI' }));
        throw new Error(errorData.error || 'Lỗi từ dịch vụ AI làm sạch văn bản');
      }

      const data: TextCleanResult = await res.json();
      setCleanedText(data.cleanedText);
      setLastCleanResult(data);
      setUseCleanedText(true);
      showToast('AI đã tối ưu hóa văn bản thành công!', 'success');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Lỗi không xác định';
      showToast(`Không thể làm sạch văn bản: ${message}`, 'error');
    } finally {
      setIsCleaningText(false);
    }
  };

  // TTS Speech Generation
  const generateSpeech = async () => {
    const activeText = useCleanedText && cleanedText ? cleanedText : rawText;
    const cleanText = activeText.trim();

    if (!cleanText) {
      showToast('Vui lòng nhập nội dung văn bản để chuyển thành giọng nói', 'warning');
      return;
    }

    if (selectedVoice.provider === 'gemini' && (!settings.geminiApiKey || !settings.geminiApiKey.trim())) {
      showToast('Bạn cần nhập Gemini API Key cá nhân của mình để tạo giọng nói!', 'warning');
      setPendingAction(() => () => generateSpeech());
      setIsKeyModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStatusText('Đang khởi tạo các phân đoạn âm thanh...');

    try {
      const provider = getTTSProvider(selectedVoice.provider || settings.activeProvider);
      
      // Select API key according to provider
      let providerKey = settings.geminiApiKey;
      if (selectedVoice.provider === 'elevenlabs') providerKey = settings.elevenlabsApiKey;
      else if (selectedVoice.provider === 'openai') providerKey = settings.openaiApiKey;
      else if (selectedVoice.provider === 'google-cloud') providerKey = settings.googleCloudApiKey;

      const currentChunks = splitTextIntoChunks(cleanText, settings.maxChunkSize);
      const totalChunks = currentChunks.length;
      const audioBlobs: Blob[] = [];

      for (let i = 0; i < totalChunks; i++) {
        const chunk = currentChunks[i];
        setGenerationStatusText(`Đang xử lý phân đoạn ${i + 1}/${totalChunks}...`);
        
        // Progress percentage
        const progress = Math.round(((i) / totalChunks) * 100);
        setGenerationProgress(progress);

        const currentOptions = { ...options, voiceId: selectedVoice.id };
        const chunkResult = await provider.generateSpeech({
          text: chunk.text,
          options: currentOptions,
          apiKey: providerKey
        });

        if (chunkResult.audioBase64) {
          // Convert PCM or base64 to Blob
          if (chunkResult.mimeType.includes('pcm') || chunkResult.mimeType.includes('wav')) {
            const blob = pcmToWavBlob(chunkResult.audioBase64, 24000);
            audioBlobs.push(blob);
          } else {
            const blobUrl = base64ToBlobUrl(chunkResult.audioBase64, chunkResult.mimeType);
            const res = await fetch(blobUrl);
            const blob = await res.blob();
            audioBlobs.push(blob);
          }
        }
      }

      setGenerationProgress(95);
      setGenerationStatusText('Đang hoàn tất ghép nối file âm thanh...');

      // Combine audio blobs if multiple chunks
      const combinedBlob = await concatenateAudioBlobs(audioBlobs, 'audio/wav');
      const finalUrl = URL.createObjectURL(combinedBlob);

      setGenerationProgress(100);
      setGenerationStatusText('Hoàn tất!');

      const estimated = estimateReadingTime(cleanText, options.speed);
      const titleSnippet = cleanText.substring(0, 30).replace(/[^a-zA-Z0-01-9àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ\s]/g, '') || 'VoiceAudio';
      const nowFormatted = new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const historyItem: AudioHistoryItem = {
        id: `audio-${Date.now()}`,
        title: titleSnippet,
        rawText,
        cleanedText: useCleanedText ? cleanedText : undefined,
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.displayName,
        languageCode: selectedVoice.languageCode,
        languageName: selectedVoice.languageName,
        provider: selectedVoice.provider,
        createdAt: nowFormatted,
        durationSeconds: estimated.seconds,
        characterCount: cleanText.length,
        wordCount: cleanText.split(/\s+/).filter(Boolean).length,
        speed: options.speed,
        pitch: options.pitch,
        quality: options.quality,
        format: settings.exportSettings.format,
        audioUrl: finalUrl,
        mimeType: combinedBlob.type,
        fileSizeFormatted: formatFileSize(combinedBlob.size)
      };

      saveToHistory(historyItem);
      playAudio(finalUrl, titleSnippet, combinedBlob);
      showToast('Đã tạo giọng nói AI thành công! Đang phát thử...', 'success');
    } catch (e: unknown) {
      console.error('Speech generation failed', e);
      const message = e instanceof Error ? e.message : 'Lỗi không xác định';
      showToast(`Không thể sinh âm thanh: ${message}`, 'error');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleFileImport = async (file: File) => {
    try {
      showToast(`Đang trích xuất văn bản từ ${file.name}...`, 'info');
      const { extractTextFromFile } = await import('../services/fileExtractionService');
      const result = await extractTextFromFile(file);
      setRawText(result.text);
      setUseCleanedText(false);
      setCleanedText('');
      showToast(`Đã tải lên văn bản từ file ${file.name} (${result.text.length} ký tự)!`, 'success');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Lỗi đọc file';
      showToast(message, 'error');
    }
  };

  return (
    <TTSContext.Provider
      value={{
        activeTab,
        setActiveTab,
        rawText,
        setRawText,
        cleanedText,
        setCleanedText,
        useCleanedText,
        setUseCleanedText,
        selectedVoice,
        setSelectedVoice,
        options,
        setOptions,
        settings,
        updateSettings,
        history,
        saveToHistory,
        deleteHistoryItem,
        clearHistory,
        chunks,
        currentAudio,
        playAudio,
        pauseAudio,
        resumeAudio,
        stopAudio,
        seekAudio,
        setAudioVolume,
        setAudioPlaybackRate,
        isGenerating,
        generationProgress,
        generationStatusText,
        generateSpeech,
        isCleaningText,
        lastCleanResult,
        cleanTextWithAI,
        toasts,
        showToast,
        removeToast,
        handleFileImport
      }}
    >
      {children}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSaveAndContinue={() => {
          if (pendingAction) {
            const action = pendingAction;
            setPendingAction(null);
            action();
          }
        }}
      />
    </TTSContext.Provider>
  );
};

export const useTTS = () => {
  const context = useContext(TTSContext);
  if (!context) throw new Error('useTTS must be used within TTSProvider');
  return context;
};
