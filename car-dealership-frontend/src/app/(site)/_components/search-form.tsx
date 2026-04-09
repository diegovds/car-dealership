'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchFormProps {
  defaultValue?: string
}

export function SearchForm({ defaultValue }: SearchFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = (formData.get('search') as string).trim()
    startTransition(() => {
      if (search) {
        router.push(`/?search=${encodeURIComponent(search)}`)
      } else {
        router.push('/')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
      <Input
        name="search"
        defaultValue={defaultValue}
        placeholder="Ex: gol flex até 50 mil, SUV automático, Honda ano 2020..."
        className="flex-1 border-border/60 bg-muted/30 text-sm placeholder:text-muted-foreground/50 focus-visible:border-amber-400/60 focus-visible:ring-amber-400/10"
      />
      <Button type="submit" disabled={isPending} className="bg-amber-400 text-black hover:bg-amber-300 font-semibold">
        {isPending ? '...' : 'Buscar'}
      </Button>
    </form>
  )
}
