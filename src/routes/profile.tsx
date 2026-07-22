import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Btn, GlassCard, MonoLabel } from '../components/ui'
import { logout } from '../lib/auth'
import { isSupabaseConfigured } from '../lib/supabase'
import { resetToSeed } from '../lib/store'
import { useFinance } from '../lib/use-finance'

export const Route = createFileRoute('/profile')({ component: ProfilePage })

function ProfilePage() {
  const navigate = useNavigate()
  const data = useFinance()

  return (
    <>
      <div>
        <MonoLabel>Akun & pengaturan</MonoLabel>
        <h1 className="mt-1.5 font-display text-[clamp(22px,3vw,28px)] font-bold">
          Profil
        </h1>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-[#6fe6cf] to-[#34a893] font-display text-2xl font-bold text-[#08211c] shadow-soft">
          M
        </div>
        <div>
          <div className="font-display text-lg font-semibold">Meridian User</div>
          <div className="text-sm text-ink-dim">Auth PIN · single device</div>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <GlassCard className="!p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-dim">Mode data</span>
            <span className="font-mono font-semibold text-teal">
              {isSupabaseConfigured ? 'Supabase' : 'LocalStorage'}
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            {isSupabaseConfigured
              ? 'Terhubung ke Supabase. Pastikan schema sudah di-apply.'
              : 'Belum set VITE_SUPABASE_URL / ANON_KEY — data disimpan di browser. Lihat supabase/schema.sql.'}
          </p>
        </GlassCard>

        <GlassCard className="!p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="font-mono text-lg font-semibold text-amber">
                {data.allocations.length}
              </div>
              <div className="text-[11px] text-ink-faint">Alokasi</div>
            </div>
            <div>
              <div className="font-mono text-lg font-semibold text-teal">
                {data.subscriptions.length}
              </div>
              <div className="text-[11px] text-ink-faint">Sub</div>
            </div>
            <div>
              <div className="font-mono text-lg font-semibold">
                {data.debts.length}
              </div>
              <div className="text-[11px] text-ink-faint">Utang</div>
            </div>
          </div>
        </GlassCard>

        <Btn
          variant="ghost"
          className="w-full"
          onClick={() => {
            if (confirm('Reset data ke contoh seed?')) resetToSeed()
          }}
        >
          <i className="iconoir-refresh" aria-hidden />
          Reset data demo
        </Btn>

        <Btn
          variant="danger"
          className="w-full"
          onClick={() => {
            logout()
            navigate({ to: '/' })
            window.location.reload()
          }}
        >
          <i className="iconoir-log-out" aria-hidden />
          Keluar (lock PIN)
        </Btn>
      </div>
    </>
  )
}
