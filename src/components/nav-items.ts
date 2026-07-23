/** Bottom nav (mobile) — alerts live in top-right next to profile. */
export const bottomNavItems = [
  { to: '/', label: 'Home', icon: 'iconoir-home-simple' },
  { to: '/alokasi', label: 'Alokasi', icon: 'iconoir-wallet' },
  { to: '/subscription', label: 'Sub', icon: 'iconoir-refresh-double' },
  { to: '/utang', label: 'Utang', icon: 'iconoir-hand-card' },
] as const

export const alertsItem = {
  to: '/alerts',
  label: 'Alert',
  icon: 'iconoir-bell',
} as const

export const profileItem = {
  to: '/profile',
  label: 'Profil',
  icon: 'iconoir-profile-circle',
} as const

/** Drawer + desktop rail */
export const navItems = [...bottomNavItems, alertsItem] as const
