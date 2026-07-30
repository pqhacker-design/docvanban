import React from 'react';
import { useTTS } from '../../contexts/TTSContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, Sun, Moon, Key, Mic2, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { activeTab, setActiveTab, settings, selectedVoice } = useTTS();
  const { theme, toggleTheme } = useTheme();

  const titleMap: Record<string, { title: string; subtitle: string }> = {
    home: { title: 'Trang chủ Studio', subtitle: 'Tổng quan công cụ chuyển đổi văn bản thành giọng nói AI' },
    studio: { title: 'Chuyển văn bản thành giọng nói', subtitle: 'Xử lý văn bản, chọn giọng đọc AI & tùy chỉnh âm thanh' },
    files: { title: 'Quản lý file âm thanh', subtitle: 'Danh sách các bản thu âm thanh AI đã xuất' },
    history: { title: 'Lịch sử chuyển đổi', subtitle: 'Theo dõi và tải lại các bản đọc đã thực hiện' },
    settings: { title: 'Cài đặt hệ thống & API Key', subtitle: 'Cấu hình Gemini API Key cá nhân, giọng đọc & tùy chọn xuất file' },
  };

  const current = titleMap[activeTab] || titleMap.studio;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Mở Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            {current.title}
          </h2>
          <p className="hidden sm:block text-xs text-slate-400">{current.subtitle}</p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5">
        {/* Active Provider Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span className="font-medium">{selectedVoice.provider.toUpperCase()}</span>
        </div>

        {/* API Key Status */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
            settings.geminiApiKey
              ? 'bg-teal-950/60 text-teal-300 border-teal-800'
              : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/40'
          }`}
          title="Nhấp để cấu hình API Key"
        >
          <Key className="w-3.5 h-3.5" />
          <span className="hidden md:inline">
            {settings.geminiApiKey ? 'API Key OK' : 'Thêm API Key'}
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
          title={`Chuyển sang chế độ ${theme === 'dark' ? 'Sáng' : 'Tối'}`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-300" />
          )}
        </button>

        {/* Action Button */}
        {activeTab !== 'studio' && (
          <button
            onClick={() => setActiveTab('studio')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-md shadow-teal-600/20 transition-all"
          >
            <Mic2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Soạn bài đọc</span>
          </button>
        )}
      </div>
    </header>
  );
};
