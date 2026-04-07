# Instruções para Gerar Backends

Este documento descreve a stack, a arquitetura e os padrões utilizados no projeto `car-dealership-backend`. Use-o como referência para gerar novos backends seguindo o mesmo padrão, bastando informar as tabelas desejadas.

---

## Stack

| Tecnologia | Versão | Papel |
|---|---|---|
| **Node.js** | 22+ | Runtime |
| **TypeScript** | 6+ | Linguagem |
| **Fastify** | 5 | Framework HTTP |
| **Drizzle ORM** | 0.45+ | ORM / Query builder |
| **Drizzle Kit** | 0.31+ | Migrations |
| **PostgreSQL** | 16+ | Banco de dados |
| **Zod** | 4+ | Validação e schemas (Swagger) |
| **fastify-type-provider-zod** | 6+ | Integração Zod/Fastify/Swagger |
| **@fastify/jwt** | 10+ | Autenticação JWT |
| **fastify-bcrypt** | 1+ | Hash de senhas |
| **@fastify/swagger** + **@fastify/swagger-ui** | 9+ / 5+ | Documentação OpenAPI |
| **@fastify/cors** | 11+ | CORS |
| **tsx** | 4+ | Dev server com watch |

---

## Estrutura de Pastas

```
src/
├── @types/
│   └── fastify-jwt.d.ts          # Tipagem do request.user (JWT payload)
├── config/
│   └── env.ts                     # Validação de variáveis de ambiente com Zod
├── db/
│   ├── client.ts                  # Pool do pg + instância do Drizzle
│   ├── migrations/                # Geradas pelo drizzle-kit
│   └── schema/
│       ├── index.ts               # Re-exporta todos os schemas
│       ├── users.ts               # Tabela users + relações
│       └── {entidade}.ts          # Tabela da entidade + relações
├── middlewares/
│   └── authenticate.ts            # Middleware de validação JWT
├── modules/
│   ├── users/
│   │   ├── users.schema.ts        # Schemas Zod (validação + Swagger)
│   │   ├── users.repository.ts    # Queries Drizzle
│   │   ├── users.service.ts       # Regras de negócio
│   │   ├── users.controller.ts    # Handlers HTTP
│   │   └── users.routes.ts        # Definição de rotas + Swagger
│   └── {entidade}/
│       ├── {entidade}.schema.ts
│       ├── {entidade}.repository.ts
│       ├── {entidade}.service.ts
│       ├── {entidade}.controller.ts
│       └── {entidade}.routes.ts
├── routes/
│   └── index.ts                   # Rota default + registro de todos os módulos
├── app.ts                         # Instância Fastify + plugins globais
└── server.ts                      # Inicialização do servidor
```

---

## Docker

### `docker-compose.yml`

Sobe o PostgreSQL em container. As credenciais devem bater com o `DATABASE_URL` do `.env`.

```yml
services:
  connect-pg:
    image: bitnami/postgresql:latest
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=docker
      - POSTGRES_PASSWORD=docker
      - POSTGRES_DB=nome-do-banco
```

### Comandos

```bash
# Subir o banco
docker compose up -d

# Verificar se está rodando
docker compose ps

# Parar o banco
docker compose down

# Parar e remover volumes (apaga dados)
docker compose down -v
```

> Após subir o container, rode `npx drizzle-kit migrate` para criar as tabelas.

---

## Arquivos Base (não mudam entre projetos)

### `.env`

```env
PORT=3333
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome-do-banco"
JWT_SECRET_KEY="chave-secreta"
BASE_URL="http://localhost:3333"
```

### `src/config/env.ts`

```ts
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  JWT_SECRET_KEY: z.string(),
  BASE_URL: z.string(),
})

export const env = envSchema.parse(process.env)
```

### `src/db/client.ts`

```ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '../config/env.js'
import * as schema from './schema/index.js'

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const db = drizzle({
  client: pool,
  schema,
})
```

### `src/@types/fastify-jwt.d.ts`

```ts
import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
    }
  }
}
```

### `src/middlewares/authenticate.ts`

```ts
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Token inválido ou ausente' })
  }
}
```

### `src/app.ts`

```ts
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import fastifyBcrypt from 'fastify-bcrypt'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './config/env'
import { routes } from './routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(fastifyBcrypt, { saltWorkFactor: 10 })
app.register(fastifyJwt, { secret: env.JWT_SECRET_KEY })

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'NOME DO PROJETO',
      version: '0.0.1',
      description: 'Descrição da API',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, { routePrefix: '/docs' })
app.register(routes)

export { app }
```

### `src/server.ts`

```ts
import { app } from './app'
import { env } from './config/env'

app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP Server Running! http://localhost:${env.PORT}`)
})
```

### `src/routes/index.ts`

Centraliza o registro de todos os módulos:

```ts
import { FastifyInstance } from 'fastify'
import z from 'zod'
import { env } from '../config/env'
import { usersRoutes } from '../modules/users/users.routes'
// import { outroModuloRoutes } from '../modules/outro/outro.routes'

