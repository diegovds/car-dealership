'use client'

import { logoutAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SiteHeaderProps {
  authenticated: boolean
}

export function SiteHeader({ authenticated }: SiteHeaderProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      <header className="enter-header border-border/40 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link
            href="/"
            className="group flex items-center transition-opacity hover:opacity-80"
          >
            <span className="text-lg font-bold tracking-wider text-amber-400 transition-all duration-300 group-hover:tracking-widest">
              Auto
            </span>
            <span className="text-foreground text-lg font-bold tracking-wider">
              Mercado
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            style={{ '--enter-delay': '150ms' } as React.CSSProperties}
            className="enter-header hidden items-center gap-1 sm:flex"
          >
            <DesktopLink href="/cars" active={isActive('/cars')}>
              Veículos
            </DesktopLink>
            {authenticated ? (
              <>
                <DesktopLink
                  href="/my-account"
                  active={isActive('/my-account')}
                >
                  Minha Conta
                </DesktopLink>
                <form action={logoutAction}>
                  <Button variant="outline" size="sm" type="submit">
                    Sair
                  </Button>
                </form>
              </>
            ) : (
              <>
                <DesktopLink href="/login" active={isActive('/login')}>
                  Entrar
                </DesktopLink>
                <Button size="sm" asChild>
                  <Link href="/register">Cadastrar</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="text-foreground flex items-center justify-center rounded-md p-2 transition-colors hover:bg-white/5 sm:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
          >
            <Menu
              className={cn(
                'size-5 transition-all duration-200',
                open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100',
              )}
            />
            <X
              className={cn(
                'absolute size-5 transition-all duration-200',
                open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0',
              )}
            />
          </button>
        </div>
      </header>

      {/* Overlay — sempre no DOM para transição suave */}
      <div
        className={cn(
          'fixed inset-0 top-14 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 sm:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile panel — fixo, desliza de cima para baixo */}
      <div
        className={cn(
          'fixed inset-x-0 top-14 z-50 border-b border-border/40 bg-background shadow-2xl transition-[transform,opacity] duration-200 ease-out sm:hidden',
          open
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-3 opacity-0',
        )}
      >
        <nav className="container mx-auto flex flex-col gap-0.5 px-4 py-3">
          <MobileLink href="/cars" active={isActive('/cars')}>
            Veículos
          </MobileLink>
          {authenticated ? (
            <>
              <MobileLink
                href="/my-account"
                active={isActive('/my-account')}
              >
                Minha Conta
              </MobileLink>
              <div className="pt-1">
                <form action={logoutAction}>
                  <Button
                    variant="outline"
                    size="sm"
                    type="submit"
                    className="w-full"
                  >
                    Sair
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <>
              <MobileLink href="/login" active={isActive('/login')}>
                Entrar
              </MobileLink>
              <div className="pt-1">
                <Button size="sm" asChild className="w-full">
                  <Link href="/register">Cadastrar</Link>
                </Button>
              </div>
            </>
          )}
        </nav>
      </div>
    </>
  )
}

function DesktopLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className={cn(
          active
            ? 'text-amber-400 hover:text-amber-300'
            : 'text-muted-foreground',
        )}
      >
        <Link href={href}>{children}</Link>
      </Button>
      {active && (
        <span className="bg-amber-400 absolute bottom-0.5 left-2.5 right-2.5 h-px rounded-full" />
      )}
    </div>
  )
}

function MobileLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-amber-400/8 text-amber-400'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {active && (
        <span className="mr-2.5 h-4 w-0.5 shrink-0 rounded-full bg-amber-400" />
      )}
      {children}
    </Link>
  )
}
