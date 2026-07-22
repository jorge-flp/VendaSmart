# Arquitetura do Projeto

## Objetivo da arquitetura

O VendaSmart foi dividido em dois projetos independentes — `Front-End/` e `Back-End/` —
para permitir que a interface e a API evoluam em ritmos diferentes. Durante o MVP, o
Front-End funciona de forma autossuficiente com dados mockados, enquanto o Back-End é
desenvolvido em paralelo. Essa separação também facilita, no futuro, hospedar cada parte
em serviços diferentes (ex.: front em um CDN/hosting estático, back em um servidor Node).

---

## Estrutura de pastas

```
VendaSmart/
├── Front-End/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── Back-End/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   ├── config/
│   │   └── app.js / server.js
│   ├── database/
│   │   └── database.sql
│   └── package.json
├── README.md
├── ARCHITECTURE.md
├── ROADMAP.md
└── CHANGELOG.md
```

### Principais pastas

- **`Front-End/src/pages`** — uma página por rota/aba do sistema (Dashboard, Estoque,
  NovaVenda, Fiados, Relatórios, Configurações).
- **`Front-End/src/components`** — componentes reutilizáveis (Sidebar, modais, badges,
  gráficos) e uma subpasta `ui/` para elementos de interface genéricos (Modal, EmptyState,
  SuccessOverlay).
- **`Front-End/src/context`** — fonte única de verdade do estado da aplicação (ver seção
  de Context API abaixo).
- **`Front-End/src/data`** — gerador de dados fictícios (`mockData.js`), usado enquanto o
  Back-End real não está integrado.
- **`Back-End/src/controllers`** — lógica de cada recurso da API. Hoje, apenas
  `productController.js` está implementado; os demais (`saleController.js`,
  `dashboardController.js`, `authController.js`) existem só como rascunho/exemplo de payload.
- **`Back-End/src/routes`** — definição das rotas Express. Apenas `RotaProdutos.js` está
  conectada em `app.js`.
- **`Back-End/database/database.sql`** — schema MySQL com tabelas `users`, `products`,
  `sales`, `sale_items` e `stock_movements`.

---

## Arquitetura do Front-End

- **Páginas** (`pages/`): cada tela do sistema é um componente de página que consome dados
  e ações do `AppContext` via o hook `useApp()`.
- **Componentes** (`components/`): divididos em componentes de domínio (ex.:
  `ProductFormModal`, `FiadoFormModal`) e componentes de UI genéricos (`ui/Modal`,
  `ui/Badge`, `ui/EmptyState`, `ui/SuccessOverlay`), reaproveitados em várias telas.
- **Context API** (`context/AppContext.jsx`): centraliza todo o estado (produtos, vendas,
  fiados) e todas as regras de negócio do protótipo (ex.: registrar uma venda reduz o
  estoque automaticamente). Cada função relevante tem um comentário `// API: ...` indicando
  o endpoint e verbo HTTP que a substituirá quando o Back-End estiver pronto.
- **mockData.js**: gera produtos, vendas e fiados fictícios de forma determinística (PRNG
  com seed fixa), garantindo que os relatórios e gráficos sempre tenham dados consistentes
  entre reloads.
- **Gráficos**: implementados com `chart.js` + `react-chartjs-2`, com configuração
  centralizada em `components/charts/chartSetup.js` (cores, escalas, registro dos elementos
  do Chart.js usados no projeto).
- **UI reutilizável**: `Badge` (status coloridos), `EmptyState` (telas sem dados) e
  `SuccessOverlay` (confirmação visual pós-ação) evitam duplicação entre páginas.

### Por que Context API (e não Redux/Zustand)

Para o tamanho atual do projeto — um único domínio de estado (produtos, vendas, fiados)
compartilhado por poucas telas — o Context API do próprio React é suficiente e evita
adicionar uma dependência extra ao `package.json`. Se o estado crescer em complexidade
(ex.: múltiplos contextos aninhados, necessidade de seletores para performance), essa
decisão deve ser revisitada.

---

## Arquitetura do Back-End

**Estado atual: em desenvolvimento, incompleto.**

