import React from 'react';
import { useTTS } from '../../contexts/TTSContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTTS();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
        };

        const bgStyles = {
          success: 'bg-slate-900/95 border-teal-500/40 text-teal-100',
          error: 'bg-slate-900/95 border-red-500/40 text-red-100',
          warning: 'bg-slate-900/95 border-amber-500/40 text-amber-100',
          info: 'bg-slate-900/95 border-cyan-500/40 text-cyan-100'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-200 ${bgStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium leading-relaxed flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
