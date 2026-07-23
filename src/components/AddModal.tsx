import { useState } from 'react'
import { parseAmountInput } from '../lib/format'
import {
  addAllocation,
  addDebt,
  addSubscription,
} from '../lib/store'
import { AmountInput, Btn, Field, Input, Modal, Select, TextArea } from './ui'

type Mode = 'pick' | 'alokasi' | 'subscription' | 'utang'

export function AddModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [mode, setMode] = useState<Mode>('pick')

  const close = () => {
    setMode('pick')
    onClose()
  }

  const title =
    mode === 'pick'
      ? 'Tambah'
      : mode === 'alokasi'
        ? 'Alokasi dana'
        : mode === 'subscription'
          ? 'Subscription'
          : 'Utang'

  return (
    <Modal open={open} onClose={close} title={title}>
      {mode === 'pick' && (
        <div className="grid gap-2">
          {(
            [
              ['alokasi', 'iconoir-wallet', 'Alokasi', 'Label pembagian uang'],
              [
                'subscription',
                'iconoir-refresh-double',
                'Subscription',
                'Biaya bulanan / tahunan',
              ],
              ['utang', 'iconoir-hand-card', 'Utang', 'Nama + deadline'],
            ] as const
          ).map(([key, icon, label, desc]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className="glass shadow-soft inner-edge flex items-center gap-3 rounded-md px-4 py-3.5 text-left hover:bg-white/[0.04]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[rgba(255,138,76,0.12)] text-amber">
                <i className={`${icon} text-xl`} aria-hidden />
              </span>
              <span>
                <span className="block font-display text-sm font-semibold">
                  {label}
                </span>
                <span className="text-xs text-ink-dim">{desc}</span>
              </span>
              <i
                className="iconoir-nav-arrow-right ml-auto text-ink-faint"
                aria-hidden
              />
            </button>
          ))}
        </div>
      )}

      {mode === 'alokasi' && (
        <AllocationForm
          onDone={close}
          onBack={() => setMode('pick')}
        />
      )}
      {mode === 'subscription' && (
        <SubscriptionForm
          onDone={close}
          onBack={() => setMode('pick')}
        />
      )}
      {mode === 'utang' && (
        <DebtForm onDone={close} onBack={() => setMode('pick')} />
      )}
    </Modal>
  )
}

function AllocationForm({
  onDone,
  onBack,
}: {
  onDone: () => void
  onBack: () => void
}) {
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  const [error, setError] = useState('')
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const n = parseAmountInput(amount)
    if (!label.trim() || n <= 0) return
    setBusy(true)
    setError('')
    try {
      await addAllocation({ label, amount: n, note })
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Label">
        <Input
          placeholder="Kost, Bensin, Makan..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          autoFocus
        />
      </Field>
      <Field label="Jumlah">
        <AmountInput
          value={amount}
          onChange={setAmount}
          placeholder="1.000.000"
          required
        />
      </Field>
      <Field label="Catatan (opsional)">
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Opsional"
        />
      </Field>
      {error && (
        <p className="text-[13px] text-red-300" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-2 pt-2">
        <Btn variant="ghost" onClick={onBack} className="flex-1">
          Kembali
        </Btn>
        <Btn type="submit" className="flex-1" disabled={busy}>
          Simpan
        </Btn>
      </div>
    </form>
  )
}

function SubscriptionForm({
  onDone,
  onBack,
}: {
  onDone: () => void
  onBack: () => void
}) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [start, setStart] = useState(
    () => new Date().toISOString().slice(0, 10),
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const n = parseAmountInput(amount)
    if (!name.trim() || n <= 0) return
    setBusy(true)
    setError('')
    try {
      await addSubscription({
        name,
        amount: n,
        cycle,
        start_date: start,
      })
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Nama">
        <Input
          placeholder="Spotify, Netflix..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
      </Field>
      <Field label="Jumlah">
        <AmountInput
          value={amount}
          onChange={setAmount}
          placeholder="54.990"
          required
        />
      </Field>
      <Field label="Siklus">
        <Select
          value={cycle}
          onChange={(e) =>
            setCycle(e.target.value as 'monthly' | 'yearly')
          }
        >
          <option value="monthly">Bulanan</option>
          <option value="yearly">Tahunan</option>
        </Select>
      </Field>
      <Field label="Tanggal mulai (patokan cycle)">
        <Input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
      </Field>
      {error && (
        <p className="text-[13px] text-red-300" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-2 pt-2">
        <Btn variant="ghost" onClick={onBack} className="flex-1">
          Kembali
        </Btn>
        <Btn type="submit" className="flex-1" disabled={busy}>
          Simpan
        </Btn>
      </div>
    </form>
  )
}

function DebtForm({
  onDone,
  onBack,
}: {
  onDone: () => void
  onBack: () => void
}) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [deadline, setDeadline] = useState(
    () => new Date().toISOString().slice(0, 10),
  )
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const n = parseAmountInput(amount)
    if (!name.trim() || n <= 0) return
    setBusy(true)
    setError('')
    try {
      await addDebt({ name, amount: n, deadline, note })
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Nama / ke siapa">
        <Input
          placeholder="Rina, Cicilan HP..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
      </Field>
      <Field label="Jumlah">
        <AmountInput
          value={amount}
          onChange={setAmount}
          placeholder="250.000"
          required
        />
      </Field>
      <Field label="Deadline">
        <Input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </Field>
      <Field label="Catatan (opsional)">
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Field>
      {error && (
        <p className="text-[13px] text-red-300" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-2 pt-2">
        <Btn variant="ghost" onClick={onBack} className="flex-1">
          Kembali
        </Btn>
        <Btn type="submit" className="flex-1" disabled={busy}>
          Simpan
        </Btn>
      </div>
    </form>
  )
}