```
Back-End/src/
├── app.js              → registra middlewares (cors, json) e a rota /products
├── server.js           → sobe o servidor Express na porta do .env
├── config/database.js  → pool de conexão MySQL (mysql2)
├── controllers/
│   └── productController.js   → único controller funcional (CRUD de produtos)
├── routes/
│   └── RotaProdutos.js         → única rota conectada em app.js
└── models/, middleware/, services/  → arquivos criados mas ainda vazios
```

- **`productController.js`** é o único controller com lógica real: lista, cria, atualiza
  e remove produtos via `mysql2` com queries parametrizadas (`?`), sem SQL concatenado.
- **`saleController.js`** e **`dashboardController.js`** hoje contêm apenas exemplos de
  payload JSON (formato esperado de entrada/saída), não implementação.
- **`authController.js`**, **`authMiddleware.js`** e os arquivos em `models/` estão vazios.
- Não há autenticação, autorização ou emissão de JWT implementada no Back-End, apesar de
  `jsonwebtoken` e `bcrypt` já estarem no `package.json` como dependências.

---

## Fluxo da aplicação

### Fluxo atual (MVP)

```
Usuário
  ↓
Interface React (pages/)
  ↓
Context API (AppContext.jsx)
  ↓
mockData.js (dados em memória, gerados no carregamento)
```

Toda interação (cadastrar produto, registrar venda, pagar fiado) altera apenas o estado
em memória do React via `useState`/`useCallback` dentro do `AppContext`. Nada é persistido
entre reloads além do que o `mockData.js` gera de forma determinística.

### Fluxo futuro (quando a API for integrada)

```
React (pages/)
  ↓
API REST (fetch/axios)
  ↓
Express (routes/ → controllers/)
  ↓
MySQL (mysql2)
```

Os comentários `// API: POST /sales`, `// API: PATCH /products/:id` etc. já presentes no
`AppContext.jsx` indicam onde cada função de estado será substituída por uma chamada real
à API.

---

## Decisões técnicas

- **Context API durante o MVP**: evita overhead de configurar um backend completo antes de
  validar as telas e o fluxo de uso com o usuário final.
- **mockData.js com PRNG determinístico**: garante que estoque baixo, produtos parados e
  ranking de vendas sempre existam nos relatórios, sem depender de dados aleatórios reais.
- **Separação Front-End / Back-End em pastas/projetos distintos**: permite deploy e
  versionamento independentes.
- **Componentização** (`ui/`, `charts/`): reduz duplicação de código entre páginas que
  compartilham padrões visuais (modais, badges, gráficos).
- **Chart.js**: já estava no projeto original; optou-se por não adicionar bibliotecas novas
  (como Recharts) para os gráficos, evitando dependências redundantes.

---

## Limitações atuais

- Backend incompleto: apenas o CRUD de produtos está funcional; vendas, fiados, dashboard
  e autenticação não têm lógica implementada no servidor.
- Autenticação ainda em desenvolvimento: o login existente (`AuthContext.jsx`) roda
  inteiramente no Front-End, com usuários e PINs fixos no código-fonte — **não é seguro e
  não deve ser usado além do protótipo**.
- Dados mockados: todo o Front-End funciona sobre `mockData.js`, sem chamadas reais à API.
- Sem persistência completa: o schema MySQL existe (`database.sql`), mas a aplicação ainda
  não grava nem lê dados dele para a maior parte das telas.
- Sem deploy: não há ambiente de homologação ou produção configurado.
- Sem testes automatizados: nenhum teste unitário, de integração ou end-to-end até o momento.

---

## Próximos passos técnicos

- Implementar os controllers e rotas de vendas, fiados e dashboard no Back-End.
- Implementar autenticação real com JWT + bcrypt (hash de senha, emissão/validação de token).
- Conectar o Front-End à API real, substituindo as funções do `AppContext` conforme os
  comentários `// API: ...`.
- Configurar Docker Compose para padronizar o ambiente de desenvolvimento (Node + MySQL).
- Adicionar documentação Swagger/OpenAPI para as rotas da API.
- Escrever testes automatizados (unitários no Back-End, pelo menos, como primeiro passo).
