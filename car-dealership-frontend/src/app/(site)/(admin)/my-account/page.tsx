import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Minha Conta',
  description:
    'Gerencie seu perfil e seus anúncios de veículos no AutoMercado.',
}
import { getUsers } from '@/http/api'
import { getAuthToken } from '@/lib/auth'
import { AddCarDialog } from './_components/add-car-dialog'
import { CarItem } from './_components/car-item'
import { EditProfileDialog } from './_components/edit-profile-dialog'

interface MyAccountPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function MyAccountPage({
  searchParams,
}: MyAccountPageProps) {
  const { page } = await searchParams
  const currentPage = page ? parseInt(page) : 1
  const token = await getAuthToken()

  const { user, cars, meta } = await getUsers(
    { page: currentPage },
    { headers: { Authorization: `Bearer ${token}` } },
  )

  return (
    <div className="container mx-auto flex flex-col gap-8 px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs tracking-[0.3em] text-amber-400 uppercase">
            Área do vendedor
          </p>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
            <EditProfileDialog user={user} />
          </div>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
        <AddCarDialog />
      </div>

      {/* Divider */}
      <div className="bg-border/50 h-px" />

      {/* Car list */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            Meus anúncios
            <span className="text-foreground ml-2">{meta.total}</span>
          </h2>
        </div>

        {cars.length === 0 ? (
          <div className="border-border/50 flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
            <p className="text-muted-foreground text-sm">
              Você ainda não tem anúncios.
            </p>
            <AddCarDialog />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cars.map((car) => (
              <CarItem key={car.id} car={car} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            {currentPage > 1 && (
              <Link
                href={`/my-account?page=${currentPage - 1}`}
                className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
              >
                ← Anterior
              </Link>
            )}
            <span className="text-muted-foreground text-xs">
              {currentPage} / {meta.totalPages}
            </span>
            {currentPage < meta.totalPages && (
              <Link
                href={`/my-account?page=${currentPage + 1}`}
                className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
              >
                Próxima →
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
