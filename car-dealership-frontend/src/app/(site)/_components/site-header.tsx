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

const ENTER_MS = 220
const EXIT_MS = 180

export function SiteHeader({ authenticated }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  // Abrir: monta → single rAF → aplica estado aberto (transição de entrada)
  function handleOpen() {
    setIsMounted(true)
  }
  useEffect(() => {
    if (!isMounted) return
    const raf = requestAnimationFrame(() => setIsOpen(true))
    return () => cancelAnimationFrame(raf)
  }, [isMounted])

  // Fechar: aplica estado fechado → desmonta após transição de saída
  function handleClose() {
    setIsOpen(false)
  }
  useEffect(() => {
    if (isMounted && !isOpen) {
      const timer = setTimeout(() => setIsMounted(false), EXIT_MS)
      return () => clearTimeout(timer)
    }
  }, [isOpen, isMounted])

  // Fallback: fecha se pathname mudar por outra razão (ex: router.push fora do menu)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(false))
    return () => cancelAnimationFrame(raf)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

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

          {/* Hambúrguer mobile */}
          <button
            className="text-foreground flex items-center justify-center rounded-md p-2 transition-colors hover:bg-white/5 sm:hidden"
            onClick={() => (isOpen ? handleClose() : handleOpen())}
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
          >
            <Menu
              className={cn(
                'size-5 transition-all duration-200',
                isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100',
              )}
            />
            <X
              className={cn(
                'absolute size-5 transition-all duration-200',
                isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0',
              )}
            />
          </button>
        </div>
      </header>

      {isMounted && (
        <>
          {/* Overlay escuro */}
          <div
            style={{
              transitionDuration: isOpen ? `${ENTER_MS}ms` : `${EXIT_MS}ms`,
              transitionTimingFunction: isOpen
                ? 'cubic-bezier(0, 0, 0.2, 1)'
                : 'cubic-bezier(0.4, 0, 1, 1)',
            }}
            className={cn(
              'fixed inset-0 top-14 z-40 bg-black/60 backdrop-blur-sm transition-opacity sm:hidden',
              isOpen ? 'opacity-100' : 'opacity-0',
            )}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Painel deslizante — style inline evita dependência de CSS variables
              do Tailwind v4 para transform/opacity */}
          <div
            style={{
              transitionProperty: 'transform, opacity',
              transitionDuration: isOpen ? `${ENTER_MS}ms` : `${EXIT_MS}ms`,
              transitionTimingFunction: isOpen
                ? 'cubic-bezier(0, 0, 0.2, 1)'
                : 'cubic-bezier(0.4, 0, 1, 1)',
              transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
              opacity: isOpen ? 1 : 0,
              willChange: 'transform, opacity',
            }}
            className="border-border/40 bg-background fixed inset-x-0 top-14 z-50 border-b shadow-2xl sm:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-0.5 px-4 py-3">
              <MobileLink
                href="/cars"
                active={isActive('/cars')}
                onClose={handleClose}
              >
                Veículos
              </MobileLink>
              {authenticated ? (
                <>
                  <MobileLink
                    href="/my-account"
                    active={isActive('/my-account')}
                    onClose={handleClose}
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
                  <MobileLink
                    href="/login"
                    active={isActive('/login')}
                    onClose={handleClose}
                  >
                    Entrar
                  </MobileLink>
                  <div className="pt-1">
                    <Button size="sm" asChild className="w-full">
                      <Link href="/register" onClick={handleClose}>
                        Cadastrar
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>
        </>
      )}
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
        <span className="absolute right-2.5 bottom-0.5 left-2.5 h-px rounded-full bg-amber-400" />
      )}
    </div>
  )
}

function MobileLink({
  href,
  active,
  children,
  onClose,
}: {
  href: string
  active: boolean
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
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
