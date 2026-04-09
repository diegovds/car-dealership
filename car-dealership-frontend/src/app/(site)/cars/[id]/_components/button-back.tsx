'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ButtonBack() {
  const router = useRouter()

  function handleBack() {
    const referrer = document.referrer
    const isSameOrigin =
      referrer && new URL(referrer).origin === window.location.origin
    if (isSameOrigin) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="text-muted-foreground mb-6 -ml-2 cursor-pointer"
      onClick={handleBack}
    >
      <div>
        <ArrowLeft className="size-4" />
        Voltar
      </div>
    </Button>
  )
}
