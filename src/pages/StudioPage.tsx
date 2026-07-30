import React from 'react';
import { useTTS } from '../contexts/TTSContext';
import { TextEditor } from '../components/tts/TextEditor';
import { VoiceSelector } from '../components/tts/VoiceSelector';
import { AudioAdjustments } from '../components/tts/AudioAdjustments';
import { AudioPlayer } from '../components/tts/AudioPlayer';
import { Play, Sparkles, RefreshCw } from 'lucide-react';

export const StudioPage: React.FC = () => {
  const { 
    generateSpeech, 
    isGenerating, 
    generationProgress, 
    generationStatusText,
    rawText 
  } = useTTS();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Step 1: Text Input & Editor */}
      <TextEditor />

      {/* Step 2: Voice & Adjustments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VoiceSelector />
        <AudioAdjustments />
      </div>

      {/* Step 3: Main Action Bar - Generate Speech */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-2xl space-y-4">
        {/* Progress Bar during generation */}
        {isGenerating && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-teal-400 animate-spin" />
                <span>{generationStatusText || 'Đang tạo âm thanh AI...'}</span>
              </span>
              <span className="font-bold text-teal-400 font-mono">{generationProgress}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-teal-500/50"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400 space-y-0.5">
            <p className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Sẵn sàng sinh âm thanh
            </p>
            <p>Hệ thống tự động điều chỉnh ngữ điệu, tần số mẫu và mã hóa chất lượng cao.</p>
          </div>

          <button
            onClick={generateSpeech}
            disabled={isGenerating || !rawText.trim()}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-teal-600/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Đang xử lý AI...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>Tạo giọng nói AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step 4: Output Player */}
      <AudioPlayer />
    </div>
  );
};
