import React, { createContext, useState, useContext, useEffect } from 'react';

const SalesContext = createContext();

export function SalesProvider({ children }) {
  const [products, setProducts] = useState([]);

  const [salesValue, setSalesValue] = useState(1250.00);
  const [salesQty, setSalesQty] = useState(85);
  const [salesHistory, setSalesHistory] = useState([
    { id: 1, name: 'Café Especial', qty: 2, total: 25.00, time: '14:20', seller: null },
    { id: 2, name: 'Pão Artesanal', qty: 5, total: 32.50, time: '13:45', seller: null },
  ]);

  const [closingHistory, setClosingHistory] = useState([]);

  // --- Metas ---
  const [salesGoal, setSalesGoal] = useState(1500);
  const [productGoals, setProductGoalsState] = useState({});

  const setProductGoal = (productId, qty) => {
    setProductGoalsState((prev) => ({ ...prev, [productId]: parseInt(qty) || 0 }));
  };

  const loadProducts = async () => {
  try {
    const response = await fetch('http://localhost:3000/products');
    const data = await response.json();

    const formattedProducts = data.map(product => ({
      ...product,
      minStock: product.min_stock
    }));

    setProducts(formattedProducts);

  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
};

useEffect(() => {
  loadProducts();
}, []);

  // --- Vendas ---
  const addSale = (productId, quantity, sellerName = null) => {
    const qty = parseInt(quantity);
    const product = products.find((p) => p.id === Number(productId));

    if (!product) return { success: false, message: 'Produto não encontrado.' };
    if (!qty || qty <= 0) return { success: false, message: 'Quantidade inválida.' };
    if (qty > product.stock) {
      return { success: false, message: `Estoque insuficiente. Disponível: ${product.stock} un.` };
    }

    const total = product.price * qty;

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: p.stock - qty } : p))
    );

    setSalesValue((prev) => prev + total);
    setSalesQty((prev) => prev + qty);

    const newSale = {
      id: Date.now(),
      name: product.name,
      qty,
      total,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      seller: sellerName,
    };
    setSalesHistory((prev) => [newSale, ...prev]);

    return { success: true, sale: newSale };
  };

  const restockProduct = (productId, amount) => {
    const add = parseInt(amount);
    if (!add || add <= 0) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === Number(productId) ? { ...p, stock: p.stock + add } : p))
    );
  };

  // --- Fechamento de caixa ---
  const closeRegister = () => {
    if (salesHistory.length === 0) {
      return { success: false, message: 'Não há vendas registradas para fechar.' };
    }

    const breakdown = salesHistory.reduce((acc, sale) => {
      if (!acc[sale.name]) acc[sale.name] = { name: sale.name, qty: 0, total: 0 };
      acc[sale.name].qty += sale.qty;
      acc[sale.name].total += sale.total;
      return acc;
    }, {});

    const closing = {
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      closedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalValue: salesValue,
      totalQty: salesQty,
      salesCount: salesHistory.length,
      averageTicket: salesValue / salesHistory.length,
      breakdown: Object.values(breakdown).sort((a, b) => b.total - a.total),
    };

    setClosingHistory((prev) => [closing, ...prev]);

    setSalesValue(0);
    setSalesQty(0);
    setSalesHistory([]);

    return { success: true, closing };
  };

  // --- Catálogo de produtos (CRUD) ---
  const validateProductInput = ({ name, price, stock, minStock }) => {
    if (!name || !name.trim()) return 'Nome do produto é obrigatório.';
    const p = parseFloat(price);
    const s = parseInt(stock);
    const ms = parseInt(minStock);
    if (isNaN(p) || p <= 0) return 'Preço deve ser maior que zero.';
    if (isNaN(s) || s < 0) return 'Estoque não pode ser negativo.';
    if (isNaN(ms) || ms < 0) return 'Estoque mínimo não pode ser negativo.';
    return null;
  };

  const addProduct = ({ name, price, stock, minStock }) => {
    const error = validateProductInput({ name, price, stock, minStock });
    if (error) return { success: false, message: error };

    const newProduct = {
      id: Date.now(),
      name: name.trim(),
      price: parseFloat(price),
      stock: parseInt(stock),
      minStock: parseInt(minStock),
    };
    setProducts((prev) => [...prev, newProduct]);
    return { success: true, product: newProduct };
  };

  const updateProduct = (id, { name, price, stock, minStock }) => {
    const error = validateProductInput({ name, price, stock, minStock });
    if (error) return { success: false, message: error };

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, name: name.trim(), price: parseFloat(price), stock: parseInt(stock), minStock: parseInt(minStock) }
          : p
      )
    );
    return { success: true };
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <SalesContext.Provider
      value={{
        products,
        salesValue,
        salesQty,
        salesHistory,
        closingHistory,
        salesGoal,
        setSalesGoal,
        productGoals,
        setProductGoal,
        addSale,
        restockProduct,
        closeRegister,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export const useSales = () => useContext(SalesContext);