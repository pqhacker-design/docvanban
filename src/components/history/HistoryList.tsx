import React, { useState } from 'react';
import { useTTS } from '../../contexts/TTSContext';
import { formatTime } from '../../lib/utils';
import { 
  History, 
  Search, 
  Trash2, 
  Play, 
  Download, 
  Clock, 
  FileText, 
  Sparkles,
  Volume2
} from 'lucide-react';

export const HistoryList: React.FC = () => {
  const { history, deleteHistoryItem, clearHistory, playAudio, showToast } = useTTS();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = history.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rawText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.voiceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadItem = (item: typeof history[0]) => {
    if (!item.audioUrl) return;
    const a = document.createElement('a');
    a.href = item.audioUrl;
    a.download = `${item.title.replace(/\s+/g, '_')}.${item.format || 'wav'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Đã tải file ${item.title}`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tiêu đề, văn bản hoặc giọng đọc..."
            className="w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-2 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 font-medium text-xs border border-red-800/50 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa tất cả lịch sử</span>
          </button>
        )}
      </div>

      {/* History Items Grid */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-lg"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{item.createdAt}</span>
                    <span>•</span>
                    <span className="text-teal-300 font-medium">{item.voiceName}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => playAudio(item.audioUrl, item.title)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition-all shadow-md shadow-teal-600/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Nghe lại</span>
                </button>

                <button
                  onClick={() => handleDownloadItem(item)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  title="Tải tập tin"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteHistoryItem(item.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-300 transition-all"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Text snippet */}
            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 line-clamp-2 leading-relaxed">
              "{item.cleanedText || item.rawText}"
            </p>

            {/* Stats Badges */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-teal-400" /> {formatTime(item.durationSeconds)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-teal-400" /> {item.characterCount} ký tự ({item.wordCount} từ)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400" /> Tốc độ: {item.speed}x
              </span>
              {item.fileSizeFormatted && (
                <>
                  <span>•</span>
                  <span className="font-mono text-slate-400">{item.fileSizeFormatted}</span>
                </>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <History className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-xs">
              {searchTerm ? 'Không tìm thấy lịch sử phù hợp' : 'Chưa có lịch sử chuyển đổi âm thanh nào'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
