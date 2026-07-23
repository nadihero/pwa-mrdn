import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from './supabase'

export type AuthStatus = 'loading' | 'anon' | 'authed'

export type AuthState = {
  status: AuthStatus
  user: User | null
  session: Session | null
}

type Listener = () => void

let state: AuthState = {
  status: 'loading',
  user: null,
  session: null,
}

const listeners = new Set<Listener>()
let started = false

function emit() {
  listeners.forEach((l) => l())
}

function setState(next: AuthState) {
  state = next
  emit()
}

export function subscribeAuth(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getAuthSnapshot(): AuthState {
  return state
}

export function getAuthServerSnapshot(): AuthState {
  return { status: 'loading', user: null, session: null }
}

export function getUserId(): string | null {
  return state.user?.id ?? null
}

export function getUserDisplayName(user: User | null = state.user): string {
  if (!user) return 'User'
  const meta = user.user_metadata ?? {}
  return (
    (meta.full_name as string | undefined) ||
    (meta.name as string | undefined) ||
    user.email?.split('@')[0] ||
    'User'
  )
}

export function getUserAvatar(user: User | null = state.user): string | null {
  if (!user) return null
  const meta = user.user_metadata ?? {}
  return (meta.avatar_url as string | undefined) || (meta.picture as string | undefined) || null
}

export function getUserInitials(user: User | null = state.user): string {
  const name = getUserDisplayName(user)
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || 'M'
}

/** Boot session listener once (client only). */
export async function initAuth() {
  if (typeof window === 'undefined') return
  if (started) return
  started = true

  if (!supabase || !isSupabaseConfigured) {
    setState({ status: 'anon', user: null, session: null })
    return
  }

  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.warn('auth.getSession', error)
    setState({ status: 'anon', user: null, session: null })
  } else if (data.session) {
    setState({
      status: 'authed',
      user: data.session.user,
      session: data.session,
    })
  } else {
    setState({ status: 'anon', user: null, session: null })
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      setState({ status: 'authed', user: session.user, session })
    } else {
      setState({ status: 'anon', user: null, session: null })
    }
  })
}

export async function signInWithGoogle() {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error(
      'Supabase belum dikonfigurasi. Set VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.',
    )
  }

  const redirectTo = `${window.location.origin}/`
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  })

  if (error) throw error
}

export async function signOut() {
  if (supabase) {
    const { error } = await supabase.auth.signOut()
    if (error) console.warn('signOut', error)
  }
  setState({ status: 'anon', user: null, session: null })
}

/** @deprecated PIN auth removed — kept name for call sites during migrate */
export async function logout() {
  await signOut()
}
