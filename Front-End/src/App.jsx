import React, { useState } from 'react';
import { SalesProvider } from './context/SalesContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LockScreen from './components/LockScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Demand from './pages/Demand';
import Closing from './pages/Closing';
import Products from './pages/Products';
import Goals from './pages/Goals';

function AppContent() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!currentUser) {
    return <LockScreen />;
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'vendas' && <Sales />}
        {activeTab === 'produtos' && <Products />}
        {activeTab === 'caixa' && isAdmin && <Closing />}
        {activeTab === 'metas' && isAdmin && <Goals />}
        {activeTab === 'demanda' && <Demand />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SalesProvider>
        <AppContent />
      </SalesProvider>
    </AuthProvider>
  );
}