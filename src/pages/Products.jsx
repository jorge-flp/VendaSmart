import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, PackageSearch } from 'lucide-react';
import { useSales } from '../context/SalesContext';

const emptyForm = { name: '', price: '', stock: '', minStock: '' };

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useSales();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editError, setEditError] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = addProduct(form);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setForm(emptyForm);
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
    });
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
    setEditError('');
  };

  const saveEdit = (id) => {
    const result = updateProduct(id, editForm);
    if (!result.success) {
      setEditError(result.message);
      return;
    }
    setEditingId(null);
  };

  const handleDelete = (product) => {
    const confirmed = window.confirm(`Excluir "${product.name}" do catálogo? Essa ação não pode ser desfeita.`);
    if (confirmed) deleteProduct(product.id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Catálogo de Produtos</h1>
        <p className="text-slate-400 text-sm">Cadastre, edite e remova produtos do seu negócio.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Formulário de novo produto */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-400" /> Novo Produto
          </h2>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Croissant"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Estoque inicial</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Estoque mínimo</label>
                <input
                  type="number"
                  min="0"
                  value={form.minStock}
                  onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-400">{error}</p>}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Adicionar Produto
            </button>
          </form>
        </div>

        {/* Lista de produtos */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PackageSearch className="w-5 h-5" /> Produtos Cadastrados ({products.length})
          </h2>

          {products.length === 0 ? (
            <p className="text-slate-500 text-sm">Nenhum produto cadastrado ainda.</p>
          ) : (
            <div className="space-y-3">
              {products.map((product) => {
                const isEditing = editingId === product.id;

                return (
                  <div key={product.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                    {!isEditing ? (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-white text-sm">{product.name}</h4>
                          <div className="flex gap-3 text-xs text-slate-400 mt-1">
                            <span>R$ {product.price.toFixed(2)}</span>
                            <span className={product.stock <= product.minStock ? 'text-rose-400' : ''}>
                              {product.stock} un. em estoque
                            </span>
                            <span>mín: {product.minStock}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => startEdit(product)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="col-span-2 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-green-500"
                            placeholder="Nome"
                          />
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-green-500"
                            placeholder="Preço"
                          />
                          <input
                            type="number"
                            min="0"
                            value={editForm.stock}
                            onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-green-500"
                            placeholder="Estoque"
                          />
                          <input
                            type="number"
                            min="0"
                            value={editForm.minStock}
                            onChange={(e) => setEditForm({ ...editForm, minStock: e.target.value })}
                            className="col-span-2 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-green-500"
                            placeholder="Estoque mínimo"
                          />
                        </div>

                        {editError && <p className="text-xs text-rose-400">{editError}</p>}

                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(product.id)}
                            className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-1"
                          >
                            <Check className="w-4 h-4" /> Salvar
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-1"
                          >
                            <X className="w-4 h-4" /> Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}