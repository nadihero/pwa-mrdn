import { Link, createFileRoute } from '@tanstack/react-router'
import {
  EmptyState,
  MonoLabel,
  Pill,
  SectionHeader,
} from '../components/ui'
import { daysUntil, formatDateId, formatRp } from '../lib/format'
import { deadlineAlerts, openDebts } from '../lib/store'
import { useFinance } from '../lib/use-finance'

export const Route = createFileRoute('/alerts')({ component: AlertsPage })

function AlertsPage() {
  const { debts } = useFinance()
  const urgent = deadlineAlerts(debts, 7)
  const later = openDebts(debts).filter(
    (d) => !urgent.some((u) => u.id === d.id),
  )

  return (
    <>
      <div>
        <MonoLabel>Notifikasi deadline</MonoLabel>
        <h1 className="mt-1.5 font-display text-[clamp(22px,3vw,28px)] font-bold">
          Alerts
        </h1>
        <p className="mt-1 max-w-lg text-sm text-ink-dim">
          Utang dengan deadline dalam 7 hari atau sudah lewat.
        </p>
      </div>

      <SectionHeader title={`Mendesak · ${urgent.length}`} />

      {urgent.length === 0 ? (
        <EmptyState
          icon={<i className="iconoir-bell" aria-hidden />}
          title="Tidak ada alert"
          desc="Semua deadline aman untuk minggu ini."
        />
      ) : (
        <div className="space-y-2">
          {urgent.map((d) => {
            const days = daysUntil(d.deadline)
            return (
              <Link
                key={d.id}
                to="/utang"
                className="flex items-start gap-3 rounded-md bg-gradient-to-br from-[rgba(255,138,76,0.09)] to-[rgba(255,138,76,0.02)] p-4 shadow-soft"
              >
                <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[11px] bg-[rgba(255,138,76,0.14)] text-amber">
                  <i
                    className="iconoir-warning-triangle text-base"
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="truncate font-display text-sm font-semibold">
                      {d.name}
                    </h3>
                    <Pill tone={days < 0 ? 'danger' : 'amber'}>
                      {days < 0
                        ? 'OVERDUE'
                        : days === 0
                          ? 'HARI INI'
                          : `${days}H`}
                    </Pill>
                  </div>
                  <p className="text-[13px] text-ink-dim">
                    {formatRp(d.amount)} · jatuh tempo{' '}
                    {formatDateId(d.deadline)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {later.length > 0 && (
        <>
          <SectionHeader title={`Nanti · ${later.length}`} />
          <div className="space-y-2">
            {later.map((d) => (
              <div
                key={d.id}
                className="glass shadow-soft inner-edge flex items-center justify-between rounded-md px-4 py-3"
              >
                <div>
                  <div className="font-display text-sm font-semibold">
                    {d.name}
                  </div>
                  <div className="text-xs text-ink-faint">
                    {formatDateId(d.deadline)} · {daysUntil(d.deadline)} hari
                  </div>
                </div>
                <span className="font-mono text-sm text-ink-dim">
                  {formatRp(d.amount)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
