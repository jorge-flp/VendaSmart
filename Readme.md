# 🛒 VendaSmart

<p align="center">
  <img src="./Front-End/public/favicon.png" width="170" alt="VendaSmart Logo">
</p>

<p align="center">
  <strong>Sistema SaaS para gestão de pequenos negócios.</strong>
</p>

<p align="center">
  Estoque • Vendas • Fiados • Dashboard • Relatórios
</p>

---

## 📖 Sobre o Projeto

O **VendaSmart** é um sistema SaaS em desenvolvimento com foco na gestão de pequenos estabelecimentos comerciais.

A proposta do projeto é oferecer uma solução simples, moderna e intuitiva para que pequenos empreendedores possam controlar suas operações sem depender de sistemas complexos ou caros.

Entre os públicos-alvo estão:

- 🛒 Mercados
- 🥖 Padarias
- 🍔 Lanchonetes
- 🏪 Mercearias
- 🧴 Lojas de bairro
- 👨‍💼 Pequenos empreendedores

O objetivo principal é automatizar tarefas operacionais como controle de estoque, registro de vendas, gerenciamento de fiados e geração de indicadores para auxiliar na tomada de decisões.

---

# 🚧 Status do Projeto

> **Em desenvolvimento (MVP / Protótipo)**

Atualmente o projeto encontra-se na fase de construção do MVP.

### Implementado

- Interface do Dashboard
- Controle de Estoque
- Cadastro de Produtos
- Tela de Vendas
- Controle de Fiados
- Relatórios (mockados)
- Navegação
- Context API para gerenciamento de estado
- Dados simulados (Mock Data)

### Em desenvolvimento

- API REST
- Banco de dados
- Persistência dos dados
- Autenticação
- Controle de usuários
- Integração Front-End ↔ Back-End

### Ainda não implementado

Alguns arquivos do Back-End representam apenas a estrutura inicial da aplicação e ainda não possuem implementação completa, como por exemplo:

- AuthController
- DashboardController
- SaleController
- Demais rotas da API

O projeto está sendo desenvolvido de forma incremental.

---

# ✨ Funcionalidades

## 📦 Estoque

- Cadastro de produtos
- Valor de custo
- Valor de venda
- Quantidade em estoque
- Foto do produto
- Controle visual do estoque
- Categorias

---

## 💰 Vendas

- Registro de vendas
- Atualização automática do estoque (planejada)
- Controle diário de vendas

---

## 📒 Fiados

- Cadastro de clientes
- Valor devido
- Contato
- Prazo para pagamento
- Histórico

---

## 📊 Dashboard

Indicadores como:

- Produtos vendidos
- Receita
- Lucro estimado
- Produtos mais vendidos
- Produtos menos vendidos
- Estoque baixo

---

## 📈 Relatórios

- Produtos mais vendidos
- Produtos menos vendidos
- Receita semanal
- Estoque

---

# 🖼️ Demonstração

> Em breve serão adicionadas capturas de tela e uma demonstração do sistema.

Sugestão de estrutura futura:

```
docs/

dashboard.png
estoque.png
vendas.png
fiados.png
```

---

# 🛠 Tecnologias

## Front-End

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Context API
- Lucide React
- Recharts

---

## Back-End

- Node.js
- Express
- JWT
- Bcrypt
- MySQL2
- Dotenv

---

## Banco de Dados

- MySQL 8

---

## Ferramentas

- Git
- GitHub
- Docker
- VS Code

---

# 📂 Estrutura do Projeto

```
VendaSmart/

├── Back-End/
│   ├── src/
│   ├── package.json
│   └── .env
│
├── Front-End/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│
└── README.md
```

---

# ⚙️ Pré-requisitos

Antes de executar o projeto, certifique-se de possuir:

- Node.js 20+
- npm 10+
- Git
- MySQL 8 (ou Docker, futuramente)
- VS Code (recomendado)

---

# 🚀 Executando o Projeto

## Clone o repositório

```bash
git clone https://github.com/jorge-flp/VendaSmart.git

cd VendaSmart
```

---

## Front-End

```bash
cd Front-End

npm install

npm run dev
```

A aplicação ficará disponível em:

```
http://localhost:5173
```

---

## Back-End

```bash
cd Back-End

npm install

npm run dev
```

Caso o script `dev` não esteja disponível:

```bash
npm start
```

---

# 🔐 Variáveis de Ambiente

Crie um arquivo `.env` dentro de **Back-End/**

Exemplo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=vendasmart

JWT_SECRET=sua_chave_secreta
```

---

# 🏛 Arquitetura Atual

O Front-End foi desenvolvido utilizando **Context API** para centralizar o estado da aplicação durante a fase de prototipação.

Essa abordagem reduz a complexidade inicial do projeto enquanto permite validar a experiência do usuário antes da implementação definitiva da API.

Quando o Back-End estiver concluído, o gerenciamento de dados passará gradualmente para chamadas HTTP, reduzindo a responsabilidade do Context.

As decisões arquiteturais mais detalhadas serão documentadas futuramente em:

```
ARCHITECTURE.md
```

---

# 📌 Roadmap

## MVP

- [x] Interface do Dashboard
- [x] Controle de Estoque
- [x] Cadastro de Produtos
- [x] Controle de Fiados
- [x] Relatórios
- [ ] Banco de Dados
- [ ] API REST
- [ ] Login
- [ ] Autenticação JWT
- [ ] Integração Front-End ↔ Back-End

---

## Futuras funcionalidades

- Código de barras
- Multiempresa
- Multiusuário
- Controle de Caixa
- Integração PIX
- Integração WhatsApp
- Backup automático
- Aplicativo Mobile
- Dashboard em tempo real

---

# 💡 Decisões de Desenvolvimento

O VendaSmart está sendo desenvolvido priorizando:

- simplicidade;
- evolução incremental;
- código legível;
- validação do MVP antes de otimizações mais complexas.

Embora existam planos para adoção de padrões como Clean Architecture, DDD e outras práticas avançadas, essas decisões serão incorporadas gradualmente conforme o projeto evoluir e houver necessidade real.

O objetivo é evitar complexidade desnecessária durante as fases iniciais.

---

# 🤝 Contribuições

O projeto ainda está em fase inicial.

Sugestões, feedbacks e correções são bem-vindos através das Issues do GitHub.

---

# 👨‍💻 Desenvolvido por:

**Jorge Felipe**

Desenvolvedor Full Stack em formação.

GitHub:

https://github.com/jorge-flp

**Arthur Jonas**

Desenvolverdor Full-Stack em formação.

Github:

https://github.com/arthur752

---

# 📄 Licença

Este projeto está licenciado sob a licença MIT.