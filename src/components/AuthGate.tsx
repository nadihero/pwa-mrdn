import { useEffect, type ReactNode } from 'react'
import { initAuth } from '../lib/auth'
import { hydrateStore } from '../lib/store'
import { useAuth } from '../lib/use-auth'
import { LoginScreen } from './LoginScreen'

export function AuthGate({ children }: { children: ReactNode }) {
  const auth = useAuth()

  useEffect(() => {
    void initAuth()
  }, [])

  useEffect(() => {
    if (auth.status !== 'authed' || !auth.user) return
    void hydrateStore(auth.user.id)
  }, [auth.status, auth.user?.id])

  if (auth.status === 'loading') {
    return (
      <div className="body-bg flex min-h-dvh flex-col items-center justify-center gap-3 font-body text-ink">
        <span className="h-2.5 w-2.5 animate-pulse-soft rounded-sm bg-amber shadow-[0_0_10px_rgba(255,138,76,0.7)]" />
        <p className="text-sm text-ink-dim">Memuat Meridian…</p>
      </div>
    )
  }

  if (auth.status !== 'authed') {
    return <LoginScreen />
  }

  return <>{children}</>
}
