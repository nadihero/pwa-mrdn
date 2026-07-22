export const navItems = [
  { to: '/', label: 'Home', icon: 'iconoir-home-simple' },
  { to: '/alokasi', label: 'Alokasi', icon: 'iconoir-wallet' },
  { to: '/subscription', label: 'Sub', icon: 'iconoir-refresh-double' },
  { to: '/utang', label: 'Utang', icon: 'iconoir-hand-card' },
  { to: '/alerts', label: 'Alert', icon: 'iconoir-bell' },
] as const

export const profileItem = {
  to: '/profile',
  label: 'Profil',
  icon: 'iconoir-profile-circle',
} as const
