const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const idrCompact = new Intl.NumberFormat('id-ID', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatRp(amount: number) {
  return idr.format(amount)
}

export function formatRpShort(amount: number) {
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp${idrCompact.format(amount)}`
  }
  return formatRp(amount)
}

export function parseAmountInput(raw: string): number {
  const cleaned = raw.replace(/[^\d]/g, '')
  if (!cleaned) return 0
  return Number(cleaned)
}

export function daysUntil(isoDate: string) {
  const target = new Date(isoDate + 'T23:59:59')
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function formatDateId(isoDate: string) {
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 19) return 'Selamat sore'
  return 'Selamat malam'
}
