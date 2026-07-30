import React from 'react';
import { useTTS } from '../../contexts/TTSContext';
import { formatTime } from '../../lib/utils';
import { FolderKanban, Play, Download, Trash2, FileAudio, HardDrive } from 'lucide-react';

export const FileManager: React.FC = () => {
  const { history, playAudio, deleteHistoryItem, showToast } = useTTS();

  const handleDownload = (item: typeof history[0]) => {
    if (!item.audioUrl) return;
    const a = document.createElement('a');
    a.href = item.audioUrl;
    a.download = `${item.title.replace(/\s+/g, '_')}.${item.format || 'wav'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Đã tải xuống file ${item.title}`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Tổng số tập tin</p>
            <h4 className="text-lg font-bold text-white">{history.length} files</h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center">
            <FileAudio className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Tổng thời lượng</p>
            <h4 className="text-lg font-bold text-teal-300">
              {formatTime(history.reduce((acc, h) => acc + (h.durationSeconds || 0), 0))}
            </h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Trạng thái bộ nhớ</p>
            <h4 className="text-lg font-bold text-emerald-400">Trực tiếp Browser</h4>
          </div>
        </div>
      </div>

      {/* Files Table / Cards */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <h3 className="font-bold text-slate-100 text-base flex items-center gap-2 pb-3 border-b border-slate-800">
          <FileAudio className="w-5 h-5 text-teal-400" /> Danh sách tập tin xuất ra
        </h3>

        <div className="space-y-2.5">
          {history.map((file) => (
            <div
              key={file.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 text-teal-400 flex items-center justify-center font-bold text-xs uppercase">
                  {file.format || 'WAV'}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-100">{file.title}</h4>
                  <p className="text-[11px] text-slate-400">
                    {file.createdAt} • {formatTime(file.durationSeconds)} • {file.fileSizeFormatted || 'Dynamic'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => playAudio(file.audioUrl, file.title)}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Phát
                </button>
                <button
                  onClick={() => handleDownload(file)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  title="Tải về"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteHistoryItem(file.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-300 transition-all"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              Chưa có tập tin âm thanh nào được lưu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
