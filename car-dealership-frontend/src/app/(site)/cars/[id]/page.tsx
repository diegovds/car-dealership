import { Badge } from '@/components/ui/badge'
import { getCarsId } from '@/http/api'
import { formatBRL } from '@/lib/currency'
import { Calendar, Car, Fuel, Gauge, Phone, Settings2, User } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ButtonBack } from './_components/button-back'

interface CarDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: CarDetailPageProps): Promise<Metadata> {
  const { id } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const car = (await getCarsId(id)) as any

  if (car?.message || !car?.id) {
    return { title: 'Veículo não encontrado' }
  }

  const title = `${car.brand} ${car.model}${car.version ? ` ${car.version}` : ''} (${car.year})`
  const price = formatBRL(String(car.price))

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
    car.transmission
      ? { icon: Settings2, label: 'Câmbio', value: car.transmission }
      : null,
    car.mileage != null
      ? {
          icon: Gauge,
          label: 'Quilometragem',
          value: formatMileage(car.mileage),
        }
      : null,
  ].filter(Boolean) as {
    icon: React.ElementType
    label: string
    value: string
  }[]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back */}
      <ButtonBack />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* Left — image */}
        <div className="enter-hero flex flex-col gap-4">
          <div className="enter-zoom border-border/50 bg-muted relative aspect-video w-full overflow-hidden rounded-2xl border">
            {car.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={car.imageUrl}
                alt={`${car.brand} ${car.model}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground/30 flex h-full flex-col items-center justify-center gap-3">
                <span className="animate-float">
                  <Car
                    size={72}
                    strokeWidth={0}
                    className="text-muted-foreground/20 fill-current"
                  />
                </span>
                <p className="text-xs tracking-widest uppercase">Sem imagem</p>
              </div>
            )}
          </div>

          {/* Specs grid — shown below image on desktop */}
          {specs.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {specs.map(({ icon: Icon, label, value }, specIndex) => (
                <div
                  key={label}
                  style={
                    {
                      '--enter-delay': `${specIndex * 80 + 250}ms`,
                    } as React.CSSProperties
                  }
                  className="enter-card border-border/50 bg-card flex flex-col gap-1 rounded-xl border p-4"
                >
                  <div className="text-muted-foreground flex items-center gap-1.5">
                    <Icon className="size-3.5" />
                    <span className="text-[10px] tracking-wider uppercase">
                      {label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — details */}
        <aside
          style={{ '--enter-delay': '150ms' } as React.CSSProperties}
          className="enter-right flex flex-col gap-6 lg:sticky lg:top-24"
        >
          {/* Brand + Model */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-[0.25em] text-amber-400 uppercase">
                {car.brand}
              </span>
              {car.fuel && (
                <Badge
                  variant="secondary"
                  className="text-[10px] tracking-wider uppercase"
                >
                  {car.fuel}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl leading-tight font-bold tracking-tight">
              {car.model}
              {car.version && (
                <span className="text-muted-foreground mt-0.5 block text-lg font-normal">
                  {car.version}
                </span>
              )}
            </h1>
          </div>

          {/* Price */}
          <div className="animate-glow-pulse flex flex-col gap-1 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
            <p className="text-[10px] tracking-widest text-amber-400/70 uppercase">
              Preço
            </p>
            <p className="text-4xl font-bold tracking-tight tabular-nums">
              {formatBRL(String(car.price))}
            </p>
          </div>

          {/* Seller */}
          <div className="border-border/30 flex flex-col gap-3 rounded-xl border p-4">
            <p className="text-muted-foreground/50 text-[10px] tracking-widest uppercase">
              Vendedor
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-muted flex size-8 items-center justify-center rounded-full">
                <User className="text-muted-foreground size-4" />
              </div>
              <span className="text-sm font-medium">{car.seller.name}</span>
            </div>
            <a
              href={`tel:${car.seller.phone}`}
              className="flex items-center gap-2 rounded-lg bg-amber-400/10 px-3 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-400/20"
            >
              <Phone className="size-3.5" />
              {car.seller.phone}
            </a>
          </div>

          {/* Metadata */}
          <div className="border-border/30 flex flex-col gap-1 border-t pt-4">
            <p className="text-muted-foreground/50 text-[10px] tracking-widest uppercase">
              Anunciado em
            </p>
            <p className="text-muted-foreground text-xs">
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
