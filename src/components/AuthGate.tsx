import { useEffect, useState, type ReactNode } from 'react'
import { isAuthenticated, loginWithPin } from '../lib/auth'
import { hydrateStore } from '../lib/store'
import { Btn } from './ui'

export function AuthGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setAuthed(isAuthenticated())
    hydrateStore().finally(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <div className="body-bg flex min-h-screen items-center justify-center font-body text-ink">
        <div className="text-sm text-ink-dim">Memuat Meridian…</div>
      </div>
    )
  }

  if (!authed) {
    const digits = pin.padEnd(5, '·').slice(0, 5).split('')

    const press = (d: string) => {
      setError('')
      if (pin.length >= 5) return
      const next = pin + d
      setPin(next)
      if (next.length === 5) {
        if (loginWithPin(next)) {
          setAuthed(true)
        } else {
          setError('PIN salah')
          setPin('')
        }
      }
    }

    const back = () => {
      setError('')
      setPin((p) => p.slice(0, -1))
    }

    return (
      <div className="body-bg flex min-h-screen flex-col items-center justify-center px-6 font-body font-book text-ink">
        {/* <div className="mb-8 flex items-center gap-2.5 font-display text-xl font-bold">
          <span className="h-2.5 w-2.5 animate-pulse-soft rounded-sm bg-amber shadow-[0_0_8px_rgba(255,138,76,0.7)]" />
          MERIDIAN<span className="font-medium text-ink-faint"></span>
        </div> */}
        <p className="mb-6 text-sm text-ink-dim">Masukkan PIN</p>
        <div className="mb-8 flex gap-3">
          {digits.map((ch, i) => (
            <span
              key={i}
              className={`flex h-12 w-10 items-center justify-center rounded-sm font-mono text-xl ${
                ch === '·'
                  ? 'glass text-ink-faint'
                  : 'bg-[rgba(255,138,76,0.15)] text-amber'
              }`}
            >
              {ch === '·' ? '·' : '•'}
            </span>
          ))}
        </div>
        {error && (
          <p className="mb-4 text-sm text-red-300">{error}</p>
        )}
        <div className="grid w-full max-w-[280px] grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(
            (k, i) =>
              k === '' ? (
                <span key={i} />
              ) : (
                <button
                  key={k}
                  type="button"
                  onClick={() => (k === '⌫' ? back() : press(k))}
                  className="glass shadow-soft inner-edge flex h-14 items-center justify-center rounded-md font-display text-lg font-semibold active:scale-95"
                >
                  {k}
                </button>
              ),
          )}
        </div>
        {/* <Btn
          variant="ghost"
          className="mt-4 text-xs"
          onClick={() => {
            if (loginWithPin('00000')) setAuthed(true)
          }}
        >
          Isi otomatis (dev)
        </Btn> */}
      </div>
    )
  }

  return <>{children}</>
}
