import React, { useState } from 'react';
import { Lock, TrendingUp, Receipt, DollarSign, History } from 'lucide-react';
import { useSales } from '../context/SalesContext';

export default function Closing() {
  const { salesValue, salesQty, salesHistory, closingHistory, closeRegister } = useSales();
  const [message, setMessage] = useState(null);

  const averageTicket = salesHistory.length > 0 ? salesValue / salesHistory.length : 0;

  const breakdown = salesHistory.reduce((acc, sale) => {
    if (!acc[sale.name]) acc[sale.name] = { name: sale.name, qty: 0, total: 0 };
    acc[sale.name].qty += sale.qty;
    acc[sale.name].total += sale.total;
    return acc;
  }, {});
  const breakdownList = Object.values(breakdown).sort((a, b) => b.total - a.total);

  const handleClose = () => {
    const confirmed = window.confirm(
      `Confirma o fechamento do caixa?\n\nTotal: R$ ${salesValue.toFixed(2)}\nVendas: ${salesHistory.length}\n\nOs contadores serão zerados para o próximo dia.`
    );
    if (!confirmed) return;

    const result = closeRegister();
    if (!result.success) {
      setMessage({ type: 'error', text: result.message });
      return;
    }
    setMessage({ type: 'success', text: 'Caixa fechado com sucesso! Contadores zerados para o próximo dia.' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Fechamento de Caixa</h1>
        <p className="text-stone-400 text-sm">Resumo do dia e histórico de fechamentos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 text-sm mb-2">
            <DollarSign className="w-4 h-4" /> Total do Dia
          </div>
          <div className="text-3xl font-bold text-white">R$ {salesValue.toFixed(2)}</div>
        </div>

        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 text-sm mb-2">
            <Receipt className="w-4 h-4" /> Vendas Realizadas
          </div>
          <div className="text-3xl font-bold text-white">{salesHistory.length}</div>
        </div>

        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 text-sm mb-2">
            <TrendingUp className="w-4 h-4" /> Ticket Médio
          </div>
          <div className="text-3xl font-bold text-white">R$ {averageTicket.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Vendas por Produto (hoje)</h2>
          {breakdownList.length === 0 ? (
            <p className="text-stone-500 text-sm">Nenhuma venda registrada ainda hoje.</p>
          ) : (
            <div className="space-y-3">
              {breakdownList.map((item) => (
                <div key={item.name} className="flex justify-between items-center p-3 bg-stone-950 rounded-lg border border-stone-800">
                  <div>
                    <span className="text-sm text-white font-medium">{item.name}</span>
                    <span className="text-xs text-stone-500 block">{item.qty} unidade(s)</span>
                  </div>
                  <span className="text-amber-400 font-semibold text-sm">R$ {item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleClose}
            disabled={salesHistory.length === 0}
            className="w-full mt-6 bg-rose-600 hover:bg-rose-500 disabled:bg-stone-700 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" /> Fechar Caixa do Dia
          </button>

          {message && (
            <p className={`text-xs mt-3 ${message.type === 'error' ? 'text-rose-400' : 'text-amber-400'}`}>
              {message.text}
            </p>
          )}
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5" /> Histórico de Fechamentos
          </h2>
          {closingHistory.length === 0 ? (
            <p className="text-stone-500 text-sm">Nenhum fechamento realizado ainda.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {closingHistory.map((c) => (
                <div key={c.id} className="p-4 bg-stone-950 rounded-lg border border-stone-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white">{c.date} às {c.closedAt}</span>
                    <span className="text-amber-400 font-semibold text-sm">R$ {c.totalValue.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-stone-400 flex justify-between">
                    <span>{c.salesCount} venda(s)</span>
                    <span>Ticket médio: R$ {c.averageTicket.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}