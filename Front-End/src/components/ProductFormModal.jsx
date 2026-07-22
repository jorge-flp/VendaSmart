import React, { useMemo, useState } from 'react';
import Modal from './ui/Modal';
import { CATEGORIES } from '../data/mockData';

const EMPTY = {
  name: '',
  category: CATEGORIES[0],
  barcode: '',
  supplier: '',
  qtyInStock: '',
  costPrice: '',
  sellPrice: '',
  minStock: '',
  description: '',
};

export default function ProductFormModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const cost = parseFloat(form.costPrice) || 0;
  const sell = parseFloat(form.sellPrice) || 0;
  const profit = useMemo(() => Number((sell - cost).toFixed(2)), [sell, cost]);
  const margin = useMemo(() => (sell > 0 ? Number(((profit / sell) * 100).toFixed(1)) : 0), [profit, sell]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Informe o nome do produto.';
    if (!form.qtyInStock || Number(form.qtyInStock) < 0) errs.qtyInStock = 'Quantidade inválida.';
    if (!form.costPrice || Number(form.costPrice) <= 0) errs.costPrice = 'Informe o valor pago ao fornecedor.';
    if (!form.sellPrice || Number(form.sellPrice) <= 0) errs.sellPrice = 'Informe o valor de venda.';
    if (Number(form.sellPrice) <= Number(form.costPrice)) errs.sellPrice = 'Venda deve ser maior que o custo.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      name: form.name.trim(),
      category: form.category,
      barcode: form.barcode.trim(),
      supplier: form.supplier.trim(),
      qtyInStock: Number(form.qtyInStock),
      costPrice: cost,
      sellPrice: sell,
      minStock: Number(form.minStock) || 10,
      description: form.description.trim(),
    });
    setForm(EMPTY);
    setErrors({});
  };

  const inputCls =
    'w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500';
  const labelCls = 'block text-xs font-medium text-slate-400 mb-1';

  return (
    <Modal open={open} onClose={onClose} title="Novo Produto" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Nome do produto</label>
            <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Ex: Detergente Neutro" />
            {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className={labelCls}>Categoria</label>
            <select className={inputCls} value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Código de barras <span className="text-slate-600">(opcional)</span></label>
            <input className={inputCls} value={form.barcode} onChange={set('barcode')} placeholder="789..." />
          </div>

          <div>
            <label className={labelCls}>Fornecedor</label>
            <input className={inputCls} value={form.supplier} onChange={set('supplier')} placeholder="Nome do fornecedor" />
          </div>

          <div>
            <label className={labelCls}>Quantidade inicial</label>
            <input type="number" min="0" className={inputCls} value={form.qtyInStock} onChange={set('qtyInStock')} />
            {errors.qtyInStock && <p className="text-rose-400 text-xs mt-1">{errors.qtyInStock}</p>}
          </div>

          <div>
            <label className={labelCls}>Estoque mínimo</label>
            <input type="number" min="0" className={inputCls} value={form.minStock} onChange={set('minStock')} placeholder="Ex: 10" />
          </div>

          <div>
            <label className={labelCls}>Valor pago ao fornecedor (R$)</label>
            <input type="number" min="0" step="0.01" className={inputCls} value={form.costPrice} onChange={set('costPrice')} />
            {errors.costPrice && <p className="text-rose-400 text-xs mt-1">{errors.costPrice}</p>}
          </div>

          <div>
            <label className={labelCls}>Valor de venda (R$)</label>
            <input type="number" min="0" step="0.01" className={inputCls} value={form.sellPrice} onChange={set('sellPrice')} />
            {errors.sellPrice && <p className="text-rose-400 text-xs mt-1">{errors.sellPrice}</p>}
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Descrição <span className="text-slate-600">(opcional)</span></label>
            <textarea className={`${inputCls} min-h-20 resize-none`} value={form.description} onChange={set('description')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-950 border border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block">Lucro estimado (un.)</span>
            <span className={`text-lg font-bold ${profit >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
              R$ {profit.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Margem de lucro</span>
            <span className={`text-lg font-bold ${margin >= 0 ? 'text-green-400' : 'text-rose-400'}`}>
              {margin}%
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
            Cancelar
          </button>
          <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-500 text-white transition-colors">
            Salvar Produto
          </button>
        </div>
      </form>
    </Modal>
  );
}
