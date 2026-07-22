import React from 'react';
import { DollarSign, TrendingUp, Package, Boxes, AlertTriangle, Trophy, TrendingDown } from 'lucide-react';
import StatCard from '../components/Statcard';
import RevenueLineChart from '../components/charts/RevenueLineChart';
import CategoryDoughnutChart from '../components/charts/CategoryDoughnutChart';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { stats } = useApp();
  const {
    faturamentoHoje,
    lucroHoje,
    produtosVendidosHoje,
    itensEstoque,
    produtosEstoqueBaixo,
    maisVendido,
    menosVendido,
    last7Days,
    porCategoria,
  } = stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Painel Geral</h1>
        <p className="text-slate-400 text-sm">Resumo operacional de estoque e vendas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Faturamento do dia" value={`R$ ${faturamentoHoje.toFixed(2)}`} subtext="Vendas de hoje" icon={DollarSign} color="green" />
        <StatCard title="Lucro estimado" value={`R$ ${lucroHoje.toFixed(2)}`} subtext="Lucro das vendas de hoje" icon={TrendingUp} color="blue" />
        <StatCard title="Produtos vendidos hoje" value={`${produtosVendidosHoje} un`} subtext="Unidades vendidas hoje" icon={Package} color="yellow" />
        <StatCard title="Itens em estoque" value={`${itensEstoque} un`} subtext="Total de unidades cadastradas" icon={Boxes} color="blue" />
        <StatCard
          title="Estoque baixo"
          value={`${produtosEstoqueBaixo.length} produtos`}
          subtext="Abaixo do estoque mínimo"
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Mais vendido"
          value={maisVendido?.name ?? '—'}
          subtext={maisVendido ? `${maisVendido.qtySold} unidades vendidas` : 'Sem vendas ainda'}
          icon={Trophy}
          color="green"
        />
        <StatCard
          title="Menos vendido"
          value={menosVendido?.name ?? '—'}
          subtext={menosVendido ? `${menosVendido.qtySold} unidades vendidas` : 'Sem dados'}
          icon={TrendingDown}
          color="yellow"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-6">Faturamento e lucro (últimos 7 dias)</h2>
          <div className="h-72 w-full">
            <RevenueLineChart data={last7Days} />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-6">Estoque por categoria</h2>
          <div className="h-72 w-full">
            <CategoryDoughnutChart data={porCategoria} />
          </div>
        </div>
      </div>
    </div>
  );
}
