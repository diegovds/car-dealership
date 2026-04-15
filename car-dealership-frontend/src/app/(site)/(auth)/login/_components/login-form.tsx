'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { loginAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/ui/form-error'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { loginSchema, type LoginFormValues } from '@/lib/schemas'

export function LoginForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(values: LoginFormValues) {
    startTransition(async () => {
      const result = await loginAction(values)
      if (result?.error) {
        form.setError('root', { message: result.error })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-5"
      >
        <FormError message={form.formState.errors.root?.message} />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="mt-1 h-10 bg-amber-400 font-semibold text-black transition-all duration-200 hover:bg-amber-300 hover:shadow-[0_0_16px_rgba(251,191,36,0.3)] active:scale-95"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Entrando</span>
            </>
          ) : (
            'Entrar'
          )}
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          Não tem conta?{' '}
          <Link
            href="/register"
            className="text-amber-400 underline-offset-4 hover:text-amber-300 hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </Form>
  )
}
