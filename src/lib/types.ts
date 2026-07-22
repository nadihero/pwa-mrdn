export type Allocation = {
  id: string
  label: string
  amount: number
  note?: string
  created_at: string
}

export type Subscription = {
  id: string
  name: string
  amount: number
  cycle: 'monthly' | 'yearly'
  start_date: string
  active: boolean
  created_at: string
}

export type Debt = {
  id: string
  name: string
  amount: number
  deadline: string
  paid: boolean
  note?: string
  created_at: string
}

export type FinanceData = {
  allocations: Allocation[]
  subscriptions: Subscription[]
  debts: Debt[]
}

export type PeriodKey = 'week' | 'month' | 'six_months'
