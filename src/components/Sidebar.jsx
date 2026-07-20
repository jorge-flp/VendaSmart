import React from 'react';
import { TrendingUp, LayoutDashboard, ShoppingCart, Sparkles, Lock } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
      <div>
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-xl text-white shadow-lg shadow-green-600/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">
            Venda<span className="text-green-500">Smart</span>
          </span>
        </div>

        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab('vendas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'vendas'
                ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <ShoppingCart className="w-5 h-5" /> Registrar Venda
          </button>

          <button
            onClick={() => setActiveTab('caixa')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'caixa'
                ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <Lock className="w-5 h-5" /> Fechamento de Caixa
          </button>

          <button
            onClick={() => setActiveTab('demanda')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'demanda'
                ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-5 h-5" /> IA Demanda
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 bg-slate-800/40 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-slate-950 text-xs">
            VS
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">Padaria & Café Silva</p>
            <p className="text-[10px] text-slate-400 truncate">Plano Empreendedor</p>
          </div>
        </div>
      </div>
    </aside>
  );
}