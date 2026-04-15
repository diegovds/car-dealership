import { Badge } from '@/components/ui/badge'
import { formatBRL, formatKm } from '@/lib/currency'
import type { GetCars200CarsItem } from '@/http/api'
import Link from 'next/link'
import { CarImagePlaceholder } from './car-image-placeholder'

interface CarCardProps {
  car: GetCars200CarsItem
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Link
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
          <CarImagePlaceholder size="md" />
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
              {formatBRL(car.price)}
            </p>
            <div className="text-muted-foreground flex gap-2 text-[11px]">
              <span>{car.year}</span>
              {car.mileage !== null && car.mileage !== undefined && (
                <>
                  <span>·</span>
                  <span>{formatKm(car.mileage)}</span>
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
  )
}
