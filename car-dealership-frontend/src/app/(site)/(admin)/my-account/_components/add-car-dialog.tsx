'use client'

import { createCarAction } from '@/actions/cars'
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
import { carSchema, type CarFormValues } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { CarFormFields } from './car-form-fields'

export function AddCarDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    },
    [],
  )

  const form = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      brand: '',
      model: '',
      version: '',
      year: new Date().getFullYear(),
      price: '',
      fuel: '',
      transmission: '',
      mileage: undefined,
      imageUrl: '',
    },
  })

  function handleClose() {
    setOpen(false)
    resetTimer.current = setTimeout(() => form.reset(), 200)
  }

  function onSubmit(values: CarFormValues) {
    startTransition(async () => {
      const result = await createCarAction(values)
      if (result?.error) {
        form.setError('root', { message: result.error })
      } else {
        form.reset()
        setOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => (val ? setOpen(true) : handleClose())}
    >
      <DialogTrigger asChild>
        <Button className="gap-1.5 bg-amber-400 font-semibold text-black hover:bg-amber-300">
          <Plus className="size-4" />
          Anunciar carro
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            Cadastrar novo anúncio
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
                onClick={handleClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-amber-400 font-semibold text-black hover:bg-amber-300"
              >
                {isPending ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
