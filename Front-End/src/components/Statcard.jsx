import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color }) {
  const colorStyles = {
    green: 'bg-green-500/10 text-green-400',
    blue: 'bg-blue-500/10 text-blue-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    rose: 'bg-rose-500/10 text-rose-400',
  };

  return (
    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
      <div className="flex justify-between items-start">
        <span className="text-sm text-slate-400 font-medium">{title}</span>
        <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold text-white">{value}</div>
        <span className="text-xs text-slate-400 mt-2 block">{subtext}</span>
      </div>
    </div>
  );
}
