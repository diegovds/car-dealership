# Car Dealership Frontend

Interface web para a plataforma Car Dealership, construída com Next.js 16 e React 19.

## Tecnologias

- **Next.js 16** (App Router, React Server Components)
- **React 19** com Server Actions
- **Tailwind CSS 4** com CSS variables e tema dark
- **shadcn/ui** (estilo `radix-nova`) sobre Radix UI
- **React Hook Form + Zod 4** para formulários e validação
- **Orval** para geração automática de tipos a partir da API (OpenAPI)
- **Lucide React** para ícones
- **JetBrains Mono** como fonte principal (corpo) + **Barlow Condensed** para tipografia display

## Requisitos

- Node.js 20+
- Backend rodando (API REST)

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

Crie um arquivo `.env` na raiz do frontend:

```env
API_URL=http://localhost:3333
```

| Variável | Descrição |
|---|---|
| `API_URL` | URL base da API REST do backend |

### 3. Gerar tipos da API (opcional)

Os tipos já estão commitados em `src/http/api.ts`. Para regenerar após mudanças no backend:

```bash
npx orval
```

Isso lê o OpenAPI spec de `${API_URL}/docs/json` e gera o client tipado.

### 4. Iniciar em desenvolvimento

```bash
npm run dev
```

App disponível em `http://localhost:3000`.

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Roda o ESLint |

## Páginas

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Landing page editorial com tipografia display e marquee de marcas | Público |
| `/cars` | Listagem de veículos com paginação e busca por IA | Público |
| `/cars/:id` | Detalhes do veículo com info do vendedor (nome e telefone) | Público |
| `/login` | Login do vendedor | Somente visitante |
| `/register` | Cadastro do vendedor (nome, email, senha, telefone) | Somente visitante |
| `/my-account` | Painel do vendedor (perfil + anúncios) | Autenticado |

## Autenticação

- **Login/Register**: Server Actions chamam a API e armazenam o JWT em um cookie httpOnly (`auth_token`, 7 dias)
- **Proteção de rotas**: feita nos layouts — `(auth)/layout.tsx` redireciona usuários logados para `/my-account`; `(admin)/layout.tsx` redireciona visitantes para `/login`
- **Token**: lido server-side via `cookies()` do Next.js e passado como header `Authorization: Bearer <token>` nas chamadas autenticadas

## Integração com API

O arquivo `src/http/api.ts` é gerado pelo Orval e exporta funções tipadas para todos os endpoints da API. Um `customFetch` em `src/lib/fetch-client.ts` serve como mutator que prefixa a `API_URL` e trata respostas sem body (204/304).

Server Actions em `src/actions/` encapsulam as chamadas autenticadas e fazem `revalidatePath` após mutações.

## Busca por IA — comportamento client-side

- **Input preservado na paginação**: `SearchForm` recebe `preserveInput` quando em modo filtro, evitando reset do campo ao trocar de página
- **Reply da IA sem URL**: `AiReply` usa `sessionStorage` + `useSyncExternalStore` para persistir a resposta entre páginas sem poluir a URL — `string` salva, `undefined` restaura, `null` limpa

## Componentes

### UI (shadcn)

`badge`, `button`, `card`, `dialog`, `form`, `input`, `label`, `select`, `textarea`

### Custom

| Componente | Descrição |
|---|---|
| `SearchForm` | Input de busca por IA com React Hook Form + Zod; reseta ao limpar a busca, preserva valor ao paginar |
| `CarCard` | Card de veículo na vitrine pública |
| `CarItem` | Linha de veículo no painel do vendedor com ações de editar/excluir |
| `CarFormFields` | Campos de formulário de veículo extraídos e compartilhados entre `AddCarDialog` e `EditCarDialog`; genérico via `Control<T>` |
| `Pagination` | Paginação compartilhada entre `/cars` (com filtros IA) e `/my-account`; prop `basePath` configura a rota base |
| `AiReply` | Exibe a resposta em linguagem natural da IA; persiste via `sessionStorage` para sobreviver à paginação sem passar pela URL |
| `CarImagePlaceholder` | Placeholder "Sem imagem" com ícone `Car`; presets `sm` / `md` / `lg` para uso em card, lista e página de detalhes |
| `FormError` | Exibe erro root do React Hook Form; usado em todos os formulários |
| `LoginForm` / `RegisterForm` | Formulários com React Hook Form + Zod + máscara de telefone |
| `EditProfileDialog` | Edição de perfil (nome, email, telefone, senha) |
| `AddCarDialog` / `EditCarDialog` | Formulários de criação/edição de veículo (campos via `CarFormFields`) |
| `ButtonBack` | Botão de voltar na página de detalhes |

## Animações

O projeto usa `@starting-style` (CSS nativo) para animações de entrada SSR-safe — sem flash de conteúdo. As classes (`enter-hero`, `enter-card`, `enter-right`, etc.) usam apenas `opacity` e `translate` para performance em mobile (GPU-composited).

## Estrutura do projeto

```
src/
  app/
    layout.tsx                   # Layout raiz (fontes Geist + JetBrains Mono + Barlow Condensed, dark mode)
    globals.css                  # Tema, variáveis CSS, animações (enter, marquee, shimmer)
    (site)/
      layout.tsx                 # Shell do site (header com nav + footer)
      page.tsx                   # Landing page (tipografia display + marquee de marcas)
      _components/
        search-form.tsx          # Input de busca (RHF + Zod, reseta ao limpar, preserva ao paginar)
        car-card.tsx             # Card de veículo na vitrine
        car-image-placeholder.tsx# Placeholder "Sem imagem" (presets sm/md/lg)
        pagination.tsx           # Paginação compartilhada (basePath configurável)
      cars/
        page.tsx                 # Vitrine de veículos (listagem + busca IA + filtro)
        _components/
          ai-reply.tsx           # Resposta da IA persistida via sessionStorage
          pagination.tsx         # Re-exporta de (site)/_components/pagination
      cars/[id]/
        page.tsx                 # Detalhes do veículo
        _components/
          button-back.tsx
      (auth)/
        layout.tsx               # Redireciona logados
        login/                   # Página de login
        register/                # Página de cadastro
      (admin)/
        layout.tsx               # Redireciona visitantes
        my-account/              # Painel do vendedor
          _components/
            car-form-fields.tsx  # Campos de formulário de veículo (compartilhado entre add/edit)
            add-car-dialog.tsx   # Dialog de criação de veículo
            edit-car-dialog.tsx  # Dialog de edição de veículo
            edit-profile-dialog.tsx
            car-item.tsx
  actions/                       # Server Actions (auth, cars, users)
  http/
    api.ts                       # Client gerado pelo Orval (atualizado manualmente)
  lib/
    auth.ts                      # Helpers de autenticação (cookie)
    env.ts                       # Validação de env vars
    fetch-client.ts              # Mutator do Orval (customFetch)
    schemas.ts                   # Schemas Zod para formulários
    currency.ts                  # Formatação BRL e quilometragem
    utils.ts                     # cn() + máscara de telefone
    car-options.ts               # FUEL_OPTIONS e TRANSMISSION_OPTIONS compartilhados
  components/
    ui/                          # Componentes shadcn
      form-error.tsx             # Exibe erro root do React Hook Form
```
