import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { UserAvatar } from '../components/UserAvatar'
import { Btn, GlassCard, MonoLabel } from '../components/ui'
import {
  getUserDisplayName,
  signOut,
} from '../lib/auth'
import { isSupabaseConfigured } from '../lib/supabase'
import { resetToSeed } from '../lib/store'
import { useAuth } from '../lib/use-auth'
import { useFinance } from '../lib/use-finance'

export const Route = createFileRoute('/profile')({ component: ProfilePage })

function ProfilePage() {
  const navigate = useNavigate()
  const data = useFinance()
  const { user } = useAuth()
  const name = getUserDisplayName(user)
  const email = user?.email ?? '—'

  return (
    <>
      <div>
        <MonoLabel>Akun & pengaturan</MonoLabel>
        <h1 className="mt-1.5 font-display text-[clamp(22px,3vw,28px)] font-bold">
          Profil
        </h1>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <UserAvatar size="lg" />
        <div className="min-w-0">
          <div className="truncate font-display text-lg font-semibold">
            {name}
          </div>
          <div className="truncate text-sm text-ink-dim">{email}</div>
          <div className="mt-1 font-mono text-[11px] text-ink-faint">
            Google · Supabase Auth
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <GlassCard className="!p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-dim">Mode data</span>
            <span className="font-mono font-semibold text-teal">
              {isSupabaseConfigured ? 'Supabase (per user)' : 'LocalStorage'}
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            {isSupabaseConfigured
              ? 'Data terikat ke user_id akun Google. RLS: hanya kamu yang bisa akses baris milikmu.'
              : 'Supabase belum di-set — data lokal per browser. Login Google butuh VITE_SUPABASE_*.'}
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
            if (
              confirm(
                'Reset data demo lokal untuk akun ini? Data di Supabase tidak dihapus otomatis.',
              )
            ) {
              resetToSeed()
            }
          }}
        >
          <i className="iconoir-refresh" aria-hidden />
          Reset data demo (lokal)
        </Btn>

        <Btn
          variant="danger"
          className="w-full"
          onClick={async () => {
            await signOut()
            navigate({ to: '/' })
          }}
        >
          <i className="iconoir-log-out" aria-hidden />
          Keluar
        </Btn>
      </div>
    </>
  )
}
