'use client'

import { Button } from '@/components/ui/button'
import { GetCarsSearch200Meta } from '@/http/api'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function Pagination({
  meta,
  currentPage,
}: {
  meta: GetCarsSearch200Meta
  currentPage: number
}) {
  const searchParams = useSearchParams()
  const search = searchParams.get('search')

  const buildUrl = (page: number) => {
    const params = new URLSearchParams()

    if (search) {
      params.set('search', search)
    }

    params.set('page', String(page))

    return `/cars?${params.toString()}`
  }

  return (
    <>
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={buildUrl(currentPage - 1)}>← Anterior</Link>
            </Button>
          )}
          <span className="text-muted-foreground text-xs">
            {currentPage} / {meta.totalPages}
          </span>
          {currentPage < meta.totalPages && (
            <Button variant="outline" size="sm" asChild>
              <Link href={buildUrl(currentPage + 1)}>Próxima →</Link>
            </Button>
          )}
        </div>
      )}
    </>
  )
}
