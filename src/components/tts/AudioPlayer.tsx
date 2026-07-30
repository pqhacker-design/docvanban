import React, { useState } from 'react';
import { useTTS } from '../../contexts/TTSContext';
import { WaveformVisualizer } from '../common/WaveformVisualizer';
import { formatTime } from '../../lib/utils';
import { ExportFormat } from '../../types';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Download, 
  Sparkles, 
  Share2,
  FileAudio,
  Check
} from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const { 
    currentAudio, 
    pauseAudio, 
    resumeAudio, 
    stopAudio, 
    seekAudio, 
    setAudioVolume,
    settings,
    showToast 
  } = useTTS();

  const [downloadFormat, setDownloadFormat] = useState<ExportFormat>(settings.exportSettings.format);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!currentAudio) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-center space-y-3 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-teal-400 mx-auto flex items-center justify-center">
          <FileAudio className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-200 text-sm">Chưa có bản thu âm thanh</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Nhấn nút "Tạo giọng nói AI" bên dưới để chuyển đổi văn bản và nghe thử trực tiếp tại đây.
          </p>
        </div>
      </div>
    );
  }

  const { title, url, duration, currentTime, isPlaying, volume } = currentAudio;

  const handleDownload = () => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_AI_Voice.${downloadFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Đã bắt đầu tải xuống tập tin .${downloadFormat}`, 'success');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('Đã sao chép liên kết âm thanh vào bộ nhớ tạm', 'info');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-teal-500/30 p-5 space-y-4 shadow-2xl shadow-teal-950/20">
      {/* Title & Badge */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-3 h-3 rounded-full bg-teal-400 animate-ping shrink-0" />
          <h3 className="font-bold text-slate-100 text-sm sm:text-base truncate">{title}</h3>
        </div>

        <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
          Sẵn sàng phát
        </span>
      </div>

      {/* Visualizer & Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-center py-2 bg-slate-950/60 rounded-xl border border-slate-800">
          <WaveformVisualizer isPlaying={isPlaying} barCount={40} height={44} />
        </div>

        {/* Timeline Scrubber */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={(e) => seekAudio(parseFloat(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Main Player Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Play/Pause/Stop */}
        <div className="flex items-center gap-2">
          <button
            onClick={isPlaying ? pauseAudio : resumeAudio}
            className="w-11 h-11 rounded-xl bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-600/30 transition-all"
            title={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={stopAudio}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
            title="Dừng lại"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-slate-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-teal-400" />
          )}
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setAudioVolume(parseInt(e.target.value, 10))}
            className="w-20 accent-teal-400 h-1 cursor-pointer bg-slate-800 rounded"
          />
        </div>

        {/* Format Select & Download Action */}
        <div className="flex items-center gap-2">
          <select
            value={downloadFormat}
            onChange={(e) => setDownloadFormat(e.target.value as ExportFormat)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-teal-500 font-mono"
          >
            <option value="wav">WAV</option>
            <option value="mp3">MP3</option>
            <option value="ogg">OGG</option>
            <option value="aac">AAC</option>
            <option value="flac">FLAC</option>
          </select>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium text-xs border border-teal-500/30 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Tải về</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            title="Sao chép link âm thanh"
          >
            {copiedLink ? <Check className="w-4 h-4 text-teal-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
