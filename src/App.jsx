import React, { useState } from 'react';
import { SalesProvider } from './context/SalesContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Demand from './pages/Demand';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <SalesProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'vendas' && <Sales />}
          {activeTab === 'demanda' && <Demand />}
        </main>
      </div>
    </SalesProvider>
  );
}