'use client'

import { updateCarAction } from '@/actions/cars'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { FormError } from '@/components/ui/form-error'
import type { GetUsers200CarsItem } from '@/http/api'
import { updateCarSchema, type UpdateCarFormValues } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { CarFormFields } from './car-form-fields'

interface EditCarDialogProps {
  car: GetUsers200CarsItem
}

export function EditCarDialog({ car }: EditCarDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<UpdateCarFormValues>({
    resolver: zodResolver(updateCarSchema),
    defaultValues: {
      brand: car.brand,
      model: car.model,
      version: car.version ?? '',
      year: car.year,
      price: car.price,
      fuel: car.fuel ?? '',
      transmission: car.transmission ?? '',
      mileage: car.mileage ?? undefined,
      imageUrl: car.imageUrl ?? '',
    },
  })

  function onSubmit(values: UpdateCarFormValues) {
    startTransition(async () => {
      const result = await updateCarAction(car.id, values)
      if (result?.error) {
        form.setError('root', { message: result.error })
      } else {
        setOpen(false)
        router.push('/my-account')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Pencil className="size-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Editar anúncio
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 pt-2"
          >
            <FormError message={form.formState.errors.root?.message} />

            <CarFormFields control={form.control} />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-amber-400 font-semibold text-black hover:bg-amber-300"
              >
                {isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
