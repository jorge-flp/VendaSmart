# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato segue as recomendações de [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

---

## [Unreleased]

Espaço reservado para futuras alterações ainda não lançadas.

---

## [0.2.0]

### Adicionado
- Novo Dashboard com indicadores de faturamento, lucro, produtos vendidos e estoque baixo.
- Controle de Estoque com busca, filtro por categoria e ordenação.
- Controle de Fiados com cadastro, pagamento parcial/total e status (aberto/atrasado/pago).
- Fluxo de Nova Venda com carrinho, validação de estoque e finalização.
- Página de Relatórios (ranking de produtos, estoque baixo, itens parados, fiados em aberto).
- Gráficos de faturamento/lucro (linha) e estoque por categoria (doughnut) com Chart.js.
- Componentes de UI reutilizáveis: `Modal`, `Badge`, `EmptyState`, `SuccessOverlay`.
- Geração de relatório em PDF (metas e fechamento) usando `jspdf` + `jspdf-autotable`.

### Alterado
- Refatoração do gerenciamento de estado: migração de `SalesContext` para `AppContext`,
  centralizando produtos, vendas e fiados em uma única fonte de verdade.
- Substituição de dados estáticos por `mockData.js`, com geração determinística de
  produtos, vendas e fiados.

---

## [0.1.0]

### Adicionado
- Estrutura inicial do projeto Front-End com Vite + React + Tailwind CSS.
- Configuração inicial do Back-End com Express + MySQL (`mysql2`).
- Schema inicial do banco de dados (`database.sql`) com tabelas de usuários, produtos,
  vendas, itens de venda e movimentações de estoque.
- CRUD de produtos no Back-End (`GET`, `POST`, `PUT`, `DELETE /products`).
