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
    'Plataforma de veículos com busca por linguagem natural via IA — cadastre, navegue e encontre.',
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
    images: [
      {
        url: '/thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'AutoMercado',
      },
    ],
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
