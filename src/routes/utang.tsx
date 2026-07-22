import { createFileRoute } from '@tanstack/react-router'
import {
  EmptyState,
  MonoLabel,
  Pill,
  SectionHeader,
} from '../components/ui'
import { daysUntil, formatDateId, formatRp } from '../lib/format'
import { removeDebt, toggleDebtPaid } from '../lib/store'
import { useFinance } from '../lib/use-finance'

export const Route = createFileRoute('/utang')({ component: UtangPage })

function UtangPage() {
  const { debts } = useFinance()
  const open = debts.filter((d) => !d.paid)
  const paid = debts.filter((d) => d.paid)

  return (
    <>
      <div>
        <MonoLabel>Debt tracker</MonoLabel>
        <h1 className="mt-1.5 font-display text-[clamp(22px,3vw,28px)] font-bold">
          Utang
        </h1>
        <p className="mt-1 max-w-lg text-sm text-ink-dim">
          Catat berdasarkan nama dan deadline — notifikasi muncul saat mendekati
          jatuh tempo.
        </p>
      </div>

      <SectionHeader title={`Terbuka · ${open.length}`} />

      {open.length === 0 ? (
        <EmptyState
          icon={<i className="iconoir-hand-card" aria-hidden />}
          title="Tidak ada utang terbuka"
          desc="Tambah utang baru lewat tombol +."
        />
      ) : (
        <div className="space-y-2">
          {open
            .slice()
            .sort((a, b) => a.deadline.localeCompare(b.deadline))
            .map((d) => {
              const days = daysUntil(d.deadline)
              const tone =
                days < 0
                  ? 'danger'
                  : days <= 3
                    ? 'amber'
                    : ('teal' as const)
              return (
                <div
                  key={d.id}
                  className="glass shadow-soft inner-edge flex items-center gap-3 rounded-md px-4 py-3.5"
                >
                  <button
                    type="button"
                    onClick={() => toggleDebtPaid(d.id)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white/[0.04] text-ink-dim hover:text-teal"
                    title="Tandai lunas"
                  >
                    <i className="iconoir-check-circle text-xl" aria-hidden />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-display text-sm font-semibold">
                        {d.name}
                      </span>
                      <span className="shrink-0 font-mono text-sm font-semibold text-amber">
                        {formatRp(d.amount)}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Pill tone={tone}>
                        {days < 0
                          ? `OVERDUE ${Math.abs(days)}H`
                          : days === 0
                            ? 'HARI INI'
                            : `${days} HARI`}
                      </Pill>
                      <span className="text-xs text-ink-faint">
                        {formatDateId(d.deadline)}
                      </span>
                      {d.note && (
                        <span className="truncate text-xs text-ink-faint">
                          · {d.note}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-ink-faint hover:text-red-300"
                    onClick={() => removeDebt(d.id)}
                  >
                    <i className="iconoir-trash text-base" aria-hidden />
                  </button>
                </div>
              )
            })}
        </div>
      )}

      {paid.length > 0 && (
        <>
          <SectionHeader title={`Lunas · ${paid.length}`} />
          <div className="space-y-2 opacity-70">
            {paid.map((d) => (
              <div
                key={d.id}
                className="glass shadow-soft inner-edge flex items-center gap-3 rounded-md px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => toggleDebtPaid(d.id)}
                  className="text-teal"
                  title="Buka kembali"
                >
                  <i className="iconoir-check-circle-solid text-xl" aria-hidden />
                </button>
                <div className="min-w-0 flex-1">
                  <span className="font-display text-sm font-semibold line-through">
                    {d.name}
                  </span>
                  <div className="text-xs text-ink-faint">
                    {formatRp(d.amount)}
                  </div>
                </div>
                <button
                  type="button"
                  className="text-ink-faint hover:text-red-300"
                  onClick={() => removeDebt(d.id)}
                >
                  <i className="iconoir-trash text-base" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
