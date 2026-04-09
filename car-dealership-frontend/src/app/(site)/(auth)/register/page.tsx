import type { Metadata } from 'next'
import { RegisterForm } from './_components/register-form'

export const metadata: Metadata = {
  title: 'Criar Conta',
  description:
    'Crie sua conta gratuitamente e comece a anunciar seus veículos no AutoMercado.',
}

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col gap-1">
        <p
          style={{ '--enter-delay': '0ms' } as React.CSSProperties}
          className="enter-hero text-xs tracking-[0.3em] text-amber-400 uppercase"
        >
          Comece agora
        </p>
        <h1
          style={{ '--enter-delay': '80ms' } as React.CSSProperties}
          className="enter-hero text-2xl font-bold tracking-tight"
        >
          Criar conta
        </h1>
      </div>
      <div
        style={{ '--enter-delay': '180ms' } as React.CSSProperties}
        className="enter-hero"
      >
        <RegisterForm />
      </div>
    </div>
  )
}
