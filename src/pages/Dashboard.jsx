import React from 'react';
import { DollarSign, Package, Trophy, AlertTriangle } from 'lucide-react';
import StatCard from '../components/Statcard';
import SalesChart from '../components/Saleschart';
import { useSales } from '../context/SalesContext';

export default function Dashboard() {
  const { salesValue, salesQty, products } = useSales();

  const lowStockItems = products.filter((p) => p.stock <= p.minStock);
  const lowStockText =
    lowStockItems.length === 0
      ? 'Tudo certo'
      : lowStockItems.length === 1
      ? lowStockItems[0].name
      : `${lowStockItems.length} produtos`;
  const lowStockSubtext =
    lowStockItems.length === 0
      ? 'Nenhum produto em alerta'
      : lowStockItems.length === 1
      ? `Restam ${lowStockItems[0].stock} un.`
      : 'Verifique o estoque';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Painel Geral</h1>
        <p className="text-slate-400 text-sm">Resumo operacional de produção e vendas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Vendas Hoje" value={`R$ ${salesValue.toFixed(2)}`} subtext="+14% vs. ontem" icon={DollarSign} color="green" />
        <StatCard title="Produtos Vendidos" value={`${salesQty} un`} subtext="Capacidade normal" icon={Package} color="blue" />
        <StatCard title="Mais Vendido" value="Café Especial" subtext="90 vendas registradas" icon={Trophy} color="yellow" />
        <StatCard title="Baixa Saída" value={lowStockText} subtext={lowStockSubtext} icon={AlertTriangle} color="rose" />
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
        <h2 className="text-lg font-semibold text-white mb-6">Comparativo Semanal: Produção vs Vendas</h2>
        <div className="h-72 w-full">
          <SalesChart />
        </div>
      </div>
    </div>
  );
}