import React from 'react';
import { useTTS } from '../../contexts/TTSContext';
import { EmotionType, StyleMode, QualitySetting } from '../../types';
import { Sliders, Gauge, Volume2, Smile, Radio, Sparkles, Zap } from 'lucide-react';

export const AudioAdjustments: React.FC = () => {
  const { options, setOptions } = useTTS();

  const emotions: { id: EmotionType; label: string }[] = [
    { id: 'neutral', label: 'Tự nhiên (Neutral)' },
    { id: 'happy', label: 'Vui vẻ (Happy)' },
    { id: 'sad', label: 'Trầm tư (Sad)' },
    { id: 'energetic', label: 'Hào hứng (Energetic)' },
    { id: 'professional', label: 'Trang trọng (Professional)' },
    { id: 'storytelling', label: 'Truyền cảm (Storytelling)' },
    { id: 'news', label: 'Thời sự (News)' },
    { id: 'teaching', label: 'Giảng bài (Teaching)' },
    { id: 'audiobook', label: 'Sách nói (Audiobook)' },
  ];

  const styleModes: { id: StyleMode; label: string; desc: string }[] = [
    { id: 'normal', label: 'Bình thường', desc: 'Ngữ điệu tự nhiên tiêu chuẩn' },
    { id: 'news', label: 'Tin tức', desc: 'Rõ ràng, dứt khoát, chuẩn báo chí' },
    { id: 'storytelling', label: 'Kể chuyện', desc: 'Nhấn nhá theo từng tình tiết' },
    { id: 'teacher', label: 'Giáo viên', desc: 'Rõ từ, tốc độ vừa phải dễ hiểu' },
    { id: 'mc', label: 'MC Sự kiện', desc: 'Năng lượng, vang vọng, truyền cảm' },
    { id: 'podcast', label: 'Podcast', desc: 'Gần gũi, tâm sự, nhẹ nhàng' },
    { id: 'voiceover', label: 'Thuyết minh', desc: 'Chuẩn khớp thời lượng hình ảnh' },
    { id: 'advertising', label: 'Quảng cáo', desc: 'Sôi nổi, thu hút sự chú ý' },
  ];

  const qualities: { id: QualitySetting; label: string; desc: string }[] = [
    { id: 'standard', label: 'Standard', desc: 'Tiết kiệm dung lượng (22kHz)' },
    { id: 'hd', label: 'HD (Khuyên dùng)', desc: 'Chất lượng cao mượt mà (24kHz)' },
    { id: 'ultra_hd', label: 'Ultra HD', desc: 'Độ chi tiết phòng thu (48kHz)' },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-5 shadow-xl">
      {/* Title */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <Sliders className="w-5 h-5 text-teal-400" />
        <h3 className="font-bold text-slate-100 text-base">Điều chỉnh giọng đọc & Ngữ điệu AI</h3>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Speed Slider */}
        <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-teal-400" /> Tốc độ đọc
            </label>
            <span className="font-bold text-teal-300 font-mono">{options.speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={options.speed}
            onChange={(e) => setOptions(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
            className="w-full accent-teal-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0.5x (Chậm)</span>
            <span>1.0x (N)</span>
            <span>2.0x (Nhanh)</span>
          </div>
        </div>

        {/* Pitch Slider */}
        <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-teal-400" /> Cao độ (Pitch)
            </label>
            <span className="font-bold text-teal-300 font-mono">
              {options.pitch > 0 ? `+${options.pitch}` : options.pitch}
            </span>
          </div>
          <input
            type="range"
            min="-20"
            max="20"
            step="1"
            value={options.pitch}
            onChange={(e) => setOptions(prev => ({ ...prev, pitch: parseInt(e.target.value, 10) }))}
            className="w-full accent-teal-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-20 (Trầm)</span>
            <span>0 (Chuẩn)</span>
            <span>+20 (Bổng)</span>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-teal-400" /> Âm lượng
            </label>
            <span className="font-bold text-teal-300 font-mono">{options.volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="5"
            value={options.volume}
            onChange={(e) => setOptions(prev => ({ ...prev, volume: parseInt(e.target.value, 10) }))}
            className="w-full accent-teal-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0%</span>
            <span>100% (Tiêu chuẩn)</span>
            <span>200%</span>
          </div>
        </div>
      </div>

      {/* Style Mode Selection Grid */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-teal-400" /> Chế độ đọc (Style Mode)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {styleModes.map((mode) => {
            const isSelected = options.styleMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setOptions(prev => ({ ...prev, styleMode: mode.id }))}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-teal-950/50 border-teal-500 text-teal-200 shadow-sm ring-1 ring-teal-500/40'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <p className="text-xs font-semibold">{mode.label}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{mode.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expression & Quality */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Emotion / Expression Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-teal-400" /> Độ biểu cảm (Emotion)
          </label>
          <select
            value={options.emotion}
            onChange={(e) => setOptions(prev => ({ ...prev, emotion: e.target.value as EmotionType }))}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-teal-500"
          >
            {emotions.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quality Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Chất lượng xuất ra
          </label>
          <select
            value={options.quality}
            onChange={(e) => setOptions(prev => ({ ...prev, quality: e.target.value as QualitySetting }))}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-teal-500"
          >
            {qualities.map((q) => (
              <option key={q.id} value={q.id}>
                {q.label} - {q.desc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Toggles: Intonation / Emphasis & Pause */}
      <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
          <span className="text-xs font-medium text-slate-300">Tự động nhấn nhá theo dấu câu (,.?!)</span>
          <input
            type="checkbox"
            checked={options.punctuationEmphasis}
            onChange={(e) => setOptions(prev => ({ ...prev, punctuationEmphasis: e.target.checked }))}
            className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
          <span className="text-xs font-medium text-slate-300">Tự động ngắt nghỉ giữa các đoạn văn</span>
          <input
            type="checkbox"
            checked={options.autoPause}
            onChange={(e) => setOptions(prev => ({ ...prev, autoPause: e.target.checked }))}
            className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
