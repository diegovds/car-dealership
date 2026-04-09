import type { Metadata } from 'next'
import { LoginForm } from './_components/login-form'

export const metadata: Metadata = {
  title: 'Entrar',
  description:
    'Acesse sua conta no AutoMercado para gerenciar seus anúncios de veículos.',
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col gap-1">
        <p
          style={{ '--enter-delay': '0ms' } as React.CSSProperties}
          className="enter-hero text-xs tracking-[0.3em] text-amber-400 uppercase"
        >
          Bem-vindo de volta
        </p>
        <h1
          style={{ '--enter-delay': '80ms' } as React.CSSProperties}
          className="enter-hero text-2xl font-bold tracking-tight"
        >
          Entrar na sua conta
        </h1>
      </div>
      <div
        style={{ '--enter-delay': '180ms' } as React.CSSProperties}
        className="enter-hero"
      >
        <LoginForm />
      </div>
    </div>
  )
}
