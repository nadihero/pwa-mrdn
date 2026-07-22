import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Chip,
  GlassCard,
  MonoLabel,
  Pill,
  SectionHeader,
} from '../components/ui'
import {
  daysUntil,
  formatDateId,
  formatRp,
  formatRpShort,
  greeting,
} from '../lib/format'
import {
  allocationsByLabel,
  deadlineAlerts,
  monthlySubscriptionCost,
  openDebts,
  sumAllocationsInPeriod,
} from '../lib/store'
import type { PeriodKey } from '../lib/types'
import { useFinance } from '../lib/use-finance'

export const Route = createFileRoute('/')({ component: Dashboard })

const periods: { key: PeriodKey; label: string }[] = [
  { key: 'week', label: '7 hari' },
  { key: 'month', label: 'Bulan' },
  { key: 'six_months', label: '6 bln' },
]

function Dashboard() {
  const data = useFinance()
  const [period, setPeriod] = useState<PeriodKey>('month')
  const total = sumAllocationsInPeriod(data.allocations, period)
  const byLabel = allocationsByLabel(data.allocations, period)
  const maxLabel = byLabel[0]?.amount || 1
  const subMonthly = monthlySubscriptionCost(data.subscriptions)
  const debts = openDebts(data.debts)
  const alerts = deadlineAlerts(data.debts, 7)
  const debtTotal = debts.reduce((s, d) => s + d.amount, 0)

  return (
    <>
      <div>
        <MonoLabel>Meridian · Keuangan</MonoLabel>
        <h1 className="mt-1.5 font-display text-[clamp(22px,3vw,30px)] font-bold">
          {greeting()}, <span className="text-amber">Asdar</span>
        </h1>
      </div>

      <div className="mt-[26px] grid grid-cols-1 gap-[22px] min-[900px]:grid-cols-[1.3fr_1fr]">
        <GlassCard>
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <MonoLabel>Monitoring alokasi</MonoLabel>
            <div className="flex gap-1 rounded-full bg-white/[0.04] p-1">
              {periods.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPeriod(p.key)}
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold ${
                    period === p.key
                      ? 'bg-[rgba(255,138,76,0.18)] text-amber'
                      : 'text-ink-faint'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-display text-3xl font-bold tracking-tight">
              {formatRp(total)}
            </div>
            <p className="mt-1 text-sm text-ink-dim">
              Total alokasi periode ini · {byLabel.length} label
            </p>
          </div>

          <div className="space-y-3">
            {byLabel.length === 0 && (
              <p className="text-sm text-ink-faint">
                Belum ada alokasi di periode ini.
              </p>
            )}
            {byLabel.slice(0, 6).map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{row.label}</span>
                  <span className="font-mono text-ink-dim">
                    {formatRpShort(row.amount)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber to-teal"
                    style={{
                      width: `${Math.max(6, (row.amount / maxLabel) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Chip
              value={formatRpShort(total)}
              label="Alokasi periode"
              tone="amber"
            />
            <Chip
              value={formatRpShort(subMonthly)}
              label="Sub / bulan"
              tone="teal"
            />
            <Chip
              value={formatRpShort(debtTotal)}
              label="Utang terbuka"
            />
            <Chip
              value={String(alerts.length)}
              label="Deadline dekat"
              tone="amber"
            />
          </div>

          {alerts[0] ? (
            <div className="flex items-start gap-3 rounded-md bg-gradient-to-br from-[rgba(255,138,76,0.09)] to-[rgba(255,138,76,0.02)] p-4 shadow-soft [box-shadow:0_10px_24px_-16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[11px] bg-[rgba(255,138,76,0.14)] text-amber">
                <i className="iconoir-warning-triangle text-base" aria-hidden />
              </div>
              <div className="min-w-0">
                <h3 className="mb-1 font-display text-sm font-semibold">
                  {alerts[0].name} · deadline {formatDateId(alerts[0].deadline)}
                </h3>
                <p className="text-[13px] leading-snug text-ink-dim">
                  {formatRp(alerts[0].amount)} ·{' '}
                  {daysUntil(alerts[0].deadline) < 0
                    ? `terlambat ${Math.abs(daysUntil(alerts[0].deadline))} hari`
                    : daysUntil(alerts[0].deadline) === 0
                      ? 'hari ini'
                      : `${daysUntil(alerts[0].deadline)} hari lagi`}
                </p>
              </div>
            </div>
          ) : (
            <div className="glass shadow-soft inner-edge flex items-start gap-3 rounded-md p-4">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[11px] bg-[rgba(79,220,192,0.12)] text-teal">
                <i className="iconoir-check-circle text-base" aria-hidden />
              </div>
              <div>
                <h3 className="mb-1 font-display text-sm font-semibold">
                  Tidak ada deadline mendesak
                </h3>
                <p className="text-[13px] text-ink-dim">
                  Semua utang aman dalam 7 hari ke depan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <SectionHeader
        title="Utang terdekat"
        action={
          <Link
            to="/utang"
            className="font-mono text-[11px] tracking-[0.04em] text-amber"
          >
            Lihat semua
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 min-[900px]:grid-cols-3">
        {debts.slice(0, 4).map((d) => {
          const days = daysUntil(d.deadline)
          const tone =
            days < 0 ? 'danger' : days <= 3 ? 'amber' : ('teal' as const)
          return (
            <div
              key={d.id}
              className="glass shadow-soft inner-edge flex items-center gap-3 rounded-md px-4 py-3.5"
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  tone === 'danger'
                    ? 'bg-red-400'
                    : tone === 'amber'
                      ? 'bg-amber shadow-[0_0_5px_rgba(255,138,76,0.55)]'
                      : 'bg-teal shadow-[0_0_5px_rgba(79,220,192,0.55)]'
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-[13px] font-semibold">
                    {d.name}
                  </span>
                  <Pill tone={tone}>
                    {days < 0
                      ? 'OVERDUE'
                      : days === 0
                        ? 'HARI INI'
                        : `${days}H`}
                  </Pill>
                </div>
                <div className="flex justify-between text-xs text-ink-faint">
                  <span>{formatDateId(d.deadline)}</span>
                  <span className="font-mono text-ink-dim">
                    {formatRpShort(d.amount)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
        {debts.length === 0 && (
          <p className="text-sm text-ink-faint col-span-full">
            Tidak ada utang terbuka.
          </p>
        )}
      </div>
    </>
  )
}
