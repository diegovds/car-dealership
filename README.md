# Car Dealership

Plataforma fullstack para gerenciamento e vitrine de veículos, com busca inteligente por linguagem natural usando IA.

## Visão Geral

O projeto simula uma concessionária digital onde vendedores cadastram veículos e compradores navegam, buscam e entram em contato. A busca por IA interpreta texto livre (ex: "Gol flex até 60 mil") e retorna resultados relevantes do banco de dados.

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

- Landing page editorial com tipografia display (Barlow Condensed) e marquee de marcas
- Cadastro e autenticação de vendedores (JWT)
- CRUD completo de veículos com imagem, especificações e preço
- Vitrine pública com paginação em `/cars`
- Página de detalhes do veículo com informações do vendedor (nome e telefone)
- Busca por linguagem natural com IA (OpenAI function calling)
- Paginação da busca por IA sem chamadas redundantes — filtros extraídos são reutilizados via `GET /cars/filter`
- Painel do vendedor para gerenciar perfil e anúncios
- Design responsivo com animações SSR-safe (`@starting-style`)
- Geração automática de tipos do frontend a partir da API (Orval)

## Quick Start

### Pré-requisitos

- Node.js 20+
- PostgreSQL (local via Docker ou remoto)
- Chave da API OpenAI

### 1. Backend

```bash
cd car-dealership-backend
npm install
docker compose up -d
# Crie o arquivo .env (veja car-dealership-backend/README.md para as variáveis)
npx drizzle-kit generate
npx drizzle-kit migrate
npm run seed
npm run dev
```

API disponível em `http://localhost:3333` — docs Swagger em `http://localhost:3333/docs`.

### 2. Frontend

```bash
cd car-dealership-frontend
npm install
# Crie o arquivo .env e configure API_URL
npm run dev
```

App disponível em `http://localhost:3000`.

## Documentação

- [Backend README](car-dealership-backend/README.md) — API, endpoints, busca por IA, estrutura
- [Frontend README](car-dealership-frontend/README.md) — páginas, componentes, integração com API
