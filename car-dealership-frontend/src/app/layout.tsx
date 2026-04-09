import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

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
      )}
    >
      <body className="bg-background text-foreground flex min-h-dvh flex-col font-mono">
        {children}
      </body>
    </html>
  )
}
