import React from 'react';
import { useTTS } from '../contexts/TTSContext';
import { 
  Mic2, 
  Wand2, 
  Layers, 
  Sparkles, 
  Sliders, 
  FileAudio, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  Volume2
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setActiveTab, history, selectedVoice } = useTTS();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900/60 via-slate-900 to-slate-950 border border-teal-500/30 p-8 sm:p-10 shadow-2xl space-y-5">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Powered by Google Gemini 3.1 AI
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Chuyển văn bản thành giọng nói AI tự nhiên & chân thực
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Hệ thống Studio TTS chuyên nghiệp thế hệ mới. Hỗ trợ đa ngôn ngữ, tự động làm sạch văn bản, phân đoạn thông minh và tùy chỉnh âm điệu linh hoạt.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 relative z-10">
          <button
            onClick={() => setActiveTab('studio')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-xl shadow-teal-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <Mic2 className="w-4 h-4" />
            <span>Mở Studio chuyển đổi</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
          >
            Cài đặt API Key cá nhân
          </button>
        </div>
      </div>

      {/* Quick Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <p className="text-xs text-slate-400 font-medium">Giọng đọc đang chọn</p>
          <h4 className="font-bold text-slate-100 text-base truncate flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{selectedVoice.displayName}</span>
          </h4>
          <p className="text-[11px] text-teal-400 font-mono">Provider: {selectedVoice.provider}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <p className="text-xs text-slate-400 font-medium">Lịch sử bản đọc</p>
          <h4 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <FileAudio className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{history.length} bài đã lưu</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-mono">Lưu trữ LocalStorage</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <p className="text-xs text-slate-400 font-medium">Trạng thái AI Engine</p>
          <h4 className="font-bold text-emerald-400 text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Gemini TTS 3.1 Ready</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-mono">Clean Architecture</p>
        </div>
      </div>

      {/* Core Feature Cards Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-teal-400" /> Tính năng vượt trội của Studio Pro
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-lg hover:border-teal-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center">
              <Wand2 className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-100 text-sm">AI Làm sạch & Chuẩn hóa văn bản</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tự động sửa khoảng trắng, chuẩn hóa số, ngày tháng, đơn vị đo lường và chuyển từ viết tắt (VD: TP.HCM → Thành phố Hồ Chí Minh).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-lg hover:border-teal-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-100 text-sm">Phân đoạn văn bản thông minh</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tự động chia nhỏ văn bản dài thành các đoạn tối ưu cho API, sau đó tự ghép lại thành một file audio duy nhất hoàn chỉnh.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-lg hover:border-teal-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-slate-100 text-sm">Điều chỉnh ngữ điệu chuyên sâu</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tùy chỉnh tốc độ (0.5x-2.0x), cao độ (-20 đến +20), âm lượng (0-200%), độ biểu cảm và chế độ đọc (Tin tức, Kể chuyện, MC, Podcast...).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
