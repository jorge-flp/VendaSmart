import React, { useState } from 'react';
import { Target, FileDown, TrendingUp } from 'lucide-react';
import { useSales } from '../context/SalesContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Goals() {
  const {
    products,
    salesValue,
    salesHistory,
    closingHistory,
    salesGoal,
    setSalesGoal,
    productGoals,
    setProductGoal,
  } = useSales();

  const [goalInput, setGoalInput] = useState(salesGoal);

  const handleSaveGoal = (e) => {
    e.preventDefault();
    setSalesGoal(parseFloat(goalInput) || 0);
  };

  const progressPercent = salesGoal > 0 ? Math.min((salesValue / salesGoal) * 100, 100) : 0;

  const productSalesToday = salesHistory.reduce((acc, s) => {
    acc[s.name] = (acc[s.name] || 0) + s.qty;
    return acc;
  }, {});

  const handleGeneratePdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Pão e Café da Roça — Relatório de Metas', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      14,
      27
    );

    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text('Meta Geral de Vendas', 14, 38);

    autoTable(doc, {
      startY: 42,
      head: [['Meta (R$)', 'Realizado (R$)', 'Atingido']],
      body: [[salesGoal.toFixed(2), salesValue.toFixed(2), `${progressPercent.toFixed(0)}%`]],
      theme: 'grid',
      headStyles: { fillColor: [217, 119, 6] },
    });

    const productRows = products.map((p) => {
      const goal = productGoals[p.id] || 0;
      const sold = productSalesToday[p.name] || 0;
      const pct = goal > 0 ? `${Math.min((sold / goal) * 100, 100).toFixed(0)}%` : '—';
      return [p.name, goal || '—', sold, pct];
    });

    doc.text('Metas por Produto (hoje)', 14, doc.lastAutoTable.finalY + 12);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [['Produto', 'Meta (un.)', 'Vendido (un.)', 'Atingido']],
      body: productRows,
      theme: 'grid',
      headStyles: { fillColor: [217, 119, 6] },
    });

    if (closingHistory.length > 0) {
      doc.text('Histórico de Fechamentos', 14, doc.lastAutoTable.finalY + 12);
      const closingRows = closingHistory.map((c) => [
        `${c.date} ${c.closedAt}`,
        `R$ ${c.totalValue.toFixed(2)}`,
        c.salesCount,
        `R$ ${c.averageTicket.toFixed(2)}`,
      ]);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 16,
        head: [['Data', 'Total', 'Vendas', 'Ticket Médio']],
        body: closingRows,
        theme: 'grid',
        headStyles: { fillColor: [217, 119, 6] },
      });
    }

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text('Relatório gerado automaticamente pelo VendaSmart.', 14, doc.internal.pageSize.height - 10);

    doc.save(`relatorio-metas-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Metas & Relatórios</h1>
        <p className="text-stone-400 text-sm">Defina metas para a equipe e gere relatórios em PDF.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" /> Meta Geral de Vendas
            </h2>
            <form onSubmit={handleSaveGoal} className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="flex-1 bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                placeholder="Ex: 1500.00"
              />
              <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-4 rounded-lg text-sm">
                Salvar
              </button>
            </form>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-stone-400 mb-1">
                <span>R$ {salesValue.toFixed(2)} de R$ {salesGoal.toFixed(2)}</span>
                <span>{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-4">
            <h3 className="text-sm font-semibold text-white mb-3">Metas por Produto (unidades/dia)</h3>
            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-stone-200">{p.name}</span>
                  <input
                    type="number"
                    min="0"
                    value={productGoals[p.id] || ''}
                    onChange={(e) => setProductGoal(p.id, e.target.value)}
                    placeholder="meta"
                    className="w-20 bg-stone-950 border border-stone-800 rounded p-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" /> Relatório para a Equipe
            </h2>
            <p className="text-sm text-stone-400 mb-4">
              Gere um PDF com as metas definidas, os resultados atuais e o histórico de fechamentos de caixa —
              pronto para compartilhar com a equipe.
            </p>
          </div>
          <button
            onClick={handleGeneratePdf}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <FileDown className="w-4 h-4" /> Gerar Relatório PDF
          </button>
        </div>
      </div>
    </div>
  );
}