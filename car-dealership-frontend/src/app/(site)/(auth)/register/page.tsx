import { RegisterForm } from './_components/register-form'

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col gap-1">
        <p className="text-xs tracking-[0.3em] text-amber-400 uppercase">Comece agora</p>
        <h1 className="text-2xl font-bold tracking-tight">Criar conta</h1>
      </div>
      <RegisterForm />
    </div>
  )
}
