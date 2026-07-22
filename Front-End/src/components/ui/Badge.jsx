import React from 'react';

const VARIANTS = {
  ok: 'bg-green-500/10 text-green-400 border-green-500/20',
  baixo: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  ruptura: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  pago: 'bg-green-500/10 text-green-400 border-green-500/20',
  aberto: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  atrasado: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  neutro: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
};

const LABELS = {
  ok: 'Estoque OK',
  baixo: 'Estoque baixo',
  ruptura: 'Sem estoque',
  pago: 'Pago',
  aberto: 'Em aberto',
  atrasado: 'Atrasado',
};

export default function Badge({ variant = 'neutro', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border ${VARIANTS[variant] || VARIANTS.neutro}`}
    >
      {children ?? LABELS[variant] ?? variant}
    </span>
  );
}
