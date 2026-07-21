import React, { useState, useMemo } from 'react';
import { Sparkles, Bot, Send, TrendingUp, TrendingDown, AlertTriangle, PackageCheck } from 'lucide-react';
import { useSales } from '../context/SalesContext';

function computeDemandAnalysis(products, salesHistory, closingHistory) {
  const todayByProduct = salesHistory.reduce((acc, sale) => {
    acc[sale.name] = (acc[sale.name] || 0) + sale.qty;
    return acc;
  }, {});

  return products.map((product) => {
    const dailyQtyList = [];

    closingHistory.forEach((closing) => {
      const entry = closing.breakdown.find((b) => b.name === product.name);
      dailyQtyList.push(entry ? entry.qty : 0);
    });

    if (salesHistory.length > 0) {
      dailyQtyList.push(todayByProduct[product.name] || 0);
    }

    const daysTracked = dailyQtyList.length;
    const avgDailyQty = daysTracked > 0
      ? dailyQtyList.reduce((sum, q) => sum + q, 0) / daysTracked
      : 0;

    const coverageDays = avgDailyQty > 0 ? product.stock / avgDailyQty : Infinity;

    const isLowStock = product.stock <= product.minStock;
    const isRunningOut = coverageDays < 1.5;

    const suggestedProduction = avgDailyQty > 0 ? Math.ceil(avgDailyQty * 1.15) : 0;

    let trend = 'estavel';
    if (dailyQtyList.length >= 2) {
      const last = dailyQtyList[dailyQtyList.length - 1];
      const previousAvg =
        dailyQtyList.slice(0, -1).reduce((s, q) => s + q, 0) / (dailyQtyList.length - 1);
      if (previousAvg > 0) {
        if (last > previousAvg * 1.15) trend = 'alta';
        else if (last < previousAvg * 0.85) trend = 'queda';
      }
    }

    return { ...product, daysTracked, avgDailyQty, coverageDays, isLowStock, isRunningOut, suggestedProduction, trend };
  });
}

function buildAssistantReply(question, analysis) {
  const q = question.toLowerCase();
  const mentioned = analysis.find((a) => q.includes(a.name.toLowerCase()));

  if (mentioned) {
    if (mentioned.daysTracked === 0) {
      return `Ainda não tenho histórico de vendas suficiente para "${mentioned.name}". Registre vendas e feche o caixa ao menos uma vez para eu conseguir estimar a demanda.`;
    }
    const coverageText = mentioned.coverageDays === Infinity
      ? 'estoque não deve acabar tão cedo, no ritmo atual'
      : `estoque cobre aproximadamente ${mentioned.coverageDays.toFixed(1)} dia(s) no ritmo atual`;

    return `"${mentioned.name}": média de ${mentioned.avgDailyQty.toFixed(1)} un./dia vendidas (baseado em ${mentioned.daysTracked} dia(s) de dados). O ${coverageText}. Sugiro produzir cerca de ${mentioned.suggestedProduction} un. para amanhã${mentioned.isLowStock ? ' — estoque já está abaixo do mínimo definido.' : '.'}`;
  }

  if (q.includes('amanha') || q.includes('amanhã') || q.includes('produzir') || q.includes('produção') || q.includes('producao')) {
    const withData = analysis.filter((a) => a.daysTracked > 0 && a.avgDailyQty > 0);
    if (withData.length === 0) {
      return 'Ainda não há dados suficientes de vendas para sugerir produção. Registre vendas e feche o caixa por pelo menos um dia para eu começar a calcular.';
    }
    const lines = withData.sort((a, b) => b.suggestedProduction - a.suggestedProduction).map((a) => `• ${a.name}: ${a.suggestedProduction} un.`);
    return `Com base no histórico de vendas, sugiro a seguinte produção para amanhã:\n\n${lines.join('\n')}`;
  }

  if (q.includes('alerta') || q.includes('acabando') || q.includes('falta')) {
    const critical = analysis.filter((a) => a.isRunningOut || a.isLowStock);
    if (critical.length === 0) return 'Nenhum produto em alerta de estoque no momento. Tudo dentro do esperado.';
    const lines = critical.map((a) => `• ${a.name}: ${a.stock} un. em estoque`);
    return `Produtos que merecem atenção:\n\n${lines.join('\n')}`;
  }

  return 'Posso ajudar com: sugestão de produção para amanhã, análise de um produto específico (cite o nome), ou alertas de estoque. O que você gostaria de saber?';
}

export default function Demand() {
  const { products, salesHistory, closingHistory } = useSales();

  const analysis = useMemo(
    () => computeDemandAnalysis(products, salesHistory, closingHistory),
    [products, salesHistory, closingHistory]
  );

  const alerts = analysis.filter((a) => a.isRunningOut || a.isLowStock);
  const hasEnoughData = closingHistory.length > 0 || salesHistory.length > 0;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: hasEnoughData
        ? 'Olá! Analisei seus dados de vendas e estoque. Pergunte sobre um produto específico, ou peça uma sugestão de produção para amanhã.'
        : 'Olá! Ainda não tenho dados de vendas suficientes. Registre vendas e feche o caixa ao menos uma vez para eu começar a gerar análises reais.',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    const replyText = buildAssistantReply(input, analysis);

    setMessages((prev) => [...prev, userMsg, { id: Date.now() + 1, sender: 'ai', text: replyText }]);
    setInput('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          VendaSmart IA <Sparkles className="w-5 h-5 text-amber-400" />
        </h1>
        <p className="text-stone-400 text-sm">Análise de demanda baseada no histórico real de vendas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 text-sm mb-2">
            <PackageCheck className="w-4 h-4" /> Produtos Analisados
          </div>
          <div className="text-3xl font-bold text-white">{products.length}</div>
        </div>
        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 text-sm mb-2">
            <AlertTriangle className="w-4 h-4" /> Em Alerta
          </div>
          <div className="text-3xl font-bold text-white">{alerts.length}</div>
        </div>
        <div className="p-6 rounded-xl bg-stone-900 border border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 text-sm mb-2">
            <TrendingUp className="w-4 h-4" /> Dias de Dados
          </div>
          <div className="text-3xl font-bold text-white">
            {closingHistory.length + (salesHistory.length > 0 ? 1 : 0)}
          </div>
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Sugestão de Produção por Produto</h2>
        {!hasEnoughData ? (
          <p className="text-stone-500 text-sm">
            Nenhum dado de vendas registrado ainda. Registre vendas em "Registrar Venda" para começar.
          </p>
        ) : (
          <div className="space-y-3">
            {analysis.map((a) => (
              <div key={a.id} className="p-4 bg-stone-950 rounded-lg border border-stone-800 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white text-sm">{a.name}</h4>
                    {a.trend === 'alta' && <TrendingUp className="w-3.5 h-3.5 text-amber-400" />}
                    {a.trend === 'queda' && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                    {(a.isRunningOut || a.isLowStock) && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        alerta
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    {a.daysTracked === 0
                      ? 'sem histórico ainda'
                      : `média ${a.avgDailyQty.toFixed(1)} un./dia · estoque atual ${a.stock} un.`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Sugestão p/ amanhã</span>
                  <span className="text-amber-400 font-semibold text-sm">
                    {a.suggestedProduction > 0 ? `${a.suggestedProduction} un.` : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 h-96 flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`p-4 rounded-xl text-sm max-w-md whitespace-pre-line ${msg.sender === 'user' ? 'bg-orange-600 text-white' : 'bg-stone-950 border border-stone-800 text-stone-200'}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 pt-4 border-t border-stone-800">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Quanto devo produzir de Café Especial?"
            className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500"
          />
          <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}