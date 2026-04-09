'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { postUsers, postUsersLogin } from '@/http/api'
import type { LoginFormValues, RegisterFormValues } from '@/lib/schemas'

export type AuthActionResult = { error: string } | null

type LoginResult = { token?: string; message?: string }
type RegisterResult = { id?: string; message?: string }

export async function loginAction(
  data: LoginFormValues,
): Promise<AuthActionResult> {
  const result = (await postUsersLogin(data)) as LoginResult

  if (!result.token) {
    return { error: result.message || 'Email ou senha inválidos' }
  }

  const cookieStore = await cookies()
  cookieStore.set('auth_token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  redirect('/my-account')
}

export async function registerAction(
  data: RegisterFormValues,
): Promise<AuthActionResult> {
  const result = (await postUsers(data)) as RegisterResult

  if (!result.id) {
    return { error: result.message || 'Erro ao criar conta' }
  }

  const loginResult = (await postUsersLogin({
    email: data.email,
    password: data.password,
  })) as LoginResult

  if (loginResult.token) {
    const cookieStore = await cookies()
    cookieStore.set('auth_token', loginResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
  }

  redirect('/my-account')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  redirect('/')
}
