import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()
  if (authenticated) redirect('/my-account')

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      {children}
    </div>
  )
}
