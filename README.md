# Car Dealership

Plataforma fullstack para gerenciamento e vitrine de veículos, com busca inteligente por linguagem natural usando IA.

## Visao Geral

O projeto simula uma concessionaria digital onde vendedores cadastram veiculos e compradores navegam, buscam e entram em contato. A busca por IA interpreta texto livre (ex: "SUV flex ate 150 mil") e retorna resultados relevantes do banco de dados.

## Arquitetura

```
car-dealership/
  car-dealership-backend/    # API REST (Fastify + PostgreSQL)
  car-dealership-frontend/   # Interface web (Next.js 16)
```

| Camada | Stack |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, Zod 4, React Hook Form |
| **Backend** | Fastify 5, Drizzle ORM, Zod 4, PostgreSQL, JWT |
| **IA** | OpenAI API (function calling) para busca por linguagem natural |
| **Deploy** | Vercel (backend serverless + frontend edge) |

## Funcionalidades

- Cadastro e autenticacao de vendedores (JWT)
- CRUD completo de veiculos com imagem, especificacoes e preco
- Vitrine publica com paginacao
- Pagina de detalhes do veiculo com informacoes do vendedor (nome e telefone)
- Busca por linguagem natural com IA (OpenAI function calling)
- Painel do vendedor para gerenciar perfil e anuncios
- Design responsivo com animacoes SSR-safe (`@starting-style`)
- Geracao automatica de tipos do frontend a partir da API (Orval)

## Quick Start

### Pre-requisitos

- Node.js 20+
- PostgreSQL (local via Docker ou remoto)
- Chave da API OpenAI

### 1. Backend

```bash
cd car-dealership-backend
npm install
docker compose up -d
# Crie o arquivo .env (veja car-dealership-backend/README.md para as variaveis)
npx drizzle-kit generate
npx drizzle-kit migrate
npm run seed
npm run dev
```

API disponivel em `http://localhost:3333` — docs Swagger em `http://localhost:3333/docs`.

### 2. Frontend

```bash
cd car-dealership-frontend
npm install
# Copie .env.example para .env e configure API_URL
npm run dev
```

App disponivel em `http://localhost:3000`.

## Documentacao

- [Backend README](car-dealership-backend/README.md) — API, endpoints, busca por IA, estrutura
- [Frontend README](car-dealership-frontend/README.md) — paginas, componentes, integracao com API
