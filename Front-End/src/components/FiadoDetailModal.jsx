import React, { useState } from 'react';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import { useApp } from '../context/AppContext';

export default function FiadoDetailModal({ fiado, onClose }) {
  const { registerPayment } = useApp();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  if (!fiado) return null;

  const handlePay = () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      setError('Informe um valor válido.');
      return;
    }
    if (value > fiado.balance) {
      setError(`O valor não pode ser maior que o saldo devedor (R$ ${fiado.balance.toFixed(2)}).`);
      return;
    }
    registerPayment(fiado.id, value);
    setAmount('');
    setError('');
  };

  return (
    <Modal open={!!fiado} onClose={onClose} title={fiado.name} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block">Valor total</span>
            <span className="text-lg font-bold text-white">R$ {fiado.total.toFixed(2)}</span>
          </div>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block">Valor pago</span>
            <span className="text-lg font-bold text-green-400">R$ {fiado.valuePaid.toFixed(2)}</span>
          </div>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block">Saldo devedor</span>
            <span className="text-lg font-bold text-rose-400">R$ {fiado.balance.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Telefone: <span className="text-slate-200">{fiado.phone}</span>
          </div>
          <Badge variant={fiado.status} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-2">Últimas compras</h3>
          <div className="space-y-1.5">
            {fiado.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-sm bg-slate-950 border border-slate-800 rounded-md px-3 py-2">
                <span className="text-slate-300">{it.qty}× {it.name}</span>
                <span className="text-slate-200">R$ {it.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-2">Histórico</h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {[...fiado.history].reverse().map((h) => (
              <div key={h.id} className="flex justify-between text-xs text-slate-400 px-1">
                <span>{new Date(h.date).toLocaleDateString('pt-BR')} — {h.note}</span>
                <span className={h.type === 'pagamento' ? 'text-green-400' : 'text-slate-300'}>
                  {h.type === 'pagamento' ? '+' : ''}R$ {h.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {fiado.balance > 0 && (
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <label className="block text-xs font-medium text-slate-400">Registrar pagamento</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Valor pago"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500"
              />
              <button onClick={handlePay} className="px-4 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors">
                Registrar pagamento
              </button>
            </div>
            {error && <p className="text-rose-400 text-xs">{error}</p>}
          </div>
        )}
      </div>
    </Modal>
  );
}