export async function routes(app: FastifyInstance) {
  app.get('/', {
    schema: {
      tags: ['Default'],
      security: [],
      summary: 'Página inicial da API',
      response: {
        200: z.object({ api: z.string() }),
      },
    },
  }, async (request, reply) => {
    reply.send({ api: `Go to ${env.BASE_URL}/docs to see the documentation.` })
  })

  app.register(usersRoutes)
  // app.register(outroModuloRoutes)
}
```

### `drizzle.config.ts`

```ts
import { defineConfig } from 'drizzle-kit'
import { env } from './src/config/env'

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: { url: env.DATABASE_URL },
})
```

---

## Módulo Users (padrão fixo)

O módulo de users é sempre o mesmo em todos os projetos. Contém:

### Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/users` | Não | Registro (nome, email, senha) |
| POST | `/users/login` | Não | Login, retorna JWT |
| GET | `/users` | Sim | Perfil do usuário (ID vem do token) |
| PATCH | `/users` | Sim | Atualizar perfil (ID vem do token) |
| DELETE | `/users` | Sim | Deletar conta (ID vem do token) |

### Regras

- Senha é hasheada com bcrypt na criação e atualização.
- Para alterar senha, o body deve conter `currentPassword` + `newPassword` juntos. A senha atual é verificada antes de aplicar a nova.
- Email é validado como único.
- O `userResponseSchema` nunca expõe o campo `password`.
- Rotas autenticadas usam `request.user.sub` (ID do token) diretamente, sem `:id` na URL.
- JWT é assinado com `{ sub: user.id }` e expira em `7d`.

### Schema Drizzle (`src/db/schema/users.ts`)

```ts
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
// import das entidades filhas para relações

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  // entidadesFilhas: many(entidadesFilhas),
}))
```

---

## Padrão de Módulo para Entidades (CRUD)

Para cada entidade pertencente ao user, criar 5 arquivos em `src/modules/{entidade}/`:

### 1. `{entidade}.schema.ts` — Schemas Zod

```ts
import z from 'zod'

// Schema de criação — campos obrigatórios da entidade
export const createEntidadeSchema = z.object({
  campo1: z.string().min(1),
  campo2: z.number().int(),
  // ...
})

// Schema de atualização — todos opcionais
export const updateEntidadeSchema = z.object({
  campo1: z.string().min(1).optional(),
  campo2: z.number().int().optional(),
  // ...
})

// Param para rotas com :id
export const entidadeIdParamSchema = z.object({
  id: z.uuid(),
})

// Response — o que a API retorna (inclui id, userId, timestamps)
export const entidadeResponseSchema = z.object({
  id: z.uuid(),
  userId: z.uuid().nullable(),
  campo1: z.string(),
  campo2: z.number(),
  // campos opcionais usam .nullable()
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const entidadeListResponseSchema = z.array(entidadeResponseSchema)

export type CreateEntidadeInput = z.infer<typeof createEntidadeSchema>
export type UpdateEntidadeInput = z.infer<typeof updateEntidadeSchema>
```

### 2. `{entidade}.repository.ts` — Queries Drizzle

```ts
import { and, eq } from 'drizzle-orm'
import { db } from '../../db/client'
import { entidade } from '../../db/schema'
import type { CreateEntidadeInput, UpdateEntidadeInput } from './entidade.schema'

// Todas as queries filtram por userId para garantir ownership

export async function findByUserId(userId: string) {
  return db.select().from(entidade).where(eq(entidade.userId, userId))
}

export async function findByIdAndUserId(id: string, userId: string) {
  const result = await db
    .select()
    .from(entidade)
    .where(and(eq(entidade.id, id), eq(entidade.userId, userId)))
  return result[0] ?? null
}

export async function create(userId: string, data: CreateEntidadeInput) {
  const result = await db
    .insert(entidade)
    .values({ ...data, userId })
    .returning()
  return result[0]
}

export async function update(id: string, userId: string, data: UpdateEntidadeInput) {
  const result = await db
    .update(entidade)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(entidade.id, id), eq(entidade.userId, userId)))
    .returning()
  return result[0] ?? null
}

export async function remove(id: string, userId: string) {
  const result = await db
    .delete(entidade)
    .where(and(eq(entidade.id, id), eq(entidade.userId, userId)))
    .returning()
  return result[0] ?? null
}
```

### 3. `{entidade}.service.ts` — Regras de negócio

```ts
import * as repository from './entidade.repository'
import type { CreateEntidadeInput, UpdateEntidadeInput } from './entidade.schema'

class AppError extends Error {
  statusCode: number
  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

export async function list(userId: string) {
  return repository.findByUserId(userId)
}

export async function getById(userId: string, id: string) {
  const item = await repository.findByIdAndUserId(id, userId)
  if (!item) {
    throw new AppError(404, 'Entidade não encontrada')
  }
  return item
}

export async function create(userId: string, data: CreateEntidadeInput) {
  return repository.create(userId, data)
}

export async function update(userId: string, id: string, data: UpdateEntidadeInput) {
  const item = await repository.update(id, userId, data)
  if (!item) {
    throw new AppError(404, 'Entidade não encontrada')
  }
  return item
}

export async function remove(userId: string, id: string) {
  const item = await repository.remove(id, userId)
  if (!item) {
    throw new AppError(404, 'Entidade não encontrada')
  }
  return item
}
```

