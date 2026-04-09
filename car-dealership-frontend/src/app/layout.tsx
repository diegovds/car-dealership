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
  title: 'AutoMercado',
  description: 'Compre e venda carros com facilidade',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn('dark', 'antialiased', jetbrainsMono.variable, geist.variable)}
    >
      <body className="flex min-h-dvh flex-col bg-background font-mono text-foreground">
        {children}
      </body>
    </html>
  )
}
