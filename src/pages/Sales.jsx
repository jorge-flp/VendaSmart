import React, { useState } from 'react';
import { Plus, PackagePlus, AlertCircle, MessageCircle } from 'lucide-react';
import { useSales } from '../context/SalesContext';
import { useAuth } from '../context/AuthContext';

function buildOrderMessage(sale) {
  const lines = [
    `🥖 *Pão e Café da Roça* — Confirmação de Pedido`,
    ``,
    `Produto: ${sale.name}`,
    `Quantidade: ${sale.qty} un.`,
    `Total: R$ ${sale.total.toFixed(2)}`,
    ``,
    `Obrigado pela preferência! 😊`,
  ];
  return lines.join('\n');
}

function sanitizePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  return digits.startsWith('55') ? digits : `55${digits}`;
}

function buildWhatsAppUrl(phone, message) {
  const cleanPhone = sanitizePhone(phone);
  const encodedMessage = encodeURIComponent(message);
  return cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;
}

export default function Sales() {
  const { products, salesHistory, addSale, restockProduct } = useSales();
  const { currentUser } = useAuth();
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [customerPhone, setCustomerPhone] = useState('');
  const [error, setError] = useState('');
  const [restockAmounts, setRestockAmounts] = useState({});
  const [lastSale, setLastSale] = useState(null);

  const selectedProduct = products.find((p) => p.id === Number(selectedProductId));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLastSale(null);

    const result = addSale(selectedProductId, quantity, currentUser?.name);

    if (!result || !result.success) {
      setError(result?.message || 'Não foi possível registrar a venda.');
      return;
    }

    setLastSale({ ...result.sale, phone: customerPhone });
    setQuantity(1);
  };

  const handleSendWhatsApp = () => {
    if (!lastSale) return;
    const message = buildOrderMessage(lastSale);
    const url = buildWhatsAppUrl(lastSale.phone, message);
    window.open(url, '_blank');
  };

  const handleRestock = (productId) => {
    const amount = restockAmounts[productId];
    if (!amount) return;
    restockProduct(productId, amount);
    setRestockAmounts((prev) => ({ ...prev, [productId]: '' }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Registrar Nova Venda</h1>
        <p className="text-stone-400 text-sm">Lançamento de saídas no caixa.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 h-fit space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">Produto</label>
              <select
                value={selectedProductId}
                onChange={(e) => { setSelectedProductId(e.target.value); setError(''); }}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (R$ {p.price.toFixed(2)}) — {p.stock} un. em estoque
                  </option>
                ))}
              </select>
              {selectedProduct && selectedProduct.stock <= selectedProduct.minStock && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Estoque baixo para este produto.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">Quantidade</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => { setQuantity(e.target.value); setError(''); }}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                WhatsApp do cliente <span className="text-stone-600">(opcional)</span>
              </label>
              <input
                type="tel"
                placeholder="(88) 99999-9999"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {error && <p className="text-xs text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={!selectedProduct || selectedProduct.stock === 0}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Confirmar Venda
            </button>

            {lastSale && (
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Enviar pedido via WhatsApp
              </button>
            )}
          </form>

          <div className="border-t border-stone-800 pt-4">
            <h3 className="text-sm font-semibold text-white mb-3">Estoque de Produtos</h3>
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2 text-sm">
                  <div>
                    <span className="text-stone-200">{p.name}</span>
                    <span className={`ml-2 text-xs ${p.stock <= p.minStock ? 'text-rose-400' : 'text-stone-500'}`}>
                      {p.stock} un.
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      placeholder="+qtd"
                      value={restockAmounts[p.id] || ''}
                      onChange={(e) => setRestockAmounts((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      className="w-16 bg-stone-950 border border-stone-800 rounded p-1 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleRestock(p.id)}
                      className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-400"
                      title="Repor estoque"
                    >
                      <PackagePlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-stone-900 border border-stone-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Histórico Recente</h2>
          <div className="space-y-3">
            {salesHistory.map((item) => (
              <div key={item.id} className="p-4 bg-stone-950 rounded-lg border border-stone-800 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-white text-sm">{item.name}</h4>
                  <span className="text-xs text-stone-500">
                    {item.time} {item.seller && `· ${item.seller}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-amber-400 block text-sm">R$ {item.total.toFixed(2)}</span>
                  <span className="text-xs text-stone-400">{item.qty} unidade(s)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}