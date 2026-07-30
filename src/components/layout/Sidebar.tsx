import React from 'react';
import { useTTS } from '../../contexts/TTSContext';
import { NavigationTab } from '../../types';
import { 
  Home, 
  Mic2, 
  FolderKanban, 
  History, 
  Settings, 
  Info, 
  Sparkles,
  Volume2,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, selectedVoice, settings } = useTTS();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Trang chủ', icon: <Home className="w-5 h-5" /> },
    { id: 'studio', label: 'Chuyển văn bản', icon: <Mic2 className="w-5 h-5" />, badge: 'AI Studio' },
    { id: 'files', label: 'Quản lý file', icon: <FolderKanban className="w-5 h-5" /> },
    { id: 'history', label: 'Lịch sử', icon: <History className="w-5 h-5" /> },
    { id: 'settings', label: 'Cài đặt API Key', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (id: NavigationTab) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full w-72 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  TTS Studio <span className="text-xs px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">PRO</span>
                </h1>
                <p className="text-xs text-slate-400">AI Text-to-Speech Studio</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Voice Pill Info */}
          <div className="mx-4 my-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shrink-0" />
              <div className="truncate">
                <p className="text-xs text-slate-400 font-medium">Giọng đọc hiện tại</p>
                <p className="text-xs font-semibold text-teal-300 truncate">{selectedVoice.displayName}</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800/50">
              {selectedVoice.provider}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-teal-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & API Key Indicator */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Engine Gemini
              </span>
              <span className="text-[10px] text-teal-400 font-mono">v3.1 Flash</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {settings.geminiApiKey ? '✓ Đã nhập Gemini API Key' : '⚠️ Chưa nhập API Key (Cần thiết)'}
            </p>
          </div>

          <p className="text-[11px] text-center text-slate-500">
            AI Text-to-Speech Studio Pro © 2026
          </p>
        </div>
      </aside>
    </>
  );
};
