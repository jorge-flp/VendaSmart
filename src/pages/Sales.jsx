import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSales } from '../context/SalesContext';

export default function Sales() {
  const { salesHistory, addSale } = useSales();
  const [selectedProduct, setSelectedProduct] = useState('Café Especial|12.50');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const [name, price] = selectedProduct.split('|');
    addSale(name, price, quantity);
    setQuantity(1);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Registrar Nova Venda</h1>
        <p className="text-slate-400 text-sm">Lançamento de saídas no caixa.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Produto</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500"
              >
                <option value="Café Especial|12.50">Café Especial (R$ 12,50)</option>
                <option value="Bolo Chocolate|25.00">Bolo Chocolate (R$ 25,00)</option>
                <option value="Suco Natural|8.00">Suco Natural (R$ 8,00)</option>
                <option value="Pão Artesanal|6.50">Pão Artesanal (R$ 6,50)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Quantidade</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500"
              />
            </div>

            <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Confirmar Venda
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Histórico Recente</h2>
          <div className="space-y-3">
            {salesHistory.map((item) => (
              <div key={item.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-white text-sm">{item.name}</h4>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-green-400 block text-sm">R$ {item.total.toFixed(2)}</span>
                  <span className="text-xs text-slate-400">{item.qty} unidade(s)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}