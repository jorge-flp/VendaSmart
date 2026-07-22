import React from 'react';
import { useApp } from '../context/AppContext';
import Badge from '../components/ui/Badge';
import RevenueLineChart from '../components/charts/RevenueLineChart';
import ProductsBarChart from '../components/charts/ProductsBarChart';

function Section({ title, subtitle, children }) {
  return (
    <section className="p-6 rounded-xl bg-slate-900 border border-slate-800">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export default function Relatorios() {
  const { stats, fiados } = useApp();
  const {
    last7Days,
    faturamentoSemanal,
    lucroSemanal,
    rankedProducts,
    produtosEstoqueBaixo,
    semMovimentacao,
  } = stats;

  const topProdutos = rankedProducts.slice(0, 8);
  const piorProdutos = [...rankedProducts].filter((p) => p.qtySold > 0).slice(-8).reverse();
  const fiadosComSaldo = fiados.filter((f) => f.balance > 0).sort((a, b) => b.balance - a.balance);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios</h1>
          <p className="text-slate-400 text-sm">Visão consolidada de faturamento, estoque e fiados.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm">
            <span className="text-slate-400">Faturamento semanal: </span>
            <span className="text-white font-semibold">R$ {faturamentoSemanal.toFixed(2)}</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm">
            <span className="text-slate-400">Lucro semanal: </span>
            <span className="text-green-400 font-semibold">R$ {lucroSemanal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Section title="Faturamento semanal" subtitle="Faturamento e lucro dos últimos 7 dias">
        <div className="h-72 w-full">
          <RevenueLineChart data={last7Days} />
        </div>
      </Section>

      <div className="grid lg:grid-cols-2 gap-6">
        <Section title="Produtos mais vendidos" subtitle="Ranking por unidades vendidas (todo o período)">
          <div className="h-72 w-full">
            <ProductsBarChart items={topProdutos} color="#16A34A" />
          </div>
        </Section>

        <Section title="Produtos com menor saída" subtitle="Menor volume de vendas entre produtos já vendidos">
          <div className="h-72 w-full">
            <ProductsBarChart items={piorProdutos} color="#F59E0B" label="Unidades vendidas" />
          </div>
        </Section>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Section title="Estoque baixo" subtitle={`${produtosEstoqueBaixo.length} produtos no ou abaixo do mínimo`}>
          {produtosEstoqueBaixo.length === 0 ? (
            <p className="text-slate-500 text-sm">Nenhum produto com estoque baixo. 🎉</p>
          ) : (
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {produtosEstoqueBaixo.map((p) => (
                <div key={p.id} className="flex justify-between items-center text-sm bg-slate-950 border border-slate-800 rounded-md px-3 py-2">
                  <span className="text-slate-300">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{p.qtyInStock}/{p.minStock} un.</span>
                    <Badge variant={p.qtyInStock <= 0 ? 'ruptura' : 'baixo'} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Itens sem movimentação" subtitle="Produtos sem nenhuma venda registrada no período">
          {semMovimentacao.length === 0 ? (
            <p className="text-slate-500 text-sm">Todos os produtos tiveram vendas no período.</p>
          ) : (
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {semMovimentacao.map((p) => (
                <div key={p.id} className="flex justify-between items-center text-sm bg-slate-950 border border-slate-800 rounded-md px-3 py-2">
                  <span className="text-slate-300">{p.name}</span>
                  <span className="text-slate-500">{p.qtyInStock} un. em estoque</span>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Section title="Clientes com fiado" subtitle={`${fiadosComSaldo.length} clientes com saldo devedor`}>
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {fiadosComSaldo.map((f) => (
              <div key={f.id} className="flex justify-between items-center text-sm bg-slate-950 border border-slate-800 rounded-md px-3 py-2">
                <span className="text-slate-300">{f.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">R$ {f.balance.toFixed(2)}</span>
                  <Badge variant={f.status} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Ranking de vendas" subtitle="Top 10 produtos por unidades vendidas">
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {rankedProducts.slice(0, 10).map((p, idx) => (
              <div key={p.id} className="flex justify-between items-center text-sm bg-slate-950 border border-slate-800 rounded-md px-3 py-2">
                <span className="text-slate-300">
                  <span className="text-slate-500 mr-2">#{idx + 1}</span>{p.name}
                </span>
                <span className="text-green-400 font-medium">{p.qtySold} un.</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
