import { getUserId } from './auth'
import { seedData } from './seed'
import { isSupabaseConfigured, supabase } from './supabase'
import type {
  Allocation,
  Debt,
  FinanceData,
  PeriodKey,
  Subscription,
} from './types'

const STORAGE_PREFIX = 'meridian_finance_v1'

type Listener = () => void

let cache: FinanceData | null = null
let cacheUserId: string | null = null
const listeners = new Set<Listener>()

function uid(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}:${userId}`
}

function emptyData(): FinanceData {
  return { allocations: [], subscriptions: [], debts: [] }
}

function loadLocal(userId: string): FinanceData {
  if (typeof window === 'undefined') return emptyData()
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) {
      const seeded = structuredClone(seedData)
      localStorage.setItem(storageKey(userId), JSON.stringify(seeded))
      return seeded
    }
    return JSON.parse(raw) as FinanceData
  } catch {
    return structuredClone(seedData)
  }
}

function saveLocal(userId: string, data: FinanceData) {
  cache = data
  cacheUserId = userId
  if (typeof window !== 'undefined') {
    localStorage.setItem(storageKey(userId), JSON.stringify(data))
  }
  listeners.forEach((l) => l())
}

function requireUserId(): string {
  const id = getUserId()
  if (!id) throw new Error('Belum login')
  return id
}

function getData(): FinanceData {
  const userId = getUserId()
  if (!userId) return emptyData()
  if (!cache || cacheUserId !== userId) {
    cache = loadLocal(userId)
    cacheUserId = userId
  }
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

async function pullFromSupabase(userId: string): Promise<FinanceData | null> {
  if (!supabase) return null
  const [a, s, d] = await Promise.all([
    supabase
      .from('allocations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('debts')
      .select('*')
      .eq('user_id', userId)
      .order('deadline', { ascending: true }),
  ])
  if (a.error || s.error || d.error) {
    console.warn(
      'Supabase pull failed, using local',
      a.error || s.error || d.error,
    )
    return null
  }
  return {
    allocations: (a.data ?? []) as Allocation[],
    subscriptions: (s.data ?? []) as Subscription[],
    debts: (d.data ?? []) as Debt[],
  }
}

export async function hydrateStore(userId?: string) {
  const uid = userId ?? getUserId()
  if (!uid) {
    cache = emptyData()
    cacheUserId = null
    listeners.forEach((l) => l())
    return
  }

  if (isSupabaseConfigured && supabase) {
    const remote = await pullFromSupabase(uid)
    if (remote) {
      // Prefer remote when available; keep a local mirror for offline read
      cache = remote
      cacheUserId = uid
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey(uid), JSON.stringify(remote))
      }
      listeners.forEach((l) => l())
      return
    }
  }

  cache = loadLocal(uid)
  cacheUserId = uid
  listeners.forEach((l) => l())
}

async function remoteInsert(table: string, row: Record<string, unknown>) {
  if (!supabase || !isSupabaseConfigured) return { ok: true as const }
  const { error } = await supabase.from(table).insert(row)
  if (error) {
    console.warn(`insert ${table}`, error)
    return { ok: false as const, error }
  }
  return { ok: true as const }
}

export async function addAllocation(input: {
  label: string
  amount: number
  note?: string
}) {
  const userId = requireUserId()
  const row: Allocation & { user_id: string } = {
    id: uid('a'),
    label: input.label.trim(),
    amount: input.amount,
    note: input.note?.trim() || undefined,
    created_at: new Date().toISOString(),
    user_id: userId,
  }

  const remote = await remoteInsert('allocations', row)
  if (isSupabaseConfigured && !remote.ok) {
    throw new Error(remote.error?.message || 'Gagal simpan alokasi ke server')
  }

  const data = getData()
  saveLocal(userId, { ...data, allocations: [row, ...data.allocations] })
}

export async function removeAllocation(id: string) {
  const userId = requireUserId()
  if (supabase && isSupabaseConfigured) {
    const { error } = await supabase
      .from('allocations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
  }
  const data = getData()
  saveLocal(userId, {
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
  const userId = requireUserId()
  const row: Subscription & { user_id: string } = {
    id: uid('s'),
    name: input.name.trim(),
    amount: input.amount,
    cycle: input.cycle,
    start_date: input.start_date,
    active: true,
    created_at: new Date().toISOString(),
    user_id: userId,
  }

  const remote = await remoteInsert('subscriptions', row)
  if (isSupabaseConfigured && !remote.ok) {
    throw new Error(
      remote.error?.message || 'Gagal simpan subscription ke server',
    )
  }

  const data = getData()
  saveLocal(userId, { ...data, subscriptions: [row, ...data.subscriptions] })
}

export async function toggleSubscription(id: string) {
  const userId = requireUserId()
  const data = getData()
  const next = data.subscriptions.map((s) =>
    s.id === id ? { ...s, active: !s.active } : s,
  )
  const updated = next.find((s) => s.id === id)
  if (supabase && isSupabaseConfigured && updated) {
    const { error } = await supabase
      .from('subscriptions')
      .update({ active: updated.active })
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
  }
  saveLocal(userId, { ...data, subscriptions: next })
}

export async function removeSubscription(id: string) {
  const userId = requireUserId()
  if (supabase && isSupabaseConfigured) {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
  }
  const data = getData()
  saveLocal(userId, {
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
  const userId = requireUserId()
  const row: Debt & { user_id: string } = {
    id: uid('d'),
    name: input.name.trim(),
    amount: input.amount,
    deadline: input.deadline,
    paid: false,
    note: input.note?.trim() || undefined,
    created_at: new Date().toISOString(),
    user_id: userId,
  }

  const remote = await remoteInsert('debts', row)
  if (isSupabaseConfigured && !remote.ok) {
    throw new Error(remote.error?.message || 'Gagal simpan utang ke server')
  }

  const data = getData()
  saveLocal(userId, { ...data, debts: [row, ...data.debts] })
}

export async function toggleDebtPaid(id: string) {
  const userId = requireUserId()
  const data = getData()
  const next = data.debts.map((d) =>
    d.id === id ? { ...d, paid: !d.paid } : d,
  )
  const updated = next.find((d) => d.id === id)
  if (supabase && isSupabaseConfigured && updated) {
    const { error } = await supabase
      .from('debts')
      .update({ paid: updated.paid })
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
  }
  saveLocal(userId, { ...data, debts: next })
}

export async function removeDebt(id: string) {
  const userId = requireUserId()
  if (supabase && isSupabaseConfigured) {
    const { error } = await supabase
      .from('debts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw new Error(error.message)
  }
  const data = getData()
  saveLocal(userId, { ...data, debts: data.debts.filter((x) => x.id !== id) })
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
  const userId = requireUserId()
  saveLocal(userId, structuredClone(seedData))
}
