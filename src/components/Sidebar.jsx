import React from 'react';
import { TrendingUp, LayoutDashboard, ShoppingCart, Sparkles, Lock, Package, Target, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser, logout } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <aside className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
      <div>
        <div className="p-6 border-b border-stone-800 flex items-center gap-3">
          <div className="bg-amber-600 p-2 rounded-xl text-white shadow-lg shadow-amber-600/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">
            Venda<span className="text-amber-500">Smart</span>
          </span>
        </div>

        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab('vendas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'vendas'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
            }`}
          >
            <ShoppingCart className="w-5 h-5" /> Registrar Venda
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('produtos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'produtos'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <Package className="w-5 h-5" /> Catálogo de Produtos
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setActiveTab('caixa')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'caixa'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <Lock className="w-5 h-5" /> Fechamento de Caixa
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setActiveTab('metas')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'metas'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <Target className="w-5 h-5" /> Metas & Relatórios
            </button>
          )}

          <button
            onClick={() => setActiveTab('demanda')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'demanda'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
            }`}
          >
            <Sparkles className="w-5 h-5" /> IA Demanda
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-stone-800 space-y-3">
        <div className="flex items-center gap-3 p-2 bg-stone-800/40 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-stone-950 text-xs">
            {currentUser?.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-stone-400 truncate">{currentUser?.label}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-stone-400 hover:text-rose-400 hover:bg-stone-800/60 transition-all"
        >
          <LogOut className="w-4 h-4" /> Trocar usuário
        </button>
      </div>
    </aside>
  );
}