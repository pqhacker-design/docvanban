import React, { useState } from 'react';
import { useTTS } from '../../contexts/TTSContext';
import { Key, ShieldAlert, Check, X, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndContinue?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSaveAndContinue
}) => {
  const { settings, updateSettings, showToast } = useTTS();
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      showToast('Vui lòng nhập Gemini API Key hợp lệ', 'warning');
      return;
    }
    updateSettings({ geminiApiKey: apiKey.trim() });
    showToast('Đã lưu Gemini API Key thành công!', 'success');
    onClose();
    if (onSaveAndContinue) {
      onSaveAndContinue();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Yêu cầu Gemini API Key</h3>
              <p className="text-xs text-slate-400">Nhập API Key cá nhân của bạn để sử dụng dịch vụ AI TTS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-amber-200">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Không sử dụng API Key hệ thống</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-300/90">
            Ứng dụng yêu cầu người dùng sử dụng Google Gemini API Key riêng để bảo mật và đảm bảo hạn ngạch xử lý tốt nhất.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-teal-400 hover:underline text-[11px] font-normal flex items-center gap-0.5"
              >
                Lấy API Key miễn phí <Sparkles className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 font-mono"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Lưu & Tiếp tục</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
