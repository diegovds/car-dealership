'use client'

import { deleteCarAction } from '@/actions/cars'
import { formatBRL } from '@/lib/currency'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { GetUsers200CarsItem } from '@/http/api'
import { Car, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { EditCarDialog } from './edit-car-dialog'

interface CarItemProps {
  car: GetUsers200CarsItem
}

export function CarItem({ car }: CarItemProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirmDelete() {
    startTransition(async () => {
      await deleteCarAction(car.id)
      setOpen(false)
    })
  }

  return (
    <div className="group border-border/50 bg-card hover:border-border flex gap-4 rounded-xl border p-4 transition-all duration-300 hover:shadow-sm hover:-translate-y-px">
      {/* Thumbnail — clicável */}
      <Link
        href={`/cars/${car.id}`}
        className="bg-muted relative h-20 w-28 shrink-0 overflow-hidden rounded-lg"
      >
        {car.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground/30 flex h-full flex-col items-center justify-center gap-1">
            <span>
              <Car
                size={20}
                strokeWidth={0}
                className="text-muted-foreground/20 fill-current"
              />
            </span>
            <p className="text-[8px] tracking-widest uppercase">Sem imagem</p>
          </div>
        )}
      </Link>

      {/* Info — clicável */}
      <Link
        href={`/cars/${car.id}`}
        className="flex min-w-0 flex-1 flex-col justify-between gap-1 transition-opacity hover:opacity-80"
      >
        <div>
          <p className="text-[10px] font-medium tracking-widest text-amber-400 uppercase">
            {car.brand}
          </p>
          <p className="truncate leading-tight font-semibold">
            {car.model}
            {car.version && (
              <span className="text-muted-foreground font-normal">
                {' '}
                {car.version}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-[10px]">
            {car.year}
          </Badge>
          {car.fuel && (
            <Badge variant="secondary" className="text-[10px]">
              {car.fuel}
            </Badge>
          )}
          {car.transmission && (
            <Badge variant="secondary" className="text-[10px]">
              {car.transmission}
            </Badge>
          )}
          {car.mileage !== null && car.mileage !== undefined && (
            <Badge variant="secondary" className="text-[10px]">
              {new Intl.NumberFormat('pt-BR').format(car.mileage)} km
            </Badge>
          )}
        </div>
      </Link>

      {/* Price + actions */}
      <div className="flex shrink-0 flex-col items-end justify-between">
        <p className="text-base font-bold tabular-nums">
          {formatBRL(car.price)}
        </p>
        <div className="flex items-center gap-1">
          <EditCarDialog car={car} />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setOpen(true)}
            disabled={isPending}
            className="text-muted-foreground hover:text-destructive transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remover anúncio</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o anúncio de{' '}
              <span className="text-foreground font-semibold">
                {car.brand} {car.model}
              </span>
              ? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isPending}
            >
              {isPending ? 'Removendo...' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
