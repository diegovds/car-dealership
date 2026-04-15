import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AutoMercado — Compre e Venda Veículos',
  description:
    'Marketplace de veículos com busca inteligente por IA. Encontre o carro ideal para você.',
}

const BRANDS = [
  'FORD',
  'CHEVROLET',
  'VOLKSWAGEN',
  'TOYOTA',
  'HONDA',
  'HYUNDAI',
  'NISSAN',
  'BMW',
  'MERCEDES-BENZ',
  'FIAT',
  'RENAULT',
  'JEEP',
  'MITSUBISHI',
  'KIA',
  'PEUGEOT',
  'CITROËN',
  'AUDI',
  'LAND ROVER',
]

export default function LandingPage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Top label bar */}
      <div className="border-border/20 border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <p className="text-[10px] font-bold tracking-[0.4em] text-amber-400 uppercase">
            Marketplace de Veículos
          </p>
          <p className="text-muted-foreground/40 text-[10px] tracking-wider uppercase">
            Busca por IA
          </p>
        </div>
      </div>

      {/* Hero — bottom-weighted editorial layout */}
      <section className="container mx-auto flex flex-1 flex-col justify-center px-4 pt-6 pb-8 md:justify-end md:pt-10">
        {/* Monumental typography */}
        <div className="mb-8">
          <h1
            className="leading-[0.85] font-black tracking-tight uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4rem, 16vw, 13rem)',
            }}
          >
            <span className="text-foreground block">Encontre</span>
            <span className="block text-amber-400">Seu</span>
            <span className="text-foreground block">Próximo</span>
            <span className="text-foreground block">
              Carro<span className="text-amber-400">.</span>
            </span>
          </h1>
        </div>

        {/* Amber rule */}
        <div className="relative mb-8 h-px">
          <div className="absolute inset-0 bg-linear-to-r from-amber-400/70 via-amber-400/20 to-transparent" />
        </div>

        {/* Description + CTAs */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            Descreva em linguagem natural e nossa IA encontra o carro
            ideal&nbsp;— sem filtros, sem complicação.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 bg-amber-400 px-6 py-3 text-sm font-bold text-black transition-all duration-200 hover:bg-amber-300 hover:shadow-[0_0_24px_rgba(251,191,36,0.3)] active:scale-95"
            >
              Ver Catálogo →
            </Link>
            <Link
              href="/register"
              className="border-border/40 text-foreground inline-flex items-center gap-2 border px-6 py-3 text-sm font-medium transition-all duration-200 hover:border-amber-400/40 hover:text-amber-400"
            >
              Anunciar
            </Link>
          </div>
        </div>
      </section>

      {/* Brand marquee */}
      <div className="border-border/20 overflow-hidden border-t">
        <div className="animate-marquee flex gap-14 py-4 whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span
              key={i}
              className="text-muted-foreground/20 text-[11px] font-bold tracking-[0.35em] uppercase select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
