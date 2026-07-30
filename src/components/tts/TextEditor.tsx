import React, { useRef, useState } from 'react';
import { useTTS } from '../../contexts/TTSContext';
import { estimateReadingTime } from '../../lib/utils';
import { 
  Sparkles, 
  UploadCloud, 
  Trash2, 
  Copy, 
  Check, 
  Layers, 
  FileText, 
  Clock, 
  Type,
  AlignLeft,
  Wand2,
  RefreshCw
} from 'lucide-react';

export const TextEditor: React.FC = () => {
  const { 
    rawText, 
    setRawText, 
    cleanedText, 
    useCleanedText, 
    setUseCleanedText,
    cleanTextWithAI, 
    isCleaningText,
    lastCleanResult,
    handleFileImport,
    chunks,
    showToast 
  } = useTTS();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showChunks, setShowChunks] = useState(false);

  const activeText = useCleanedText && cleanedText ? cleanedText : rawText;
  const wordCount = activeText.trim() ? activeText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = activeText.length;
  const readingEstimate = estimateReadingTime(activeText);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    showToast('Đã sao chép văn bản vào bộ nhớ tạm', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setRawText('');
    setUseCleanedText(false);
    showToast('Đã xóa văn bản', 'info');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileImport(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
      {/* Top Bar: Title & Primary AI Optimizer Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-slate-100 text-base">Soạn văn bản cần chuyển đổi</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Clean Button */}
          <button
            onClick={cleanTextWithAI}
            disabled={isCleaningText || !rawText.trim()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-medium text-xs shadow-lg shadow-teal-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCleaningText ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5 text-teal-200" />
            )}
            <span>Làm sạch văn bản AI</span>
          </button>

          {/* Import File Hidden Button Trigger */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition-all"
            title="Tải lên file .txt, .docx, .pdf"
          >
            <UploadCloud className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Tải file</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.docx,.pdf,.md"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileImport(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>

      {/* Cleaned Version Toggle Banner if available */}
      {cleanedText && (
        <div className="p-3 rounded-xl bg-teal-950/50 border border-teal-800/60 flex items-center justify-between text-xs text-teal-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Đã có phiên bản AI làm sạch (chuẩn hóa viết tắt, số, ngày tháng)</span>
          </div>
          <button
            onClick={() => setUseCleanedText(!useCleanedText)}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              useCleanedText
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {useCleanedText ? 'Đang dùng bản AI' : 'Chuyển sang bản AI'}
          </button>
        </div>
      )}

      {/* Main Drag-and-Drop Dropzone & Textarea */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-xl border transition-all ${
          isDragging
            ? 'border-teal-400 bg-teal-950/20'
            : 'border-slate-800 bg-slate-950/60 focus-within:border-teal-500/60'
        }`}
      >
        <textarea
          value={useCleanedText && cleanedText ? cleanedText : rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            if (useCleanedText) setUseCleanedText(false);
          }}
          placeholder="Dán hoặc gõ nội dung văn bản vào đây (hoặc kéo thả file .txt, .docx, .pdf vào khu vực này)..."
          rows={7}
          className="w-full p-4 bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base leading-relaxed resize-y focus:outline-none focus:ring-0 font-sans"
        />

        {/* Quick Textarea Floating Controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-800">
          <button
            onClick={handleCopy}
            disabled={!activeText}
            className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-30"
            title="Sao chép"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleClear}
            disabled={!activeText}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-30"
            title="Xóa tất cả"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Live Text Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-1">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-teal-400" />
            <span>Ký tự: <strong className="text-slate-200 font-semibold">{charCount.toLocaleString()}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-teal-400" />
            <span>Từ: <strong className="text-slate-200 font-semibold">{wordCount.toLocaleString()}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>Ước tính đọc: <strong className="text-teal-300 font-semibold">{readingEstimate.formatted}</strong></span>
          </div>
        </div>

        {/* Smart Chunk Viewer Toggle */}
        <button
          onClick={() => setShowChunks(!showChunks)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-teal-300 font-medium transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-teal-400" />
          <span>Chia đoạn ({chunks.length} phần)</span>
        </button>
      </div>

      {/* AI Smart Chunking breakdown viewer */}
      {showChunks && chunks.length > 0 && (
        <div className="mt-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 animate-in fade-in duration-200">
          <p className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>AI Tự động phân đoạn ({chunks.length} phân đoạn):</span>
            <span className="text-[11px] font-normal text-slate-400">Đảm bảo không vượt giới hạn API</span>
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {chunks.map((chunk, idx) => (
              <div key={chunk.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-teal-400">Đoạn #{idx + 1}</span>
                  <span>{chunk.characterCount} ký tự • {chunk.wordCount} từ</span>
                </div>
                <p className="text-slate-300 line-clamp-2 italic">"{chunk.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modification Summary Badge if cleaned */}
      {lastCleanResult && lastCleanResult.modifications.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
          <p className="text-slate-300 font-semibold">Tóm tắt chuẩn hóa AI ({lastCleanResult.modifications.length} thay đổi):</p>
          <div className="flex flex-wrap gap-2">
            {lastCleanResult.modifications.slice(0, 5).map((mod, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                <span className="line-through text-slate-500 mr-1">{mod.original}</span> → <span className="text-teal-300 font-medium">{mod.replacedWith}</span>
              </span>
            ))}
            {lastCleanResult.modifications.length > 5 && (
              <span className="px-2 py-0.5 text-[11px] text-slate-400">+{lastCleanResult.modifications.length - 5} nữa</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
