// =============================================================
// mockData.js
// Gerador determinístico de dados fictícios para o VendaSmart.
// Nenhum dado aqui é real — tudo é preparado para, no futuro,
// ser substituído por chamadas de API (ver comentários "API:").
// =============================================================

// PRNG simples e determinístico (mulberry32) para que os dados
// sejam sempre os mesmos entre reloads, mas pareçam "aleatórios".
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260722);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const randFloat = (min, max, decimals = 2) =>
  Number((rand() * (max - min) + min).toFixed(decimals));

export const CATEGORIES = [
  'Bebidas',
  'Padaria',
  'Limpeza',
  'Mercearia',
  'Hortifruti',
  'Laticínios',
  'Doces',
  'Higiene',
];

const CATEGORY_ICON = {
  Bebidas: '🥤',
  Padaria: '🥖',
  Limpeza: '🧴',
  Mercearia: '🛒',
  Hortifruti: '🥬',
  Laticínios: '🧀',
  Doces: '🍬',
  Higiene: '🧼',
};

// Nomes-base por categoria (com variações para chegar perto de 80 produtos)
const PRODUCT_NAMES = {
  Bebidas: ['Refrigerante Cola', 'Água Mineral', 'Suco de Laranja', 'Cerveja Pilsen', 'Energético', 'Água de Coco', 'Chá Gelado', 'Refrigerante Guaraná'],
  Padaria: ['Pão Francês (kg)', 'Pão de Forma', 'Pão Artesanal', 'Croissant', 'Baguete', 'Pão de Queijo (un)', 'Rosquinha', 'Sonho'],
  Limpeza: ['Detergente Neutro', 'Sabão em Pó', 'Água Sanitária', 'Amaciante', 'Desinfetante', 'Esponja de Aço', 'Multiuso', 'Álcool 70%'],
  Mercearia: ['Arroz Branco (kg)', 'Feijão Carioca (kg)', 'Açúcar Refinado', 'Óleo de Soja', 'Café Torrado', 'Farinha de Trigo', 'Macarrão Espaguete', 'Sal Refinado'],
  Hortifruti: ['Banana Prata (kg)', 'Tomate (kg)', 'Cebola (kg)', 'Batata (kg)', 'Alface', 'Maçã (kg)', 'Laranja (kg)', 'Cenoura (kg)'],
  Laticínios: ['Leite Integral', 'Queijo Mussarela (kg)', 'Manteiga', 'Iogurte Natural', 'Requeijão', 'Leite Condensado', 'Creme de Leite', 'Queijo Prato (kg)'],
  Doces: ['Chocolate ao Leite', 'Bala de Goma', 'Biscoito Recheado', 'Pirulito', 'Bolo de Chocolate (fatia)', 'Wafer', 'Paçoca', 'Pé de Moleque'],
  Higiene: ['Sabonete', 'Shampoo', 'Papel Higiênico (4un)', 'Pasta de Dente', 'Absorvente', 'Desodorante', 'Fralda Descartável', 'Cotonete'],
};

const SUPPLIERS = ['Distribuidora Silva', 'Atacadão Central', 'Comercial Boa Safra', 'Fornecedor Direto SA', 'Grupo Mercantil BR'];

const MARGIN_RANGE = { Bebidas: [1.25, 1.5], Padaria: [1.6, 2.2], Limpeza: [1.3, 1.6], Mercearia: [1.2, 1.4], Hortifruti: [1.3, 1.8], Laticínios: [1.25, 1.5], Doces: [1.4, 1.9], Higiene: [1.3, 1.6] };
const BASE_COST_RANGE = { Bebidas: [2, 8], Padaria: [1, 6], Limpeza: [3, 12], Mercearia: [4, 18], Hortifruti: [1.5, 7], Laticínios: [3, 15], Doces: [1, 6], Higiene: [3, 20] };

function buildProducts() {
  const products = [];
  let idCounter = 1;
  CATEGORIES.forEach((cat) => {
    const names = PRODUCT_NAMES[cat];
    // Repete a lista com sufixos de marca pra chegar perto de 80 produtos (10 por categoria)
    const brandsExtra = ['', ' (Marca Própria)'];
    names.forEach((baseName) => {
      brandsExtra.forEach((suffix, i) => {
        if (products.length >= 80) return;
        const name = `${baseName}${suffix}`;
        const [costMin, costMax] = BASE_COST_RANGE[cat];
        const costPrice = randFloat(costMin, costMax);
        const [mMin, mMax] = MARGIN_RANGE[cat];
        const sellPrice = Number((costPrice * randFloat(mMin, mMax)).toFixed(2));
        const minStock = randInt(8, 20);
        // Uma fatia proposital fica abaixo do mínimo (estoque baixo) e outra em 0 (ruptura)
        const stockRoll = rand();
        let qtyInStock;
        if (stockRoll < 0.1) qtyInStock = 0;
        else if (stockRoll < 0.25) qtyInStock = randInt(1, minStock - 1);
        else qtyInStock = randInt(minStock + 5, minStock + 120);

        products.push({
          id: `p-${String(idCounter).padStart(3, '0')}`,
          name,
          category: cat,
          photo: CATEGORY_ICON[cat],
          barcode: `789${randInt(1000000, 9999999)}`,
          supplier: pick(SUPPLIERS),
          qtyInStock,
          minStock,
          costPrice,
          sellPrice,
          description: `${name} — categoria ${cat}.`,
          createdAt: new Date(Date.now() - randInt(5, 400) * 86400000).toISOString(),
        });
        idCounter += 1;
      });
    });
  });
  return products;
}

