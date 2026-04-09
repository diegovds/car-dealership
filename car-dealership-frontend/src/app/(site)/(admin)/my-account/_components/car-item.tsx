'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { deleteCarAction } from '@/actions/cars'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EditCarDialog } from './edit-car-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { GetUsers200CarsItem } from '@/http/api'

interface CarItemProps {
  car: GetUsers200CarsItem
}

function formatPrice(price: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Number(price))
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
    <div className="group flex gap-4 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border">
      {/* Thumbnail — clicável */}
      <Link
        href={`/cars/${car.id}`}
        className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        {car.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground/30">
            <span className="text-xl">🚗</span>
            <p className="text-[8px] tracking-widest uppercase">Sem imagem</p>
          </div>
        )}
      </Link>

      {/* Info — clicável */}
      <Link
        href={`/cars/${car.id}`}
        className="flex flex-1 flex-col justify-between gap-1 min-w-0 hover:opacity-80 transition-opacity"
      >
        <div>
          <p className="text-[10px] font-medium tracking-widest text-amber-400 uppercase">
            {car.brand}
          </p>
          <p className="font-semibold leading-tight truncate">
            {car.model}
            {car.version && (
              <span className="font-normal text-muted-foreground"> {car.version}</span>
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
      <div className="flex flex-col items-end justify-between shrink-0">
        <p className="text-base font-bold tabular-nums">{formatPrice(car.price)}</p>
        <div className="flex items-center gap-1">
          <EditCarDialog car={car} />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setOpen(true)}
            disabled={isPending}
            className="text-muted-foreground transition-opacity hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
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
              <span className="font-semibold text-foreground">
                {car.brand} {car.model}
              </span>
              ? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
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
