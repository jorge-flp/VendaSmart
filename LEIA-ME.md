# VendaSmart — Evolução do protótipo (Estoque, Vendas, Fiados, Relatórios)

Stack mantida como está: **Vite + React + JSX + Tailwind + Chart.js/react-chartjs-2 + lucide-react**.
Nenhuma dependência nova foi adicionada ao `package.json` (Framer Motion e Recharts, pedidos
no brief original, **não** foram usados — as animações usam apenas transições CSS/Tailwind, e
os gráficos usam o `chart.js` que já estava no projeto).

## Como aplicar

Copie os arquivos deste pacote para dentro de `src/` no seu projeto, substituindo os que já
existem com o mesmo nome:

```
src/
├── App.jsx                              (substitui)
├── data/
│   └── mockData.js                      (novo — 80 produtos, 300 vendas, 20 fiados)
├── context/
│   └── AppContext.jsx                   (novo — substitui SalesContext.jsx)
├── components/
│   ├── Sidebar.jsx                      (substitui — novo menu)
│   ├── Statcard.jsx                     (mantido, sem alterações)
│   ├── ProductFormModal.jsx             (novo)
│   ├── FiadoFormModal.jsx               (novo)
│   ├── FiadoDetailModal.jsx             (novo)
│   ├── ui/Modal.jsx, Badge.jsx, EmptyState.jsx, SuccessOverlay.jsx  (novos)
│   └── charts/chartSetup.js, RevenueLineChart.jsx, ProductsBarChart.jsx, CategoryDoughnutChart.jsx (novos)
└── pages/
    ├── Dashboard.jsx                    (substitui)
    ├── Estoque.jsx                      (novo — substitui a ideia de "Produtos")
    ├── NovaVenda.jsx                    (novo — substitui Sales.jsx)
    ├── Fiados.jsx                       (novo)
    ├── Relatorios.jsx                   (novo)
    └── Configuracoes.jsx                (novo)
```

### Arquivos antigos que podem ser removidos

Depois de copiar o pacote acima, estes arquivos do projeto original ficam órfãos (nada mais
os importa) e podem ser apagados:

- `src/context/SalesContext.jsx` → substituído por `AppContext.jsx`
- `src/pages/Sales.jsx` → substituído por `NovaVenda.jsx`
- `src/components/Saleschart.jsx` → substituído pelos componentes em `components/charts/`

`src/pages/Demand.jsx` (IA Demanda) **não foi apagado** — só não está mais no menu, porque a
lista de menu do brief não a incluía. Se você quiser mantê-la acessível, é só adicionar de
volta um item no `Sidebar.jsx` e uma linha no `App.jsx`.

## Decisões de arquitetura (resumo)

- **`AppContext`** é a única fonte de verdade (estoque, vendas, fiados) e centraliza a regra
  "venda diminui estoque automaticamente". Cada ação (`addProduct`, `registerSale`, `addFiado`,
  `registerPayment`) está comentada com o endpoint de API equivalente (`API: POST /sales`, etc.),
  então trocar mock por backend real depois é só trocar o corpo dessas funções — as telas não
  mudam.
- **`mockData.js`** usa um gerador pseudoaleatório com seed fixa, então os dados são sempre os
  mesmos entre reloads (necessário para os relatórios fazerem sentido: sempre existe estoque
  baixo, item parado, ranking de vendas etc.).
- Paleta e padrões visuais (fundo `slate-950`, cards `slate-900`, acento verde) foram **mantidos
  idênticos** ao protótipo original — é uma evolução, não um redesign.

## Autocrítica / pontos de atenção (revisão)

- **Validação é só de UI.** `registerPayment` e `registerSale` bloqueiam valores inválidos no
  front, mas isso não substitui validação de backend — quando a API real existir, repita essas
  checagens no servidor (nunca confiar só no client).
- **Acessibilidade parcial:** o `Modal` tem `aria-modal`/`aria-label` e fecha com `Esc`, mas os
  campos de formulário não têm `htmlFor`/`id` explícitos ligando label↔input. Funciona
  visualmente, mas para produção vale reforçar para leitores de tela.
- **Concorrência:** como é tudo `useState` em memória (sem backend), não há race conditions reais
  agora — mas se/quando vender múltiplos itens do mesmo produto em paralelo (duas abas, por
  exemplo), o controle de estoque real vai precisar de lock otimista no banco (a mesma ideia do
  `Optimistic Lock` mencionado no seu guia de banco de dados).
- **Ordem do gráfico horizontal** ("Produtos mais vendidos") depende da ordem padrão do Chart.js
  para `indexAxis: 'y'`; é só um detalhe estético, sem impacto funcional.

## Próximo passo natural

Quando quiser sair do mock para uma API real, cada comentário `// API: ...` dentro de
`AppContext.jsx` já indica o endpoint e o verbo HTTP esperado — isso facilita o trabalho do
time de backend (Spring Boot/PostgreSQL, se for esse o plano).