### 4. `{entidade}.controller.ts` — Handlers HTTP

```ts
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateEntidadeInput, UpdateEntidadeInput } from './entidade.schema'
import * as service from './entidade.service'

function getUserId(request: FastifyRequest): string {
  return request.user.sub
}

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const items = await service.list(getUserId(request))
  return reply.send(items)
}

export async function getById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const item = await service.getById(getUserId(request), request.params.id)
  return reply.send(item)
}

export async function create(
  request: FastifyRequest<{ Body: CreateEntidadeInput }>,
  reply: FastifyReply,
) {
  const item = await service.create(getUserId(request), request.body)
  return reply.status(201).send(item)
}

export async function update(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateEntidadeInput }>,
  reply: FastifyReply,
) {
  const item = await service.update(getUserId(request), request.params.id, request.body)
  return reply.send(item)
}

export async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  await service.remove(getUserId(request), request.params.id)
  return reply.status(204).send()
}
```

### 5. `{entidade}.routes.ts` — Rotas + Swagger

```ts
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { authenticate } from '../../middlewares/authenticate'
import * as controller from './entidade.controller'
import {
  createEntidadeSchema,
  updateEntidadeSchema,
  entidadeIdParamSchema,
  entidadeResponseSchema,
  entidadeListResponseSchema,
} from './entidade.schema'

export async function entidadeRoutes(instance: FastifyInstance) {
  const app = instance.withTypeProvider<ZodTypeProvider>()

  // Todas as rotas da entidade exigem autenticação
  app.addHook('onRequest', authenticate)

  app.get('/entidade', {
    schema: {
      tags: ['Entidade'],
      summary: 'Listar entidades do usuário',
      response: { 200: entidadeListResponseSchema },
    },
  }, controller.list)

  app.get('/entidade/:id', {
    schema: {
      tags: ['Entidade'],
      summary: 'Buscar entidade por ID',
      params: entidadeIdParamSchema,
      response: {
        200: entidadeResponseSchema,
        404: z.object({ message: z.string() }),
      },
    },
  }, controller.getById)

  app.post('/entidade', {
    schema: {
      tags: ['Entidade'],
      summary: 'Criar entidade',
      body: createEntidadeSchema,
      response: { 201: entidadeResponseSchema },
    },
  }, controller.create)

  app.patch('/entidade/:id', {
    schema: {
      tags: ['Entidade'],
      summary: 'Atualizar entidade',
      params: entidadeIdParamSchema,
      body: updateEntidadeSchema,
      response: {
        200: entidadeResponseSchema,
        404: z.object({ message: z.string() }),
      },
    },
  }, controller.update)

  app.delete('/entidade/:id', {
    schema: {
      tags: ['Entidade'],
      summary: 'Deletar entidade',
      params: entidadeIdParamSchema,
      response: {
        204: z.null().describe('Deletado com sucesso'),
        404: z.object({ message: z.string() }),
      },
    },
  }, controller.remove)
}
```

---

## Schema Drizzle para Entidades

Cada entidade pertencente ao user segue o padrão:

```ts
import { pgTable, timestamp, uuid, varchar /* outros tipos */ } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'

export const entidade = pgTable('entidade', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  // campos da entidade...
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const entidadeRelations = relations(entidade, ({ one }) => ({
  user: one(users, {
    fields: [entidade.userId],
    references: [users.id],
  }),
}))
```

E registrar no `src/db/schema/index.ts`:

```ts
export * from './users'
export * from './entidade'
```

---

## Convenções

- **Nomes de colunas no banco**: snake_case (`user_id`, `created_at`)
- **Nomes de campos no código**: camelCase (`userId`, `createdAt`)
- **Rotas públicas**: usar `security: []` no schema
- **Rotas autenticadas**: usar `onRequest: [authenticate]` por rota ou `app.addHook('onRequest', authenticate)` para o módulo inteiro
- **Erros**: classe `AppError` com `statusCode` e `message` — o Fastify retorna automaticamente
- **Ownership**: todas as queries de entidades filhas filtram por `userId`
- **Delete cascade**: entidades filhas usam `onDelete: 'cascade'` na FK
- **Timestamps**: `createdAt` com `defaultNow()`, `updatedAt` atualizado manualmente com `new Date()` no repository

---

## Como Usar

1. Informe as tabelas no formato Prisma ou descreva os campos.
2. Eu gero: schema Drizzle, módulo completo (5 arquivos), registro nas rotas.
3. Rode `npx drizzle-kit generate` para gerar a migration.
4. Rode `npx drizzle-kit migrate` para aplicar no banco.
