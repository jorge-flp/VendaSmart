import React, { createContext, useState, useContext } from 'react';

const addSale = (productId, quantity) => {
    const qty = parseInt(quantity);
    const product = products.find((p) => p.id === Number(productId));
    if (!product) return { success: false, message: 'Produto não encontrado.' };
    if (qty <= 0) return { success: false, message: 'Quantidade inválida.' };
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
    };
    setSalesHistory((prev) => [newSale, ...prev]);

    return { success: true, sale: newSale }; // ← agora devolve a venda criada
  };

const SalesContext = createContext();

export function SalesProvider({ children }) {
  const [products, setProducts] = useState([
    { id: 1, name: 'Café Especial', price: 12.50, stock: 40, minStock: 10 },
    { id: 2, name: 'Bolo Chocolate', price: 25.00, stock: 8,  minStock: 10 },
    { id: 3, name: 'Suco Natural',   price: 8.00,  stock: 25, minStock: 8  },
    { id: 4, name: 'Pão Artesanal',  price: 6.50,  stock: 60, minStock: 15 },
  ]);

  const [salesValue, setSalesValue] = useState(1250.00);
  const [salesQty, setSalesQty] = useState(85);
  const [salesHistory, setSalesHistory] = useState([
    { id: 1, name: 'Café Especial', qty: 2, total: 25.00, time: '14:20' },
    { id: 2, name: 'Pão Artesanal', qty: 5, total: 32.50, time: '13:45' },
  ]);

  // Registra uma venda, valida e deduz do estoque
  const addSale = (productId, quantity) => {
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
    };
    setSalesHistory((prev) => [newSale, ...prev]);

    return { success: true, sale: newSale };
  };

  // Repõe estoque de um produto
  const restockProduct = (productId, amount) => {
    const add = parseInt(amount);
    if (!add || add <= 0) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === Number(productId) ? { ...p, stock: p.stock + add } : p))
    );
  };

  return (
    <SalesContext.Provider
      value={{
        products,
        salesValue,
        salesQty,
        salesHistory,
        addSale,
        restockProduct,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export const useSales = () => useContext(SalesContext);