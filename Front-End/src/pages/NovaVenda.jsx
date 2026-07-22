import React, { useMemo, useState } from 'react';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SuccessOverlay from '../components/ui/SuccessOverlay';

export default function NovaVenda() {
  const { products, registerSale } = useApp();
  const availableProducts = useMemo(() => products.filter((p) => p.qtyInStock > 0), [products]);

  const [selectedId, setSelectedId] = useState(availableProducts[0]?.id ?? '');
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastSaleTotal, setLastSaleTotal] = useState(0);

  const selectedProduct = products.find((p) => p.id === selectedId);
  const stockLeftForSelected =
    (selectedProduct?.qtyInStock ?? 0) - (cart.find((c) => c.productId === selectedId)?.qty ?? 0);

  const handleAddItem = () => {
    setError('');
    if (!selectedProduct) return;
    const q = Number(qty);
    if (!q || q <= 0) {
      setError('Informe uma quantidade válida.');
      return;
    }
    if (q > stockLeftForSelected) {
      setError(`Estoque insuficiente. Disponível: ${stockLeftForSelected} un.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.productId === selectedProduct.id);
      if (existing) {
        return prev.map((c) =>
          c.productId === selectedProduct.id ? { ...c, qty: c.qty + q } : c
        );
      }
      return [...prev, { productId: selectedProduct.id, name: selectedProduct.name, unitPrice: selectedProduct.sellPrice, qty: q }];
    });
    setQty(1);
  };

  const removeItem = (productId) => setCart((prev) => prev.filter((c) => c.productId !== productId));

  const total = useMemo(() => cart.reduce((s, c) => s + c.unitPrice * c.qty, 0), [cart]);

  const handleFinalize = () => {
    if (cart.length === 0) return;
    const sale = registerSale(cart.map(({ productId, qty: q }) => ({ productId, qty: q })));
    setLastSaleTotal(sale.total);
    setCart([]);
    setShowSuccess(true);
  };

  const inputCls =
    'w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Nova Venda</h1>
        <p className="text-slate-400 text-sm">Selecione os produtos do estoque para lançar a venda.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Produto</label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className={inputCls}>
              {availableProducts.length === 0 && <option value="">Nenhum produto em estoque</option>}
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — R$ {p.sellPrice.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="flex justify-between text-xs text-slate-500 -mt-1">
              <span>Disponível: {stockLeftForSelected} un.</span>
              <span>Unitário: R$ {selectedProduct.sellPrice.toFixed(2)}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Quantidade</label>
            <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className={inputCls} />
          </div>

          {error && <p className="text-rose-400 text-xs">{error}</p>}

          <button
            onClick={handleAddItem}
            disabled={!selectedProduct}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Adicionar à venda
          </button>
        </div>

        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-green-400" /> Itens da venda
          </h2>

          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm py-10">
              Nenhum item adicionado ainda.
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.qty} un. × R$ {item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-green-400">
                      R$ {(item.qty * item.unitPrice).toFixed(2)}
                    </span>
                    <button onClick={() => removeItem(item.productId)} className="text-slate-500 hover:text-rose-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-sm">Total da venda</span>
            <span className="text-2xl font-bold text-white">R$ {total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleFinalize}
            disabled={cart.length === 0}
            className="mt-4 w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all shadow-md shadow-green-600/20"
          >
            Finalizar Venda
          </button>
        </div>
      </div>

      <SuccessOverlay
        show={showSuccess}
        message={`Venda de R$ ${lastSaleTotal.toFixed(2)} registrada! Estoque e dashboard atualizados.`}
        onDone={() => setShowSuccess(false)}
      />
    </div>
  );
}
