# Car Dealership API

API REST para gerenciamento de uma concessionária de veículos, com autenticação JWT, CRUD de usuários e carros, e busca inteligente por linguagem natural usando IA.

## Tecnologias

- **Fastify 5** - Framework HTTP
- **Drizzle ORM** - ORM para PostgreSQL
- **Zod 4** - Validação de schemas e geração automática de docs Swagger
- **@fastify/jwt** - Autenticação JWT
- **fastify-bcrypt** - Hash de senhas
- **OpenAI API** - Busca por linguagem natural (function calling)
- **PostgreSQL** - Banco de dados
- **Vercel** - Deploy serverless

## Requisitos

- Node.js 20+
- PostgreSQL (local via Docker ou remoto)
- Chave da API OpenAI

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Banco de dados com Docker

```bash
docker compose up -d
```

Isso sobe um PostgreSQL local na porta 5432 com usuário `docker`, senha `docker` e banco `car-dealership`.

### 3. Variáveis de ambiente

Crie um arquivo `.env` na raiz do backend:

```env
PORT=3333
DATABASE_URL=postgresql://docker:docker@localhost:5432/car-dealership
JWT_SECRET_KEY=sua-chave-secreta
BASE_URL=http://localhost:3333
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão: 3333) |
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `JWT_SECRET_KEY` | Chave secreta para assinar tokens JWT |
| `BASE_URL` | URL base da API |
| `OPENAI_API_KEY` | Chave da API da OpenAI |
| `OPENAI_MODEL` | Modelo da OpenAI (padrão: gpt-4o-mini) |

### 4. Gerar e executar migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 5. Iniciar em desenvolvimento

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333` e a documentação Swagger em `http://localhost:3333/docs`.

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor em modo desenvolvimento com hot reload |
| `npm run migrate` | Executa as migrations do Drizzle no banco |
| `npm run seed` | Popula o banco com dados iniciais |
| `npm run db:reset` | Reseta o banco de dados |

## Endpoints

### Users

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/users` | Não | Cadastrar usuário (nome, email, senha, telefone) |
| POST | `/users/login` | Não | Login (retorna token JWT) |
| GET | `/users` | Sim | Obter perfil com carros paginados |
| PATCH | `/users` | Sim | Atualizar perfil (nome, email, telefone, senha) |
| DELETE | `/users` | Sim | Excluir conta e seus carros |

### Cars

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/cars` | Não | Listar carros com paginação |
| GET | `/cars/:id` | Não | Obter carro por ID (inclui dados do vendedor) |
| GET | `/cars/search` | Não | Buscar carros por texto (IA) |
| POST | `/cars` | Sim | Cadastrar carro |
| PATCH | `/cars/:id` | Sim | Atualizar carro |
| DELETE | `/cars/:id` | Sim | Excluir carro |

### Paginação

Os endpoints GET `/users` e GET `/cars` suportam paginação via query string:

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

### Autenticação

Endpoints protegidos exigem o header `Authorization` com o token JWT:

```
Authorization: Bearer <token>
```

O token é obtido no endpoint `POST /users/login`. Endpoints protegidos identificam o usuário pelo `sub` contido no token, sem necessidade de passar o ID na URL. Operações de escrita (POST, PATCH, DELETE) em carros validam que o carro pertence ao usuário autenticado.

## Busca por IA

O endpoint `GET /cars/search?search=...` permite buscar carros usando linguagem natural.

### Como funciona

```
Usuário: "tem gol flex até 50 mil?"
```

**1. Envio para a OpenAI** - O texto é enviado para a API da OpenAI com function calling. A IA recebe uma tool chamada `buscar_carros` com parâmetros estruturados (marca, nome, versão, ano, km, combustível, câmbio, preço).

**2. Extração de filtros** - A IA interpreta o texto e retorna um JSON estruturado:

```json
{ "nome": "Gol", "combustivel": "Flex", "preco_max": 50000 }
```

**3. Mapeamento** - Os campos em português são convertidos para os nomes em inglês do schema do banco:

| IA (português) | Banco (inglês) |
|---|---|
| marca | brand |
| nome | model |
| versao | version |
| ano / ano_min / ano_max | year / yearMin / yearMax |
| km_min / km_max | mileageMin / mileageMax |
| combustivel | fuel |
| cambio | transmission |
| preco_min / preco_max | priceMin / priceMax |

**4. Query no banco** - Os filtros são aplicados dinamicamente no PostgreSQL via Drizzle ORM. Textos usam `ilike` (busca parcial, case insensitive), números usam comparações exatas ou faixas.

**5. Resposta** - Retorna os carros encontrados e uma mensagem natural:

```json
{
  "cars": [{ "id": "...", "brand": "Volkswagen", "model": "Gol", ... }],
  "reply": "Encontrei 3 veículos com essas características."
}
```

### Detalhes técnicos

- A IA **não acessa o banco** - ela apenas converte texto em filtros estruturados
- `tool_choice: 'required'` garante que a IA sempre chame a function
- `temperature: 0` garante respostas determinísticas
- Se a IA não conseguir extrair filtros, não retorna nenhum carro

## Estrutura do projeto

```
src/
  @types/             # Declarações de tipo (fastify-jwt.d.ts)
  config/             # Variáveis de ambiente (env.ts)
  db/
    migrations/       # Migrations do Drizzle
    schema/           # Schemas do banco (users, cars)
    client.ts         # Conexão com PostgreSQL
  middlewares/        # Middleware de autenticação JWT
  modules/
    users/            # CRUD de usuários (controller, service, repository, schema, routes)
    cars/
      search/         # Agente de busca IA + query builder
      cars.*          # CRUD de carros (controller, service, repository, schema, routes)
  routes/             # Registro centralizado de rotas
  scripts/            # Scripts utilitários (migrate, seed, reset)
  app.ts              # Configuração do Fastify (plugins, swagger)
  server.ts           # Entrada para desenvolvimento local
api/
  serverless.ts       # Entrada para deploy na Vercel
```
