/** Destructive action confirm helper */
export function confirmDelete(itemLabel: string): boolean {
  if (typeof window === 'undefined') return false
  return window.confirm(
    `Hapus ${itemLabel}?\n\nTindakan ini tidak bisa dibatalkan.`,
  )
}
