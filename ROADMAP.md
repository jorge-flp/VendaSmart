# Roadmap

## MVP (atual)

Funcionalidades já implementadas no Front-End (com dados mockados):

- Dashboard com faturamento do dia, lucro estimado, produtos vendidos e alertas de
  estoque baixo.
- Gráfico de faturamento/lucro dos últimos 7 dias (Chart.js).
- Gráfico de estoque por categoria (doughnut chart).
- Controle de Estoque: listar, cadastrar, filtrar e ordenar produtos.
- Nova Venda: montar carrinho, validar estoque disponível e finalizar venda (reduz estoque
  automaticamente).
- Fiados: cadastrar cliente fiado, registrar pagamentos parciais/totais, acompanhar status
  (aberto, atrasado, pago).
- Relatórios: ranking de produtos mais/menos vendidos, estoque baixo, itens sem
  movimentação, clientes com saldo devedor.
- Tela de Configurações (mock local, sem persistência).
- Backend: CRUD de produtos (`GET`, `POST`, `PUT`, `DELETE /products`) conectado a MySQL.

---

## Próxima versão (em desenvolvimento)

- Implementação real das rotas de vendas (`POST /sales`, `GET /sales`, `GET /sales/:id`)
  no Back-End.
- Implementação real do endpoint de dashboard (`GET /dashboard`) consumindo dados do banco
  em vez de mock.
- Autenticação com JWT + bcrypt (login real, substituindo os PINs fixos do
  `AuthContext.jsx`).
- Integração do Front-End com a API real (substituição gradual do `mockData.js`).

---

## Médio prazo

- Controle de Caixa (abertura/fechamento formal, vinculado ao usuário logado).
- Leitura de código de barras na tela de Nova Venda.
- Pagamento via PIX.
- Envio de confirmação de pedido via WhatsApp (hoje já existe um protótipo de geração de
  link `wa.me` em `Sales.jsx`, mas fora do fluxo principal do app atual).
- Dashboard em tempo real (atualização automática sem reload).
- Aplicativo mobile.
- Rotina de backup do banco de dados.
- Suporte a múltiplas empresas (multiempresa).
- Suporte a múltiplos usuários com permissões diferenciadas (multiusuário/RBAC).

---

## Longo prazo

- Estratégia de escalabilidade (conforme volume real de uso justificar).
- Ambiente de deploy (homologação e produção).
- Pipeline de CI/CD.
- Monitoramento e alertas de erro em produção.
- Centralização e retenção de logs.
- Suíte de testes automatizados (unitários, integração e, futuramente, end-to-end).
