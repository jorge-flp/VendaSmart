import React, { useMemo, useState } from 'react';
import { Search, Plus, ArrowUpDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import ProductFormModal from '../components/ProductFormModal';

const SORT_OPTIONS = [
  { key: 'name-asc', label: 'Nome (A-Z)' },
  { key: 'stock-asc', label: 'Estoque (menor primeiro)' },
  { key: 'stock-desc', label: 'Estoque (maior primeiro)' },
  { key: 'profit-desc', label: 'Lucro por unidade (maior)' },
];

export default function Estoque() {
  const { products, addProduct, unitProfit, profitMargin, stockStatus } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [sort, setSort] = useState('name-asc');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'Todas') list = list.filter((p) => p.category === category);

    const sorted = [...list];
    switch (sort) {
      case 'stock-asc':
        sorted.sort((a, b) => a.qtyInStock - b.qtyInStock);
        break;
      case 'stock-desc':
        sorted.sort((a, b) => b.qtyInStock - a.qtyInStock);
        break;
      case 'profit-desc':
        sorted.sort((a, b) => unitProfit(b) - unitProfit(a));
        break;
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [products, search, category, sort, unitProfit]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Estoque</h1>
          <p className="text-slate-400 text-sm">{products.length} produtos cadastrados · {filtered.length} exibidos</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-md shadow-green-600/20"
        >
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar produto..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500"
        >
          <option value="Todas">Todas categorias</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5">
          <ArrowUpDown className="w-4 h-4 text-slate-500" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent text-sm text-slate-200 focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          subtitle="Ajuste a busca ou os filtros, ou cadastre um novo produto no estoque."
          action={
            <button onClick={() => setModalOpen(true)} className="text-sm text-green-400 hover:text-green-300 font-medium">
              + Cadastrar produto
            </button>
          }
        />
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-slate-800">
                  <th className="px-4 py-3 font-medium">Produto</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium text-right">Estoque</th>
                  <th className="px-4 py-3 font-medium text-right">Custo</th>
                  <th className="px-4 py-3 font-medium text-right">Venda</th>
                  <th className="px-4 py-3 font-medium text-right">Lucro/un.</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-base shrink-0">
                          {p.photo}
                        </span>
                        <span className="text-slate-200 font-medium truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400">{p.category}</td>
                    <td className="px-4 py-2.5 text-right text-slate-200">{p.qtyInStock}</td>
                    <td className="px-4 py-2.5 text-right text-slate-400">R$ {p.costPrice.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-200">R$ {p.sellPrice.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-right text-green-400 font-medium">
                      R$ {unitProfit(p).toFixed(2)}{' '}
                      <span className="text-slate-500 font-normal">({profitMargin(p)}%)</span>
                    </td>
                    <td className="px-4 py-2.5"><Badge variant={stockStatus(p)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

  <ProductFormModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  onSave={async (data) => {
    try {
      await addProduct(data);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar produto.');
    }
  }}
/>
    </div>
  );
}
