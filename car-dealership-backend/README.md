# Car Dealership API

API para gerenciamento de uma concessionaria de veiculos, com autenticacao JWT, CRUD de usuarios e carros, e busca inteligente por linguagem natural usando IA.

## Tecnologias

- **Fastify 5** - Framework HTTP
- **Drizzle ORM** - ORM para PostgreSQL
- **Zod 4** - Validacao de schemas e geracao automatica de docs Swagger
- **@fastify/jwt** - Autenticacao JWT
- **fastify-bcrypt** - Hash de senhas
- **OpenAI API** - Busca por linguagem natural (function calling)
- **PostgreSQL** - Banco de dados
- **Vercel** - Deploy serverless

## Requisitos

- Node.js 20+
- PostgreSQL (local via Docker ou remoto)
- Chave da API OpenAI

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Banco de dados com Docker

```bash
docker compose up -d
```

Isso sobe um PostgreSQL local na porta 5432 com usuario `docker`, senha `docker` e banco `car-dealership`.

### 3. Variaveis de ambiente

Crie um arquivo `.env` na raiz do backend:

```env
PORT=3333
DATABASE_URL=postgresql://docker:docker@localhost:5432/car-dealership
JWT_SECRET_KEY=sua-chave-secreta
BASE_URL=http://localhost:3333
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

| Variavel | Descricao |
|---|---|
| `PORT` | Porta do servidor (padrao: 3333) |
| `DATABASE_URL` | String de conexao do PostgreSQL |
| `JWT_SECRET_KEY` | Chave secreta para assinar tokens JWT |
| `BASE_URL` | URL base da API |
| `OPENAI_API_KEY` | Chave da API da OpenAI |
| `OPENAI_MODEL` | Modelo da OpenAI (padrao: gpt-4o-mini) |

### 4. Executar migrations

```bash
npm run migrate
```

### 5. Iniciar em desenvolvimento

```bash
npm run dev
```

A API estara disponivel em `http://localhost:3333` e a documentacao Swagger em `http://localhost:3333/docs`.

## Scripts

| Script | Descricao |
|---|---|
| `npm run dev` | Inicia o servidor em modo desenvolvimento com hot reload |
| `npm run migrate` | Executa as migrations do Drizzle no banco |
| `npm run seed` | Popula o banco com dados iniciais |
| `npm run db:reset` | Reseta o banco de dados |

## Endpoints

### Users

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| POST | `/users` | Nao | Cadastrar usuario |
| POST | `/users/login` | Nao | Login (retorna token JWT) |
| GET | `/users` | Sim | Obter perfil com carros paginados |
| PATCH | `/users` | Sim | Atualizar perfil |
| DELETE | `/users` | Sim | Excluir conta e seus carros |

### Cars

| Metodo | Rota | Auth | Descricao |
|---|---|---|---|
| GET | `/cars` | Nao | Listar carros com paginacao |
| GET | `/cars/:id` | Nao | Obter carro por ID |
| GET | `/cars/search` | Nao | Buscar carros por texto (IA) |
| POST | `/cars` | Sim | Cadastrar carro |
| PATCH | `/cars/:id` | Sim | Atualizar carro |
| DELETE | `/cars/:id` | Sim | Excluir carro |

### Paginacao

Os endpoints GET `/users` e GET `/cars` suportam paginacao via query string:

```
GET /cars?page=2
```

A resposta inclui um objeto `meta`:

```json
{
  "cars": [...],
  "meta": {
    "page": 2,
    "perPage": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Autenticacao

Endpoints protegidos exigem o header `Authorization` com o token JWT:

```
Authorization: Bearer <token>
```

O token e obtido no endpoint `POST /users/login`. Endpoints protegidos identificam o usuario pelo `sub` contido no token, sem necessidade de passar o ID na URL. Operacoes de escrita (POST, PATCH, DELETE) em carros validam que o carro pertence ao usuario autenticado.

## Busca por IA

O endpoint `GET /cars/search?search=...` permite buscar carros usando linguagem natural.

### Como funciona

```
Usuario: "tem gol flex ate 50 mil?"
```

**1. Envio para a OpenAI** - O texto e enviado para a API da OpenAI com function calling. A IA recebe uma tool chamada `buscar_carros` com parametros estruturados (marca, nome, versao, ano, km, combustivel, cambio, preco).

**2. Extracao de filtros** - A IA interpreta o texto e retorna um JSON estruturado:

```json
{ "nome": "Gol", "combustivel": "Flex", "preco_max": 50000 }
```

**3. Mapeamento** - Os campos em portugues sao convertidos para os nomes em ingles do schema do banco:

| IA (portugues) | Banco (ingles) |
|---|---|
| marca | brand |
| nome | model |
| versao | version |
| ano / ano_min / ano_max | year / yearMin / yearMax |
| km_min / km_max | mileageMin / mileageMax |
| combustivel | fuel |
| cambio | transmission |
| preco_min / preco_max | priceMin / priceMax |

**4. Query no banco** - Os filtros sao aplicados dinamicamente no PostgreSQL via Drizzle ORM. Textos usam `ilike` (busca parcial, case insensitive), numeros usam comparacoes exatas ou faixas.

**5. Resposta** - Retorna os carros encontrados e uma mensagem natural:

```json
{
  "cars": [{ "id": "...", "brand": "Volkswagen", "model": "Gol", ... }],
  "reply": "Encontrei 3 veiculos com essas caracteristicas."
}
```

### Detalhes tecnicos

- A IA **nao acessa o banco** - ela apenas converte texto em filtros estruturados
- `tool_choice: 'required'` garante que a IA sempre chame a function
- `temperature: 0` garante respostas deterministicas
- Se a IA nao conseguir extrair filtros, retorna todos os carros

## Estrutura do projeto

```
src/
  @types/             # Declaracoes de tipo (fastify-jwt.d.ts)
  config/             # Variaveis de ambiente (env.ts)
  db/
    migrations/       # Migrations do Drizzle
    schema/           # Schemas do banco (users, cars)
    client.ts         # Conexao com PostgreSQL
  middlewares/        # Middleware de autenticacao JWT
  modules/
    users/            # CRUD de usuarios (controller, service, repository, schema, routes)
    cars/
      search/         # Agente de busca IA + query builder
      cars.*          # CRUD de carros (controller, service, repository, schema, routes)
  routes/             # Registro centralizado de rotas
  scripts/            # Scripts utilitarios (migrate, seed, reset)
  app.ts              # Configuracao do Fastify (plugins, swagger)
  server.ts           # Entrada para desenvolvimento local
api/
  serverless.ts       # Entrada para deploy na Vercel
```

## Deploy (Vercel)

O projeto esta configurado para deploy serverless na Vercel:

1. Conecte o repositorio no painel da Vercel
2. Defina o **Root Directory** como `car-dealership-backend`
3. Adicione as variaveis de ambiente: `DATABASE_URL`, `JWT_SECRET_KEY`, `BASE_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`
4. As migrations rodam automaticamente a cada deploy via script `vercel-build`
