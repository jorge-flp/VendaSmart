import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-slate-500" />
      </div>
      <h3 className="text-white font-semibold">{title}</h3>
      {subtitle && <p className="text-slate-400 text-sm mt-1 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
