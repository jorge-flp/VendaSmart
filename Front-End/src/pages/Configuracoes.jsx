import React, { useState } from 'react';
import { Store, Bell, ShieldCheck } from 'lucide-react';

export default function Configuracoes() {
  const [storeName, setStoreName] = useState('Padaria & Café Silva');
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // API: PATCH /store/settings — por enquanto apenas mock local.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls =
    'w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500';

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="text-slate-400 text-sm">Preferências gerais do estabelecimento (dados de exemplo).</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-green-400" /> Dados do estabelecimento
          </h2>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nome do estabelecimento</label>
            <input className={inputCls} value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-green-400" /> Notificações
          </h2>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={lowStockAlert}
              onChange={(e) => setLowStockAlert(e.target.checked)}
              className="w-4 h-4 accent-green-600"
            />
            Alertar quando um produto atingir o estoque mínimo
          </label>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" /> Dados e privacidade
          </h2>
          <p className="text-xs text-slate-500">
            Este protótipo utiliza apenas dados fictícios (mock). Nenhuma informação real é armazenada ou enviada a servidores.
          </p>
        </div>

        <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-medium px-5 py-2.5 rounded-lg transition-all">
          Salvar alterações
        </button>
        {saved && <span className="ml-3 text-sm text-green-400">Preferências salvas.</span>}
      </form>
    </div>
  );
}
