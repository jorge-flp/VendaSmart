import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect
} from 'react';

import { PRODUCTS, SALES, FIADOS, unitProfit, profitMargin, stockStatus } from '../data/mockData';

// =============================================================
// AppContext
// Fonte única de verdade do protótipo. Toda a "regra de negócio"
// (venda diminui estoque, pagamento de fiado reduz saldo, etc.)
// mora aqui, isolada das telas — quando existir um backend real,
// essas funções passam a chamar `fetch`/API em vez de `setState`.
// =============================================================

const AppContext = createContext(null);

function isSameDay(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  return da.toDateString() === db.toDateString();
}

export function AppProvider({ children }) {

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState(SALES);
  const [fiados, setFiados] = useState(FIADOS);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('http://localhost:3000/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    }

    loadProducts();
  }, []);

  // ---------- ESTOQUE ----------
  // API: POST /products
  const addProduct = useCallback(async (data) => {
  const response = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const newProduct = await response.json();

  setProducts((prev) => [newProduct, ...prev]);

  return newProduct;
}, []);

  // API: PATCH /products/:id
  const updateProduct = useCallback((id, patch) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  // ---------- VENDAS ----------
  // cartItems: [{ productId, qty }]
  // API: POST /sales  (o backend faria essa baixa de estoque de forma transacional)
  const registerSale = useCallback(
    (cartItems) => {
      let createdSale = null;
      setProducts((prevProducts) => {
        const productMap = new Map(prevProducts.map((p) => [p.id, p]));
        const items = cartItems.map(({ productId, qty }) => {
          const product = productMap.get(productId);
          return {
            productId,
            name: product.name,
            qty,
            unitPrice: product.sellPrice,
            unitCost: product.costPrice,
            subtotal: Number((product.sellPrice * qty).toFixed(2)),
          };
        });
        const total = Number(items.reduce((s, it) => s + it.subtotal, 0).toFixed(2));
        const profit = Number(
          items.reduce((s, it) => s + (it.unitPrice - it.unitCost) * it.qty, 0).toFixed(2)
        );
        createdSale = { id: `s-${Date.now()}`, date: new Date().toISOString(), items, total, profit };

        // baixa de estoque
        return prevProducts.map((p) => {
          const sold = cartItems.find((c) => c.productId === p.id);
          if (!sold) return p;
          return { ...p, qtyInStock: Math.max(0, p.qtyInStock - sold.qty) };
        });
      });
      setSales((prev) => [createdSale, ...prev]);
      return createdSale;
    },
    []
  );

  // ---------- FIADOS ----------
  // API: POST /fiados
  const addFiado = useCallback((data) => {
    const total = Number((data.items || []).reduce((s, it) => s + it.subtotal, 0).toFixed(2));
    const newFiado = {
      id: `f-${Date.now()}`,
      valuePaid: 0,
      balance: total,
      status: 'aberto',
      history: [{ id: `h-${Date.now()}`, date: new Date().toISOString(), type: 'compra', value: total, note: 'Compra fiado registrada' }],
      ...data,
      total,
    };
    setFiados((prev) => [newFiado, ...prev]);
    return newFiado;
  }, []);

  // API: POST /fiados/:id/pagamentos
  const registerPayment = useCallback((fiadoId, amount) => {
    setFiados((prev) =>
      prev.map((f) => {
        if (f.id !== fiadoId) return f;
        const valuePaid = Number((f.valuePaid + amount).toFixed(2));
        const balance = Number((f.total - valuePaid).toFixed(2));
        const isPastDue = new Date(f.dueDate).getTime() < Date.now() && balance > 0;
        const status = balance <= 0 ? 'pago' : isPastDue ? 'atrasado' : 'aberto';
        return {
          ...f,
          valuePaid,
          balance: Math.max(0, balance),
          status,
          history: [
            ...f.history,
            { id: `h-${Date.now()}`, date: new Date().toISOString(), type: 'pagamento', value: amount, note: 'Pagamento registrado' },
          ],
        };
      })
    );
  }, []);

  // ---------- ESTATÍSTICAS DERIVADAS ----------
  const stats = useMemo(() => {
    const today = new Date();
    const todaySales = sales.filter((s) => isSameDay(s.date, today));
    const faturamentoHoje = Number(todaySales.reduce((s, v) => s + v.total, 0).toFixed(2));
    const lucroHoje = Number(todaySales.reduce((s, v) => s + v.profit, 0).toFixed(2));
    const produtosVendidosHoje = todaySales.reduce(
      (s, v) => s + v.items.reduce((a, it) => a + it.qty, 0),
      0
    );

    const itensEstoque = products.reduce((s, p) => s + p.qtyInStock, 0);
    const produtosEstoqueBaixo = products.filter((p) => stockStatus(p) !== 'ok');

    // vendas agregadas por produto (todo o período)
    const qtyByProduct = new Map();
    sales.forEach((s) =>
      s.items.forEach((it) => {
        qtyByProduct.set(it.productId, (qtyByProduct.get(it.productId) || 0) + it.qty);
      })
    );
    const rankedProducts = products
      .map((p) => ({ ...p, qtySold: qtyByProduct.get(p.id) || 0 }))
      .sort((a, b) => b.qtySold - a.qtySold);

    const maisVendido = rankedProducts[0];
    const semMovimentacao = rankedProducts.filter((p) => p.qtySold === 0);
    const menosVendido = rankedProducts.filter((p) => p.qtySold > 0).slice(-1)[0] || semMovimentacao[0];

    // faturamento dos últimos 7 dias (para gráficos)
    const last7Days = Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - idx));
      const daySales = sales.filter((s) => isSameDay(s.date, d));
      return {
        label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
        faturamento: Number(daySales.reduce((s, v) => s + v.total, 0).toFixed(2)),
        lucro: Number(daySales.reduce((s, v) => s + v.profit, 0).toFixed(2)),
      };
    });

    const faturamentoSemanal = Number(last7Days.reduce((s, d) => s + d.faturamento, 0).toFixed(2));
    const lucroSemanal = Number(last7Days.reduce((s, d) => s + d.lucro, 0).toFixed(2));

    const categoriaMap = new Map();
    products.forEach((p) => {
      categoriaMap.set(p.category, (categoriaMap.get(p.category) || 0) + p.qtyInStock);
    });

    return {
      faturamentoHoje,
      lucroHoje,
      produtosVendidosHoje,
      itensEstoque,
      produtosEstoqueBaixo,
      maisVendido,
      menosVendido,
      semMovimentacao,
      rankedProducts,
      last7Days,
      faturamentoSemanal,
      lucroSemanal,
      porCategoria: Array.from(categoriaMap.entries()).map(([categoria, qtd]) => ({ categoria, qtd })),
    };
  }, [products, sales]);

  const value = useMemo(
    () => ({
      products,
      sales,
      fiados,
      stats,
      addProduct,
      updateProduct,
      registerSale,
      addFiado,
      registerPayment,
      unitProfit,
      profitMargin,
      stockStatus,
    }),
    [products, sales, fiados, stats, addProduct, updateProduct, registerSale, addFiado, registerPayment]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de <AppProvider>');
  return ctx;
};
