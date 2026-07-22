import React, { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import FiadoFormModal from '../components/FiadoFormModal';
import FiadoDetailModal from '../components/FiadoDetailModal';

const STATUS_FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'aberto', label: 'Em aberto' },
  { key: 'atrasado', label: 'Atrasado' },
  { key: 'pago', label: 'Pago' },
];

export default function Fiados() {
  const { fiados, addFiado } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    let list = fiados.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'todos') list = list.filter((f) => f.status === statusFilter);
    return list;
  }, [fiados, search, statusFilter]);

  const selected = fiados.find((f) => f.id === selectedId) || null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Fiados</h1>
          <p className="text-slate-400 text-sm">{fiados.length} clientes cadastrados · {filtered.length} exibidos</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-md shadow-green-600/20"
        >
          <Plus className="w-4 h-4" /> Novo Fiado
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar cliente..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="flex gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s.key ? 'bg-green-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nenhum fiado encontrado" subtitle="Ajuste os filtros ou cadastre um novo fiado." />
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-slate-800">
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Telefone</th>
                  <th className="px-4 py-3 font-medium text-right">Valor devido</th>
                  <th className="px-4 py-3 font-medium">Data da compra</th>
                  <th className="px-4 py-3 font-medium">Prazo</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => setSelectedId(f.id)}
                    className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-2.5 text-slate-200 font-medium">{f.name}</td>
                    <td className="px-4 py-2.5 text-slate-400">{f.phone}</td>
                    <td className="px-4 py-2.5 text-right text-slate-200">R$ {f.balance.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-slate-400">{new Date(f.purchaseDate).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-2.5 text-slate-400">{new Date(f.dueDate).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-2.5"><Badge variant={f.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <FiadoFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(data) => {
          addFiado(data);
          setModalOpen(false);
        }}
      />
      <FiadoDetailModal fiado={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}
