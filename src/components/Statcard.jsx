import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color }) {
  const colorStyles = {
    green: 'bg-amber-500/10 text-amber-400',
    blue: 'bg-orange-500/10 text-orange-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    rose: 'bg-rose-500/10 text-rose-400',
  };

  return (
    <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
      <div className="flex justify-between items-start">
        <span className="text-sm text-stone-400 font-medium">{title}</span>
        <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold text-white">{value}</div>
        <span className="text-xs text-stone-400 mt-2 block">{subtext}</span>
      </div>
    </div>
  );
}