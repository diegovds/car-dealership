# Car Dealership Frontend

Interface web para a plataforma Car Dealership, construida com Next.js 16 e React 19.

## Tecnologias

- **Next.js 16** (App Router, React Server Components)
- **React 19** com Server Actions
- **Tailwind CSS 4** com CSS variables e tema dark
- **shadcn/ui** (estilo `radix-nova`) sobre Radix UI
- **React Hook Form + Zod 4** para formularios e validacao
- **Orval** para geracao automatica de tipos a partir da API (OpenAPI)
- **Lucide React** para icones
- **JetBrains Mono** como fonte principal

## Requisitos

- Node.js 20+
- Backend rodando (API REST)

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variaveis de ambiente

Crie um arquivo `.env` na raiz do frontend:

```env
API_URL=http://localhost:3333
```

| Variavel | Descricao |
|---|---|
| `API_URL` | URL base da API REST do backend |

### 3. Gerar tipos da API (opcional)

Os tipos ja estao commitados em `src/http/api.ts`. Para regenerar apos mudancas no backend:

```bash
npx orval
```

Isso le o OpenAPI spec de `${API_URL}/docs/json` e gera o client tipado.

### 4. Iniciar em desenvolvimento

```bash
npm run dev
```

App disponivel em `http://localhost:3000`.

## Scripts

| Script | Descricao |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run start` | Inicia o servidor de producao |
| `npm run lint` | Roda o ESLint |

## Paginas

| Rota | Descricao | Acesso |
|---|---|---|
| `/` | Listagem de veiculos com paginacao e busca por IA | Publico |
| `/cars/:id` | Detalhes do veiculo com info do vendedor (nome e telefone) | Publico |
| `/login` | Login do vendedor | Somente visitante |
| `/register` | Cadastro do vendedor (nome, email, senha, telefone) | Somente visitante |
| `/my-account` | Painel do vendedor (perfil + anuncios) | Autenticado |

## Autenticacao

- **Login/Register**: Server Actions chamam a API e armazenam o JWT em um cookie httpOnly (`auth_token`, 7 dias)
- **Protecao de rotas**: feita nos layouts — `(auth)/layout.tsx` redireciona usuarios logados para `/my-account`; `(admin)/layout.tsx` redireciona visitantes para `/login`
- **Token**: lido server-side via `cookies()` do Next.js e passado como header `Authorization: Bearer <token>` nas chamadas autenticadas

## Integracao com API

O arquivo `src/http/api.ts` e gerado pelo Orval e exporta funcoes tipadas para todos os endpoints da API. Um `customFetch` em `src/lib/fetch-client.ts` serve como mutator que prefixa a `API_URL` e trata respostas sem body (204/304).

Server Actions em `src/actions/` encapsulam as chamadas autenticadas e fazem `revalidatePath` apos mutacoes.

## Componentes

### UI (shadcn)

`badge`, `button`, `card`, `dialog`, `form`, `input`, `label`, `select`, `textarea`

### Custom

| Componente | Descricao |
|---|---|
| `SearchForm` | Input de busca por IA com navegacao via query string |
| `LoginForm` / `RegisterForm` | Formularios com React Hook Form + Zod + mascara de telefone |
| `EditProfileDialog` | Edicao de perfil (nome, email, telefone, senha) |
| `AddCarDialog` / `EditCarDialog` | Formularios de criacao/edicao de veiculo |
| `CarItem` | Linha de veiculo no painel do vendedor com acoes de editar/excluir |
| `ButtonBack` | Botao de voltar na pagina de detalhes |

## Animacoes

O projeto usa `@starting-style` (CSS nativo) para animacoes de entrada SSR-safe — sem flash de conteudo. As classes (`enter-hero`, `enter-card`, `enter-right`, etc.) usam apenas `opacity` e `translate` para performance em mobile (GPU-composited).

## Estrutura do projeto

```
src/
  app/
    layout.tsx                   # Layout raiz (fontes, dark mode, metadata)
    globals.css                  # Tema, variaveis CSS, animacoes
    (site)/
      layout.tsx                 # Shell do site (header + footer)
      page.tsx                   # Home (listagem + busca IA)
      _components/
        search-form.tsx          # Input de busca
      cars/[id]/
        page.tsx                 # Detalhes do veiculo
        _components/
          button-back.tsx
      (auth)/
        layout.tsx               # Redireciona logados
        login/                   # Pagina de login
        register/                # Pagina de cadastro
      (admin)/
        layout.tsx               # Redireciona visitantes
        my-account/              # Painel do vendedor
          _components/           # Dialogs e itens
  actions/                       # Server Actions (auth, cars, users)
  http/
    api.ts                       # Client gerado pelo Orval
  lib/
    auth.ts                      # Helpers de autenticacao (cookie)
    env.ts                       # Validacao de env vars
    fetch-client.ts              # Mutator do Orval (customFetch)
    schemas.ts                   # Schemas Zod para formularios
    currency.ts                  # Formatacao BRL
    utils.ts                     # cn() + mascara de telefone
  components/
    ui/                          # Componentes shadcn
```
