import { isAuthenticated } from '@/lib/auth'
import { SiteHeader } from './_components/site-header'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader authenticated={authenticated} />

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="border-border/40 border-t py-6">
        <div className="text-muted-foreground container mx-auto px-4 text-center text-xs">
          © {new Date().getFullYear()} AutoMercado — compre e venda com
          confiança
        </div>
      </footer>
    </div>
  )
}
