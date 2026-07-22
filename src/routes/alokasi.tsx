import { createFileRoute } from '@tanstack/react-router'
import { EmptyState, MonoLabel, SectionHeader } from '../components/ui'
import { formatDateId, formatRp } from '../lib/format'
import { removeAllocation } from '../lib/store'
import { useFinance } from '../lib/use-finance'

export const Route = createFileRoute('/alokasi')({ component: AlokasiPage })

function AlokasiPage() {
  const { allocations } = useFinance()

  return (
    <>
      <div>
        <MonoLabel>Pembagian dana</MonoLabel>
        <h1 className="mt-1.5 font-display text-[clamp(22px,3vw,28px)] font-bold">
          Alokasi
        </h1>
        <p className="mt-1 max-w-lg text-sm text-ink-dim">
          Bukan transaksi 1-per-1 — cukup melabeli potongan dana (kost, bensin,
          makan, …).
        </p>
      </div>

      <SectionHeader title={`${allocations.length} entri`} />

      {allocations.length === 0 ? (
        <EmptyState
          icon={<i className="iconoir-wallet" aria-hidden />}
          title="Belum ada alokasi"
          desc="Tap + untuk menambahkan label pembagian uang."
        />
      ) : (
        <div className="space-y-2">
          {allocations.map((a) => (
            <div
              key={a.id}
              className="glass shadow-soft inner-edge flex items-center gap-3 rounded-md px-4 py-3.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[rgba(255,138,76,0.12)] text-amber">
                <i className="iconoir-label text-lg" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-display text-sm font-semibold">
                    {a.label}
                  </span>
                  <span className="shrink-0 font-mono text-sm font-semibold text-amber">
                    {formatRp(a.amount)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-faint">
                  <span>
                    {formatDateId(a.created_at.slice(0, 10))}
                  </span>
                  {a.note && (
                    <>
                      <span>·</span>
                      <span className="truncate">{a.note}</span>
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="text-ink-faint hover:text-red-300"
                aria-label="Hapus"
                onClick={() => removeAllocation(a.id)}
              >
                <i className="iconoir-trash text-base" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
