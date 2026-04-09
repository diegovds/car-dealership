import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getCars, getCarsSearch } from '@/http/api'
import { Car } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { SearchForm } from './_components/search-form'

export const metadata: Metadata = {
  title: 'Veículos à Venda',
  description:
    'Explore centenas de veículos disponíveis. Use nossa busca inteligente com IA para encontrar o carro ideal para você.',
}

interface HomePageProps {
  searchParams: Promise<{ search?: string; page?: string }>
}

function formatPrice(price: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Number(price))
}

function formatMileage(mileage: number) {
  return new Intl.NumberFormat('pt-BR').format(mileage) + ' km'
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { search, page } = await searchParams
  const currentPage = page ? parseInt(page) : 1

  let cars: Awaited<ReturnType<typeof getCars>>['cars'] = []
  let meta: Awaited<ReturnType<typeof getCars>>['meta'] | null = null
  let aiReply: string | null = null

  if (search) {
    const result = await getCarsSearch({ search })
    cars = result.cars
    aiReply = result.reply
  } else {
    const result = await getCars({ page: currentPage })
    cars = result.cars
    meta = result.meta
  }

  return (
    <div className="container mx-auto flex flex-col gap-10 px-4 py-10">
      {/* Hero */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs tracking-[0.3em] text-amber-400 uppercase">
            Marketplace de Veículos
          </p>
          <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
            Encontre seu
            <br />
            <span className="text-amber-400">próximo carro</span>
          </h1>
        </div>
        <p className="text-muted-foreground max-w-md text-sm">
          Busca inteligente com IA — descreva o carro que você quer em linguagem
          natural.
        </p>
        <SearchForm defaultValue={search} />
      </section>

      {/* AI reply */}
      {aiReply && (
        <div className="text-muted-foreground border-l-2 border-amber-400 pl-4 text-sm italic">
          {aiReply}
        </div>
      )}

      {/* Car grid */}
      {cars.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-muted-foreground">Nenhum carro encontrado.</p>
          {search && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Ver todos</Link>
            </Button>
          )}
        </div>
      ) : (
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
              {!search && `${meta?.total ?? cars.length} veículos disponíveis`}
            </h2>
            {search && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Limpar busca</Link>
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cars.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group border-border/50 bg-card relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:border-amber-400/40 hover:shadow-[0_0_20px_rgba(251,191,36,0.06)]"
              >
                {/* Image */}
                <div className="bg-muted relative aspect-video overflow-hidden">
                  {car.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={car.imageUrl}
                      alt={`${car.brand} ${car.model}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-muted-foreground/30 flex h-full flex-col items-center justify-center gap-2">
                      <span>
                        <Car size={36} fill="currentColor" strokeWidth={0} />
                      </span>
                      <p className="text-[10px] tracking-widest uppercase">
                        Sem imagem
                      </p>
                    </div>
                  )}
                  {car.fuel && (
                    <Badge
                      variant="secondary"
                      className="absolute top-2 right-2 text-[10px] tracking-wider uppercase"
                    >
                      {car.fuel}
                    </Badge>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <p className="text-[11px] font-medium tracking-widest text-amber-400 uppercase">
                      {car.brand}
                    </p>
                    <h3 className="text-foreground leading-tight font-semibold">
                      {car.model}
                      {car.version && (
                        <span className="text-muted-foreground font-normal">
                          {' '}
                          {car.version}
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-2">
                    <div>
                      <p className="text-foreground text-lg font-bold tabular-nums">
                        {formatPrice(car.price)}
                      </p>
                      <div className="text-muted-foreground flex gap-2 text-[11px]">
                        <span>{car.year}</span>
                        {car.mileage !== null && car.mileage !== undefined && (
                          <>
                            <span>·</span>
                            <span>{formatMileage(car.mileage)}</span>
                          </>
                        )}
                        {car.transmission && (
                          <>
                            <span>·</span>
                            <span>{car.transmission}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/?page=${currentPage - 1}`}>← Anterior</Link>
                </Button>
              )}
              <span className="text-muted-foreground text-xs">
                {currentPage} / {meta.totalPages}
              </span>
              {currentPage < meta.totalPages && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/?page=${currentPage + 1}`}>Próxima →</Link>
                </Button>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
