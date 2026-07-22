import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Estoque from './pages/Estoque';
import NovaVenda from './pages/NovaVenda';
import Fiados from './pages/Fiados';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AppProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'estoque' && <Estoque />}
          {activeTab === 'vendas' && <NovaVenda />}
          {activeTab === 'fiados' && <Fiados />}
          {activeTab === 'relatorios' && <Relatorios />}
          {activeTab === 'configuracoes' && <Configuracoes />}
        </main>
      </div>
    </AppProvider>
  );
}
