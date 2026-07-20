import React, { createContext, useState, useContext } from 'react';

const SalesContext = createContext();

export function SalesProvider({ children }) {
  const [salesValue, setSalesValue] = useState(1250.00);
  const [salesQty, setSalesQty] = useState(85);
  const [salesHistory, setSalesHistory] = useState([
    { id: 1, name: 'Café Especial', qty: 2, total: 25.00, time: '14:20' },
    { id: 2, name: 'Pão Artesanal', qty: 5, total: 32.50, time: '13:45' },
  ]);

  const addSale = (name, price, quantity) => {
    const qty = parseInt(quantity);
    const total = parseFloat(price) * qty;

    setSalesValue((prev) => prev + total);
    setSalesQty((prev) => prev + qty);

    const newSale = {
      id: Date.now(),
      name,
      qty,
      total,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSalesHistory((prev) => [newSale, ...prev]);
  };

  return (
    <SalesContext.Provider value={{ salesValue, salesQty, salesHistory, addSale }}>
      {children}
    </SalesContext.Provider>
  );
}

export const useSales = () => useContext(SalesContext);     