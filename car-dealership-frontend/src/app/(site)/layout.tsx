import Link from 'next/link'
import { logoutAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { isAuthenticated } from '@/lib/auth'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <span className="text-amber-400 font-bold tracking-wider text-lg">AUTO</span>
            <span className="text-foreground font-bold tracking-wider text-lg">MERCADO</span>
          </Link>

          <nav className="flex items-center gap-2">
            {authenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/my-account">Minha Conta</Link>
                </Button>
                <form action={logoutAction}>
                  <Button variant="outline" size="sm" type="submit">
                    Sair
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Cadastrar</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="border-t border-border/40 py-6">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AutoMercado — compre e venda com confiança
        </div>
      </footer>
    </div>
  )
}
