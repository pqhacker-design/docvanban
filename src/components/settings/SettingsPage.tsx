import React, { useState } from 'react';
import { useTTS } from '../../contexts/TTSContext';
import { PROVIDERS_LIST } from '../../data/voices';
import { ProviderType, ExportFormat } from '../../types';
import { Key, Settings, ShieldCheck, Sparkles, RefreshCw, Eye, EyeOff, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, showToast } = useTTS();

  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || '');
  const [elevenlabsKey, setElevenlabsKey] = useState(settings.elevenlabsApiKey || '');
  const [openaiKey, setOpenaiKey] = useState(settings.openaiApiKey || '');

  const [showGemini, setShowGemini] = useState(false);
  const [showElevenlabs, setShowElevenlabs] = useState(false);

  const handleSaveKeys = () => {
    updateSettings({
      geminiApiKey: geminiKey,
      elevenlabsApiKey: elevenlabsKey,
      openaiApiKey: openaiKey
    });
  };

  const handleResetSettings = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại tất cả cài đặt về mặc định?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900/40 via-slate-900 to-slate-900 p-6 rounded-2xl border border-teal-500/30 space-y-2 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg">Cấu hình hệ thống & API Key</h3>
            <p className="text-xs text-slate-400">
              Quản lý các nhà cung cấp TTS AI, mã bảo mật API Key và tùy chọn chất lượng xuất file.
            </p>
          </div>
        </div>
      </div>

      {/* Provider Selector Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2 pb-3 border-b border-slate-800">
          <Sparkles className="w-4 h-4 text-teal-400" /> Nhà cung cấp TTS mặc định
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PROVIDERS_LIST.map((provider) => {
            const isSelected = settings.activeProvider === provider.id;
            return (
              <div
                key={provider.id}
                onClick={() => updateSettings({ activeProvider: provider.id as ProviderType })}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-teal-950/40 border-teal-500 ring-1 ring-teal-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-semibold text-slate-100 text-xs">{provider.name}</h5>
                  {provider.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {provider.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{provider.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* API Keys Configuration Form */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Key className="w-4 h-4 text-teal-400" /> Quản lý API Key cá nhân
          </h4>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Lưu an toàn trong trình duyệt
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-xs text-teal-300 space-y-1">
          <p className="font-semibold text-teal-200">📌 Bắt buộc sử dụng API Key cá nhân:</p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Hệ thống tuân thủ chính sách bảo mật cá nhân hóa, không dùng API Key chung. Vui lòng nhập Google Gemini API Key của bạn bên dưới để chuyển đổi văn bản thành giọng nói và làm sạch văn bản AI.
          </p>
        </div>

        <div className="space-y-4">
          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <span className="text-[11px] text-teal-400 font-normal">Sử dụng cho Gemini 3.1 TTS</span>
            </label>
            <div className="relative">
              <input
                type={showGemini ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowGemini(!showGemini)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ElevenLabs Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>ElevenLabs API Key</span>
              <span className="text-[11px] text-slate-400 font-normal">Tùy chọn cho giọng đọc ElevenLabs</span>
            </label>
            <div className="relative">
              <input
                type={showElevenlabs ? 'text' : 'password'}
                value={elevenlabsKey}
                onChange={(e) => setElevenlabsKey(e.target.value)}
                placeholder="sk_..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowElevenlabs(!showElevenlabs)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showElevenlabs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* OpenAI Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">OpenAI API Key</label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveKeys}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-teal-600/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Lưu API Keys</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export Defaults */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <h4 className="font-bold text-slate-100 text-sm pb-3 border-b border-slate-800">
          Cài đặt mặc định xuất file âm thanh
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Định dạng file</label>
            <select
              value={settings.exportSettings.format}
              onChange={(e) =>
                updateSettings({
                  exportSettings: { ...settings.exportSettings, format: e.target.value as ExportFormat }
                })
              }
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl font-mono"
            >
              <option value="wav">WAV (Không nén)</option>
              <option value="mp3">MP3 (Phổ biến)</option>
              <option value="ogg">OGG Vorbis</option>
              <option value="aac">AAC Audio</option>
              <option value="flac">FLAC (Lossless)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Tần số lấy mẫu (Sample Rate)</label>
            <select
              value={settings.exportSettings.sampleRate}
              onChange={(e) =>
                updateSettings({
                  exportSettings: { ...settings.exportSettings, sampleRate: parseInt(e.target.value, 10) }
                })
              }
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl font-mono"
            >
              <option value={22050}>22,050 Hz</option>
              <option value={24000}>24,000 Hz (Gemini Standard)</option>
              <option value={44100}>44,100 Hz (CD Quality)</option>
              <option value={48000}>48,000 Hz (Studio Pro)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Bitrate MP3</label>
            <select
              value={settings.exportSettings.bitrate}
              onChange={(e) =>
                updateSettings({
                  exportSettings: { ...settings.exportSettings, bitrate: parseInt(e.target.value, 10) }
                })
              }
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl font-mono"
            >
              <option value={128}>128 kbps</option>
              <option value={192}>192 kbps (Khuyên dùng)</option>
              <option value={256}>256 kbps</option>
              <option value={320}>320 kbps (Chất lượng cao nhất)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reset Section */}
      <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/40 flex items-center justify-between">
        <div>
          <h5 className="font-semibold text-red-300 text-xs">Xóa dữ liệu cục bộ</h5>
          <p className="text-[11px] text-slate-400">Đặt lại toàn bộ cấu hình, lịch sử và chìa khóa về mặc định ban đầu.</p>
        </div>
        <button
          onClick={handleResetSettings}
          className="px-3.5 py-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-100 font-medium text-xs flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Đặt lại
        </button>
      </div>
    </div>
  );
};
