import { cn } from '@/lib/utils'
import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

const barlowCondensed = Barlow_Condensed({
  weight: ['700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-display',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: {
    default: 'AutoMercado',
    template: '%s | AutoMercado',
  },
  description:
    'Marketplace de veículos com busca inteligente por IA. Compre e venda carros com facilidade.',
  keywords: [
    'carros',
    'veículos',
    'comprar carro',
    'vender carro',
    'marketplace automotivo',
  ],
  openGraph: {
    siteName: 'AutoMercado',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        'dark',
        'antialiased',
        jetbrainsMono.variable,
        geist.variable,
        barlowCondensed.variable,
      )}
    >
      <body className="bg-background text-foreground flex min-h-dvh flex-col font-mono">
        {children}
      </body>
    </html>
  )
}
