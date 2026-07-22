import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`w-full ${widths[size]} max-h-[90vh] overflow-y-auto rounded-xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/40`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 rounded-t-xl">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg p-1.5 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
