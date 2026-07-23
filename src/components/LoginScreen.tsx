import { useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase'
import { signInWithGoogle } from '../lib/auth'

function GoogleMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export function LoginScreen() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const onGoogle = async () => {
    setError('')
    if (!isSupabaseConfigured) {
      setError(
        'Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY, lalu aktifkan Google provider di dashboard.',
      )
      return
    }
    setBusy(true)
    try {
      await signInWithGoogle()
      // redirect to Google — keep busy until unload
    } catch (e) {
      setBusy(false)
      setError(e instanceof Error ? e.message : 'Gagal memulai login Google')
    }
  }

  return (
    <div className="body-bg relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 font-body font-book text-ink">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-amber/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-20%] bottom-[-10%] h-72 w-72 rounded-full bg-teal/10 blur-3xl"
        aria-hidden
      />

      <div className="relative w-full max-w-[400px]">
        {/* brand */}
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight">
            <span className="h-2.5 w-2.5 animate-pulse-soft rounded-sm bg-amber shadow-[0_0_10px_rgba(255,138,76,0.75)]" />
            MERIDIAN
          </div>
          <h1 className="font-display text-[1.65rem] leading-tight font-bold sm:text-[1.85rem]">
            Kelola keuanganmu
            <br />
            <span className="text-amber">dengan tenang</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[28ch] text-sm leading-relaxed text-ink-dim">
            Alokasi, subscription, dan utang — sinkron aman lewat akun Google
            kamu.
          </p>
        </div>

        {/* card */}
        <div className="glass shadow-card inner-edge rounded-lg border border-white/5 p-6 sm:p-7">
          <p className="mb-5 text-center font-mono text-[11px] tracking-[0.1em] text-ink-faint uppercase">
            Satu ketukan untuk masuk
          </p>

          <button
            type="button"
            onClick={onGoogle}
            disabled={busy}
            className="group flex w-full items-center justify-center gap-3 rounded-sm bg-white px-4 py-3.5 text-[15px] font-semibold text-[#1f1f1f] shadow-[0_1px_2px_rgba(0,0,0,0.12),0_8px_24px_-12px_rgba(255,255,255,0.25)] transition hover:bg-[#f7f7f7] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
          >
            {busy ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#dadce0] border-t-[#4285F4]" />
                Menghubungkan…
              </>
            ) : (
              <>
                <GoogleMark className="h-5 w-5 shrink-0" />
                Lanjutkan dengan Google
              </>
            )}
          </button>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-sm border border-red-400/20 bg-red-500/10 px-3 py-2.5 text-left text-[13px] leading-snug text-red-200"
            >
              {error}
            </div>
          )}

          {!isSupabaseConfigured && (
            <p className="mt-4 text-center text-xs leading-relaxed text-ink-faint">
              Dev: set <code className="text-ink-dim">VITE_SUPABASE_*</code> dan
              aktifkan provider Google di Supabase Auth.
            </p>
          )}

          <div className="mt-6 flex items-center gap-3 text-ink-faint">
            <span className="h-px flex-1 bg-white/8" />
            <span className="font-mono text-[10px] tracking-wide uppercase">
              aman
            </span>
            <span className="h-px flex-1 bg-white/8" />
          </div>

          <ul className="mt-4 space-y-2 text-[12px] text-ink-dim">
            <li className="flex items-start gap-2">
              <i
                className="iconoir-check-circle mt-0.5 text-teal"
                aria-hidden
              />
              Tidak ada form email / password
            </li>
            <li className="flex items-start gap-2">
              <i
                className="iconoir-check-circle mt-0.5 text-teal"
                aria-hidden
              />
              OAuth Google lewat Supabase Auth
            </li>
            <li className="flex items-start gap-2">
              <i
                className="iconoir-check-circle mt-0.5 text-teal"
                aria-hidden
              />
              Data terikat ke akun kamu
            </li>
          </ul>
        </div>

        <p className="mt-6 text-center text-[11px] text-ink-faint">
          Dengan masuk, kamu menyetujui pemrosesan data keuangan di perangkat &
          backend yang kamu konfigurasi.
        </p>
      </div>
    </div>
  )
}
