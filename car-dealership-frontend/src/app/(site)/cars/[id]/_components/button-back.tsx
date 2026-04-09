'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ButtonBack() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="text-muted-foreground mb-6 -ml-2 cursor-pointer"
      onClick={() => router.back()}
    >
      <div>
        <ArrowLeft className="size-4" />
        Voltar
      </div>
    </Button>
  )
}
