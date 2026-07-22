import React, { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Modal from './ui/Modal';
import { useApp } from '../context/AppContext';

const TERMS = [7, 15, 30];

export default function FiadoFormModal({ open, onClose, onSave }) {
  const { products } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [term, setTerm] = useState(15);
  const [observations, setObservations] = useState('');
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? '');
  const [qty, setQty] = useState(1);
  const [errors, setErrors] = useState({});

  const total = useMemo(() => items.reduce((s, it) => s + it.subtotal, 0), [items]);

  const addItem = () => {
    const product = products.find((p) => p.id === selectedId);
    if (!product || !qty || qty <= 0) return;
    const subtotal = Number((product.sellPrice * Number(qty)).toFixed(2));
    setItems((prev) => [...prev, { productId: product.id, name: product.name, qty: Number(qty), subtotal }]);
    setQty(1);
  };

  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const reset = () => {
    setName('');
    setPhone('');
    setTerm(15);
    setObservations('');
    setItems([]);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Informe o nome do cliente.';
    if (!phone.trim()) errs.phone = 'Informe o telefone.';
    if (items.length === 0) errs.items = 'Adicione ao menos um produto.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const purchaseDate = new Date();
    const dueDate = new Date(purchaseDate.getTime() + term * 86400000);
    onSave({
      name: name.trim(),
      phone: phone.trim(),
      items,
      purchaseDate: purchaseDate.toISOString(),
      dueDate: dueDate.toISOString(),
      observations: observations.trim(),
    });
    reset();
  };

  const inputCls =
    'w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500';
  const labelCls = 'block text-xs font-medium text-slate-400 mb-1';

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Novo Fiado" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nome do cliente</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Maria Silva" />
            {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className={labelCls}>Telefone</label>
            <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(85) 90000-0000" />
            {errors.phone && <p className="text-rose-400 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className={labelCls}>Prazo de pagamento</label>
            <select className={inputCls} value={term} onChange={(e) => setTerm(Number(e.target.value))}>
              {TERMS.map((t) => (
                <option key={t} value={t}>{t} dias</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
          <label className={labelCls}>Produtos comprados</label>
          <div className="flex gap-2">
            <select className={inputCls} value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — R$ {p.sellPrice.toFixed(2)}</option>
              ))}
            </select>
            <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className={`${inputCls} w-24`} />
            <button type="button" onClick={addItem} className="px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {errors.items && <p className="text-rose-400 text-xs">{errors.items}</p>}

          {items.length > 0 && (
            <div className="space-y-1.5">
              {items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm bg-slate-900 rounded-md px-3 py-2">
                  <span className="text-slate-300">{it.qty}× {it.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 font-medium">R$ {it.subtotal.toFixed(2)}</span>
                    <button type="button" onClick={() => removeItem(idx)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-semibold">
                <span className="text-slate-400">Valor total</span>
                <span className="text-white">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className={labelCls}>Observações <span className="text-slate-600">(opcional)</span></label>
          <textarea className={`${inputCls} min-h-16 resize-none`} value={observations} onChange={(e) => setObservations(e.target.value)} />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={() => { reset(); onClose(); }} className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
            Cancelar
          </button>
          <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-500 text-white transition-colors">
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
