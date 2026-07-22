import React from 'react';
import { TrendingUp, LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings } from 'lucide-react';

const MENU = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'estoque', label: 'Estoque', icon: Package },
  { key: 'vendas', label: 'Nova Venda', icon: ShoppingCart },
  { key: 'fiados', label: 'Fiados', icon: Users },
  { key: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  { key: 'configuracoes', label: 'Configurações', icon: Settings },
];

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
          {MENU.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-5 h-5" /> {label}
            </button>
          ))}
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
