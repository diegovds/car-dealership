import { Button } from '@/components/ui/button'
import {
  getCars,
  getCarsFilter,
  getCarsSearch,
  type GetCarsSearch200Filters,
} from '@/http/api'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CarCard } from '../_components/car-card'
import { SearchForm } from '../_components/search-form'
import { AiReply } from './_components/ai-reply'
import { Pagination } from './_components/pagination'

export const metadata: Metadata = {
  title: 'Veículos à Venda',
  description:
    'Explore centenas de veículos disponíveis. Use nossa busca inteligente com IA para encontrar o carro ideal para você.',
}

const FILTER_KEYS = [
  'brand',
  'model',
  'version',
  'year',
  'yearMin',
  'yearMax',
  'mileageMin',
  'mileageMax',
  'fuel',
  'transmission',
  'priceMin',
  'priceMax',
] as const

interface CarsPageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams
  const search = params.search
  const currentPage = params.page ? parseInt(params.page) : 1

  let cars: Awaited<ReturnType<typeof getCars>>['cars'] = []
  let meta: Awaited<ReturnType<typeof getCars>>['meta'] | null = null
  // string = nova busca, undefined = paginação (client lê sessionStorage), null = limpar
  let aiReply: string | null | undefined = null
  let filterParams: GetCarsSearch200Filters | undefined

  const isFilterMode =
    !search && FILTER_KEYS.some((k) => params[k] !== undefined)

  if (search) {
    // IA: sempre página 1 — filtros extraídos são usados na paginação
    const result = await getCarsSearch({ search, page: 1 })
    cars = result.cars
    meta = result.meta
    aiReply = result.reply
    filterParams = result.filters
  } else if (isFilterMode) {
    // Paginação da busca IA — vai direto ao banco, sem chamar a IA
    const filters: GetCarsSearch200Filters = {}
    for (const k of FILTER_KEYS) {
      const v = params[k]
      if (v !== undefined) {
        ;(filters as Record<string, string | number>)[k] = isNaN(Number(v))
          ? v
          : Number(v)
      }
    }
    filterParams = filters
    aiReply = undefined // client restaura do sessionStorage
    const result = await getCarsFilter({ ...filters, page: currentPage })
    cars = result.cars
    meta = result.meta
  } else {
    // Listagem normal
    const result = await getCars({ page: currentPage })
    cars = result.cars
    meta = result.meta
  }

  const isSearching = search || isFilterMode

  return (
    <div className="container mx-auto flex flex-col gap-10 px-4 py-10">
      {/* Hero */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p
            style={{ '--enter-delay': '0ms' } as React.CSSProperties}
            className="enter-hero text-xs tracking-[0.3em] text-amber-400 uppercase"
          >
            Marketplace de Veículos
          </p>
          <h1
            style={{ '--enter-delay': '100ms' } as React.CSSProperties}
            className="enter-hero text-foreground text-4xl font-bold tracking-tight md:text-5xl"
          >
            Encontre seu
            <br />
            <span className="animate-shimmer-text">próximo carro</span>
          </h1>
        </div>
        <p
          style={{ '--enter-delay': '200ms' } as React.CSSProperties}
          className="enter-hero text-muted-foreground max-w-md text-sm"
        >
          Busca inteligente com IA — descreva o carro que você quer em linguagem
          natural.
        </p>
        <div
          style={{ '--enter-delay': '300ms' } as React.CSSProperties}
          className="enter-hero"
        >
          <SearchForm defaultValue={search} preserveInput={isFilterMode} />
        </div>
      </section>

      {/* AI reply */}
      <AiReply reply={aiReply} />

      {/* Car grid */}
      {cars.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-muted-foreground">Nenhum carro encontrado.</p>
          {isSearching && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/cars">Ver todos</Link>
            </Button>
          )}
        </div>
      ) : (
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
              {!isSearching &&
                `${meta?.total ?? cars.length} veículos disponíveis`}
            </h2>
            {isSearching && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/cars">Limpar busca</Link>
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cars.map((car, index) => (
              <div
                key={car.id}
                style={
                  {
                    '--enter-delay': `${Math.min(index * 55, 440)}ms`,
                  } as React.CSSProperties
                }
                className="enter-card"
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>

          <Pagination
            meta={meta}
            currentPage={currentPage}
            filterParams={filterParams}
          />
        </section>
      )}
    </div>
  )
}