export const PRODUCTS = buildProducts();

// Lucro unitário e margem são sempre derivados, nunca guardados "hardcoded"
export function unitProfit(product) {
  return Number((product.sellPrice - product.costPrice).toFixed(2));
}
export function profitMargin(product) {
  if (!product.sellPrice) return 0;
  return Number(((unitProfit(product) / product.sellPrice) * 100).toFixed(1));
}
export function stockStatus(product) {
  if (product.qtyInStock <= 0) return 'ruptura';
  if (product.qtyInStock <= product.minStock) return 'baixo';
  return 'ok';
}

// -------------------------------------------------------------
// Vendas: ~300 vendas distribuídas nos últimos 30 dias.
// Alguns produtos ficam propositalmente de fora (sem movimentação).
// -------------------------------------------------------------
function buildSales(products) {
  const sales = [];
  // ~85% dos produtos recebem vendas; o resto fica "sem movimentação" para o relatório
  const sellableProducts = products.filter(() => rand() > 0.15);

  for (let i = 0; i < 300; i += 1) {
    const daysAgo = randInt(0, 29);
    const date = new Date(Date.now() - daysAgo * 86400000 - randInt(0, 80000) * 1000);
    const itemCount = randInt(1, 4);
    const items = [];
    for (let j = 0; j < itemCount; j += 1) {
      const product = pick(sellableProducts);
      const qty = randInt(1, 6);
      items.push({
        productId: product.id,
        name: product.name,
        qty,
        unitPrice: product.sellPrice,
        unitCost: product.costPrice,
        subtotal: Number((product.sellPrice * qty).toFixed(2)),
      });
    }
    const total = Number(items.reduce((s, it) => s + it.subtotal, 0).toFixed(2));
    const profit = Number(
      items.reduce((s, it) => s + (it.unitPrice - it.unitCost) * it.qty, 0).toFixed(2)
    );
    sales.push({
      id: `s-${String(i + 1).padStart(4, '0')}`,
      date: date.toISOString(),
      items,
      total,
      profit,
    });
  }
  return sales.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const SALES = buildSales(PRODUCTS);

// -------------------------------------------------------------
// Fiados: 20 clientes com histórico e status calculado.
// -------------------------------------------------------------
const FIRST_NAMES = ['Maria', 'João', 'Ana', 'Pedro', 'Carla', 'Lucas', 'Fernanda', 'Rafael', 'Juliana', 'Marcos', 'Patrícia', 'Bruno', 'Camila', 'Diego', 'Larissa', 'Felipe', 'Renata', 'Gustavo', 'Aline', 'Thiago'];
const LAST_NAMES = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Pereira', 'Almeida', 'Ribeiro', 'Carvalho', 'Gomes'];

function buildFiados(products) {
  return FIRST_NAMES.map((first, i) => {
    const last = pick(LAST_NAMES);
    const name = `${first} ${last}`;
    const purchaseDaysAgo = randInt(1, 45);
    const purchaseDate = new Date(Date.now() - purchaseDaysAgo * 86400000);
    const termDays = pick([7, 15, 30]);
    const dueDate = new Date(purchaseDate.getTime() + termDays * 86400000);

    const itemCount = randInt(1, 3);
    const boughtItems = Array.from({ length: itemCount }, () => {
      const product = pick(products);
      const qty = randInt(1, 5);
      return { productId: product.id, name: product.name, qty, subtotal: Number((product.sellPrice * qty).toFixed(2)) };
    });
    const total = Number(boughtItems.reduce((s, it) => s + it.subtotal, 0).toFixed(2));

    const paidRoll = rand();
    let valuePaid = 0;
    if (paidRoll < 0.35) valuePaid = total; // já pagou tudo
    else if (paidRoll < 0.65) valuePaid = Number((total * randFloat(0.2, 0.7)).toFixed(2)); // pagou parte

    const balance = Number((total - valuePaid).toFixed(2));
    const isPastDue = dueDate.getTime() < Date.now() && balance > 0;
    const status = balance <= 0 ? 'pago' : isPastDue ? 'atrasado' : 'aberto';

    const history = [
      { id: `h-${i}-1`, date: purchaseDate.toISOString(), type: 'compra', value: total, note: 'Compra fiado registrada' },
    ];
    if (valuePaid > 0) {
      history.push({
        id: `h-${i}-2`,
        date: new Date(purchaseDate.getTime() + randInt(1, termDays) * 86400000).toISOString(),
        type: 'pagamento',
        value: valuePaid,
        note: valuePaid >= total ? 'Pagamento total' : 'Pagamento parcial',
      });
    }

    return {
      id: `f-${String(i + 1).padStart(3, '0')}`,
      name,
      phone: `(85) 9${randInt(1000, 9999)}-${randInt(1000, 9999)}`,
      items: boughtItems,
      total,
      valuePaid,
      balance,
      purchaseDate: purchaseDate.toISOString(),
      dueDate: dueDate.toISOString(),
      status,
      observations: '',
      history,
    };
  });
}

export const FIADOS = buildFiados(PRODUCTS);
