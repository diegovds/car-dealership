'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const searchSchema = z.object({
  search: z.string(),
})

type SearchFormValues = z.infer<typeof searchSchema>

interface SearchFormProps {
  defaultValue?: string
  preserveInput?: boolean
}

export function SearchForm({ defaultValue, preserveInput }: SearchFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: defaultValue ?? '' },
  })

  useEffect(() => {
    if (!preserveInput) {
      form.reset({ search: defaultValue ?? '' })
    }
  }, [defaultValue, preserveInput, form])

  function onSubmit(values: SearchFormValues) {
    const search = values.search.trim()
    startTransition(() => {
      if (search) {
        router.push(`/cars?search=${encodeURIComponent(search)}`)
      } else {
        router.push('/cars')
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-lg gap-2"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: gol flex até 60 mil, corolla automático, Honda ano 2022..."
                  className="border-border/60 bg-muted/30 placeholder:text-muted-foreground/50 text-sm focus-visible:border-amber-400/60 focus-visible:ring-amber-400/10"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending}
          className="bg-amber-400 font-semibold text-black transition-all duration-200 hover:bg-amber-300 hover:shadow-[0_0_16px_rgba(251,191,36,0.3)] active:scale-95"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Buscando</span>
            </>
          ) : (
            'Buscar'
          )}
        </Button>
      </form>
    </Form>
  )
}
