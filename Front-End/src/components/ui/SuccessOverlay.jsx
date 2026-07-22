import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * Overlay de confirmação usado após ações como "finalizar venda".
 * Usa apenas transições CSS/Tailwind (sem Framer Motion) para não
 * adicionar dependências novas ao projeto.
 */
export default function SuccessOverlay({ show, message, onDone, duration = 1400 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return undefined;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone?.(), 200);
    }, duration);
    return () => clearTimeout(t);
  }, [show, duration, onDone]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-slate-900 border border-green-500/30 rounded-2xl px-10 py-8 flex flex-col items-center gap-3 shadow-2xl shadow-green-900/20 transition-all duration-300 ${
          visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <p className="text-white font-semibold text-center">{message}</p>
      </div>
    </div>
  );
}
