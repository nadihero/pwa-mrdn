import { createFileRoute } from '@tanstack/react-router'
import {
  EmptyState,
  MonoLabel,
  Pill,
  SectionHeader,
} from '../components/ui'
import { formatDateId, formatRp, formatRpShort } from '../lib/format'
import {
  monthlySubscriptionCost,
  removeSubscription,
  toggleSubscription,
} from '../lib/store'
import { useFinance } from '../lib/use-finance'

export const Route = createFileRoute('/subscription')({
  component: SubscriptionPage,
})

function SubscriptionPage() {
  const { subscriptions } = useFinance()
  const monthly = monthlySubscriptionCost(subscriptions)
  const yearlyEquiv = monthly * 12

  return (
    <>
      <div>
        <MonoLabel>Recurring cost</MonoLabel>
        <h1 className="mt-1.5 font-display text-[clamp(22px,3vw,28px)] font-bold">
          Subscription
        </h1>
        <p className="mt-1 max-w-lg text-sm text-ink-dim">
          Cycle bulanan/tahunan ditetapkan dari tanggal mulai pertama.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="glass shadow-soft inner-edge rounded-sm px-4 py-3.5">
          <div className="font-mono text-xl font-semibold text-teal">
            {formatRpShort(monthly)}
          </div>
          <div className="mt-1 text-xs text-ink-dim">Estimasi / bulan</div>
        </div>
        <div className="glass shadow-soft inner-edge rounded-sm px-4 py-3.5">
          <div className="font-mono text-xl font-semibold text-amber">
            {formatRpShort(yearlyEquiv)}
          </div>
          <div className="mt-1 text-xs text-ink-dim">Estimasi / tahun</div>
        </div>
      </div>

      <SectionHeader title={`${subscriptions.length} layanan`} />

      {subscriptions.length === 0 ? (
        <EmptyState
          icon={<i className="iconoir-refresh-double" aria-hidden />}
          title="Belum ada subscription"
          desc="Tambah layanan berulang lewat tombol +."
        />
      ) : (
        <div className="space-y-2">
          {subscriptions.map((s) => (
            <div
              key={s.id}
              className={`glass shadow-soft inner-edge flex items-center gap-3 rounded-md px-4 py-3.5 ${
                s.active ? '' : 'opacity-55'
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[rgba(79,220,192,0.12)] text-teal">
                <i className="iconoir-refresh-double text-lg" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-display text-sm font-semibold">
                    {s.name}
                  </span>
                  <span className="shrink-0 font-mono text-sm font-semibold">
                    {formatRp(s.amount)}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Pill tone={s.cycle === 'monthly' ? 'teal' : 'amber'}>
                    {s.cycle === 'monthly' ? 'BULANAN' : 'TAHUNAN'}
                  </Pill>
                  <Pill tone={s.active ? 'teal' : 'idle'}>
                    {s.active ? 'AKTIF' : 'OFF'}
                  </Pill>
                  <span className="text-xs text-ink-faint">
                    mulai {formatDateId(s.start_date)}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  className="text-ink-faint hover:text-amber"
                  title="Toggle aktif"
                  onClick={() => toggleSubscription(s.id)}
                >
                  <i
                    className={
                      s.active ? 'iconoir-pause' : 'iconoir-play'
                    }
                    aria-hidden
                  />
                </button>
                <button
                  type="button"
                  className="text-ink-faint hover:text-red-300"
                  onClick={() => removeSubscription(s.id)}
                >
                  <i className="iconoir-trash text-base" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
