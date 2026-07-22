import type { FinanceData } from './types'

function daysFromNow(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const seedData: FinanceData = {
  allocations: [
    {
      id: 'a1',
      label: 'Kost',
      amount: 1_000_000,
      created_at: daysAgo(2),
    },
    {
      id: 'a2',
      label: 'Bensin',
      amount: 900_000,
      created_at: daysAgo(1),
    },
    {
      id: 'a3',
      label: 'Makan',
      amount: 1_500_000,
      created_at: daysAgo(5),
    },
    {
      id: 'a4',
      label: 'Internet',
      amount: 350_000,
      created_at: daysAgo(12),
    },
  ],
  subscriptions: [
    {
      id: 's1',
      name: 'Spotify',
      amount: 54_990,
      cycle: 'monthly',
      start_date: daysFromNow(-20),
      active: true,
      created_at: daysAgo(20),
    },
    {
      id: 's2',
      name: 'ChatGPT Plus',
      amount: 320_000,
      cycle: 'monthly',
      start_date: daysFromNow(-10),
      active: true,
      created_at: daysAgo(10),
    },
    {
      id: 's3',
      name: 'Domain .id',
      amount: 250_000,
      cycle: 'yearly',
      start_date: daysFromNow(-100),
      active: true,
      created_at: daysAgo(100),
    },
  ],
  debts: [
    {
      id: 'd1',
      name: 'Bayar Rina',
      amount: 250_000,
      deadline: daysFromNow(3),
      paid: false,
      note: 'Pinjam buat bensin',
      created_at: daysAgo(7),
    },
    {
      id: 'd2',
      name: 'Cicilan HP',
      amount: 1_200_000,
      deadline: daysFromNow(14),
      paid: false,
      created_at: daysAgo(30),
    },
    {
      id: 'd3',
      name: 'Utang Budi',
      amount: 100_000,
      deadline: daysFromNow(-2),
      paid: false,
      note: 'Overdue',
      created_at: daysAgo(20),
    },
  ],
}
