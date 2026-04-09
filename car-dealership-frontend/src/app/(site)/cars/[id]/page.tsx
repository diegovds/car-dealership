import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Fuel, Gauge, Settings2 } from 'lucide-react'
import type { Metadata } from 'next'
import { getCarsId } from '@/http/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CarDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CarDetailPageProps): Promise<Metadata> {
  const { id } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const car = (await getCarsId(id)) as any

  if (car?.message || !car?.id) {
    return { title: 'Veículo não encontrado' }
  }

  const title = `${car.brand} ${car.model}${car.version ? ` ${car.version}` : ''} (${car.year})`
  const price = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Number(car.price))

  return {
    title,
    description: `${title} por ${price}. Confira os detalhes e entre em contato.`,
    openGraph: {
      title,
      description: `${title} — ${price}`,
      ...(car.imageUrl ? { images: [{ url: car.imageUrl, alt: title }] } : {}),
    },
  }
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

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const car = (await getCarsId(id)) as any

  if (car?.message || !car?.id) notFound()

  const specs = [
    { icon: Calendar, label: 'Ano', value: String(car.year) },
    car.fuel ? { icon: Fuel, label: 'Combustível', value: car.fuel } : null,
    car.transmission ? { icon: Settings2, label: 'Câmbio', value: car.transmission } : null,
    car.mileage != null
      ? { icon: Gauge, label: 'Quilometragem', value: formatMileage(car.mileage) }
      : null,
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-6 text-muted-foreground">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* Left — image */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/50 bg-muted">
            {car.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={car.imageUrl}
                alt={`${car.brand} ${car.model}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground/30">
                <span className="text-7xl">🚗</span>
                <p className="text-xs tracking-widest uppercase">Sem imagem</p>
              </div>
            )}
          </div>

          {/* Specs grid — shown below image on desktop */}
          {specs.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {specs.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 rounded-xl border border-border/50 bg-card p-4"
                >
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Icon className="size-3.5" />
                    <span className="text-[10px] uppercase tracking-wider">{label}</span>
                  </div>
                  <p className="text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — details */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
          {/* Brand + Model */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-[0.25em] text-amber-400 uppercase">
                {car.brand}
              </span>
              {car.fuel && (
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                  {car.fuel}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight">
              {car.model}
              {car.version && (
                <span className="block text-lg font-normal text-muted-foreground mt-0.5">
                  {car.version}
                </span>
              )}
            </h1>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
            <p className="text-[10px] uppercase tracking-widest text-amber-400/70">Preço</p>
            <p className="text-4xl font-bold tabular-nums tracking-tight">
              {formatPrice(car.price)}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-1 border-t border-border/30 pt-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
              Anunciado em
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(car.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
