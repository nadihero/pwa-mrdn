import { supabase, isSupabaseConfigured } from './supabase'
import { seedData } from './seed'
import type {
  Allocation,
  Debt,
  FinanceData,
  PeriodKey,
  Subscription,
} from './types'

const STORAGE_KEY = 'meridian_finance_v1'

type Listener = () => void

let cache: FinanceData | null = null
const listeners = new Set<Listener>()

function uid(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}

function emptyData(): FinanceData {
  return { allocations: [], subscriptions: [], debts: [] }
}

function loadLocal(): FinanceData {
  if (typeof window === 'undefined') return emptyData()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData))
      return structuredClone(seedData)
    }
    return JSON.parse(raw) as FinanceData
  } catch {
    return structuredClone(seedData)
  }
}

function saveLocal(data: FinanceData) {
  cache = data
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
  listeners.forEach((l) => l())
}

function getData(): FinanceData {
  if (!cache) cache = loadLocal()
  return cache
}

export function subscribeStore(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): FinanceData {
  return getData()
}

export function getServerSnapshot(): FinanceData {
  return emptyData()
}

async function pullFromSupabase(): Promise<FinanceData | null> {
  if (!supabase) return null
  const [a, s, d] = await Promise.all([
    supabase.from('allocations').select('*').order('created_at', { ascending: false }),
    supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
    supabase.from('debts').select('*').order('deadline', { ascending: true }),
  ])
  if (a.error || s.error || d.error) {
    console.warn('Supabase pull failed, using local', a.error || s.error || d.error)
    return null
  }
  return {
    allocations: (a.data ?? []) as Allocation[],
    subscriptions: (s.data ?? []) as Subscription[],
    debts: (d.data ?? []) as Debt[],
  }
}

export async function hydrateStore() {
  if (isSupabaseConfigured) {
    const remote = await pullFromSupabase()
    if (remote) {
      cache = remote
      listeners.forEach((l) => l())
      return
    }
  }
  cache = loadLocal()
  listeners.forEach((l) => l())
}

export async function addAllocation(input: {
  label: string
  amount: number
  note?: string
}) {
  const row: Allocation = {
    id: uid('a'),
    label: input.label.trim(),
    amount: input.amount,
    note: input.note?.trim() || undefined,
    created_at: new Date().toISOString(),
  }

  if (supabase) {
    const { error } = await supabase.from('allocations').insert(row)
    if (error) console.warn(error)
  }

  const data = getData()
  saveLocal({ ...data, allocations: [row, ...data.allocations] })
}

export async function removeAllocation(id: string) {
  if (supabase) await supabase.from('allocations').delete().eq('id', id)
  const data = getData()
  saveLocal({
    ...data,
    allocations: data.allocations.filter((x) => x.id !== id),
  })
}

export async function addSubscription(input: {
  name: string
  amount: number
  cycle: 'monthly' | 'yearly'
  start_date: string
}) {
  const row: Subscription = {
    id: uid('s'),
    name: input.name.trim(),
    amount: input.amount,
    cycle: input.cycle,
    start_date: input.start_date,
    active: true,
    created_at: new Date().toISOString(),
  }

  if (supabase) {
    const { error } = await supabase.from('subscriptions').insert(row)
    if (error) console.warn(error)
  }

  const data = getData()
  saveLocal({ ...data, subscriptions: [row, ...data.subscriptions] })
}

export async function toggleSubscription(id: string) {
  const data = getData()
  const next = data.subscriptions.map((s) =>
    s.id === id ? { ...s, active: !s.active } : s,
  )
  const updated = next.find((s) => s.id === id)
  if (supabase && updated) {
    await supabase
      .from('subscriptions')
      .update({ active: updated.active })
      .eq('id', id)
  }
  saveLocal({ ...data, subscriptions: next })
}

export async function removeSubscription(id: string) {
  if (supabase) await supabase.from('subscriptions').delete().eq('id', id)
  const data = getData()
  saveLocal({
    ...data,
    subscriptions: data.subscriptions.filter((x) => x.id !== id),
  })
}

export async function addDebt(input: {
  name: string
  amount: number
  deadline: string
  note?: string
}) {
  const row: Debt = {
    id: uid('d'),
    name: input.name.trim(),
    amount: input.amount,
    deadline: input.deadline,
    paid: false,
    note: input.note?.trim() || undefined,
    created_at: new Date().toISOString(),
  }

  if (supabase) {
    const { error } = await supabase.from('debts').insert(row)
    if (error) console.warn(error)
  }

  const data = getData()
  saveLocal({ ...data, debts: [row, ...data.debts] })
}

export async function toggleDebtPaid(id: string) {
  const data = getData()
  const next = data.debts.map((d) =>
    d.id === id ? { ...d, paid: !d.paid } : d,
  )
  const updated = next.find((d) => d.id === id)
  if (supabase && updated) {
    await supabase.from('debts').update({ paid: updated.paid }).eq('id', id)
  }
  saveLocal({ ...data, debts: next })
}

export async function removeDebt(id: string) {
  if (supabase) await supabase.from('debts').delete().eq('id', id)
  const data = getData()
  saveLocal({ ...data, debts: data.debts.filter((x) => x.id !== id) })
}

export function monthlySubscriptionCost(subs: Subscription[]) {
  return subs
    .filter((s) => s.active)
    .reduce(
      (sum, s) => sum + (s.cycle === 'yearly' ? s.amount / 12 : s.amount),
      0,
    )
}

export function periodStart(period: PeriodKey): Date {
  const now = new Date()
  if (period === 'week') {
    const d = new Date(now)
    d.setDate(d.getDate() - 7)
    return d
  }
  if (period === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }
  const d = new Date(now)
  d.setMonth(d.getMonth() - 6)
  return d
}

export function sumAllocationsInPeriod(
  allocations: Allocation[],
  period: PeriodKey,
) {
  const start = periodStart(period).getTime()
  return allocations
    .filter((a) => new Date(a.created_at).getTime() >= start)
    .reduce((sum, a) => sum + a.amount, 0)
}

export function allocationsByLabel(
  allocations: Allocation[],
  period: PeriodKey,
) {
  const start = periodStart(period).getTime()
  const map = new Map<string, number>()
  for (const a of allocations) {
    if (new Date(a.created_at).getTime() < start) continue
    map.set(a.label, (map.get(a.label) ?? 0) + a.amount)
  }
  return [...map.entries()]
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function openDebts(debts: Debt[]) {
  return debts
    .filter((d) => !d.paid)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
}

export function deadlineAlerts(debts: Debt[], withinDays = 7) {
  return openDebts(debts).filter((d) => {
    const days =
      (new Date(d.deadline + 'T23:59:59').getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
    return days <= withinDays
  })
}

export function resetToSeed() {
  saveLocal(structuredClone(seedData))
}
