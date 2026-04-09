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
    <div className="enter-left mb-6">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-muted-foreground -ml-2 cursor-pointer transition-transform duration-200 hover:-translate-x-0.5"
        onClick={handleBack}
      >
        <div>
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Voltar
        </div>
      </Button>
    </div>
  )
}
