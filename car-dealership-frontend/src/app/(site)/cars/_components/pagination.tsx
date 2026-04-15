'use client'

import { Button } from '@/components/ui/button'
import type { GetCarsSearch200Filters, GetCarsSearch200Meta } from '@/http/api'
import Link from 'next/link'

interface PaginationProps {
  meta: GetCarsSearch200Meta | null
  currentPage: number
  filterParams?: GetCarsSearch200Filters
}

export function Pagination({
  meta,
  currentPage,
  filterParams,
}: PaginationProps) {
  if (!meta || meta.totalPages <= 1) return null

  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    if (filterParams) {
      Object.entries(filterParams).forEach(([k, v]) => {
        if (v !== undefined && v !== null) params.set(k, String(v))
      })
    }
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return qs ? `/cars?${qs}` : '/cars'
  }

  return (
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
  )
}
