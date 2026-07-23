import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'
import { deadlineAlerts } from '../lib/store'
import { useFinance } from '../lib/use-finance'
import { bottomNavItems, navItems, profileItem } from './nav-items'
import { AddModal } from './AddModal'

function NavIcon({
  icon,
  active,
  className = '',
}: {
  icon: string
  active?: boolean
  className?: string
}) {
  return (
    <i
      className={`${icon} ${className} ${active ? '' : ''}`}
      aria-hidden
    />
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const data = useFinance()
  const alertCount = deadlineAlerts(data.debts, 7).length
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  const allNav = [...navItems, profileItem]

  return (
    <div className="body-bg min-h-screen font-body font-book text-ink antialiased">
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[48] bg-[rgba(5,6,7,0.6)] backdrop-blur-[2px] transition-opacity duration-[250ms] ${
          drawerOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer (desktop hamburger) */}
      <nav
        className={`fixed top-0 bottom-0 left-0 z-[49] flex w-[280px] flex-col gap-1 bg-[#12151a] p-[22px_18px] shadow-drawer transition-transform duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-[22px] flex items-center justify-between px-1.5">
          <Brand />
          <button
            type="button"
            className="glass flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-ink-dim"
            aria-label="Tutup menu"
            onClick={() => setDrawerOpen(false)}
          >
            <i className="iconoir-xmark text-base" aria-hidden />
          </button>
        </div>
        {allNav.map((item) => {
          const active = isActive(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setDrawerOpen(false)}
              className={`flex items-center gap-3.5 rounded-[14px] px-3.5 py-3 text-sm font-semibold ${
                active
                  ? 'bg-[rgba(255,138,76,0.1)] text-amber'
                  : 'text-ink-dim hover:bg-white/[0.03]'
              }`}
            >
              <NavIcon icon={item.icon} className="shrink-0 text-[19px]" />
              {item.label}
              {item.to === '/alerts' && alertCount > 0 && (
                <span className="ml-auto rounded-full bg-amber px-1.5 font-mono text-[10px] font-semibold text-[#181008]">
                  {alertCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Topbar — desktop only */}
      <header className="sticky top-0 z-40 hidden h-topbar items-center justify-between bg-[rgba(14,17,20,0.78)] px-3.5 shadow-[0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[20px] backdrop-saturate-[1.6] sm:px-5 min-[900px]:flex">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            className="glass shadow-soft inner-edge flex h-10 w-10 shrink-0 items-center justify-center rounded-sm"
            aria-label="Buka menu"
            onClick={() => setDrawerOpen(true)}
          >
            <i className="iconoir-menu text-lg" aria-hidden />
          </button>
          <Brand showOs />
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/alerts"
            className="glass shadow-soft inner-edge relative flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-ink-dim"
          >
            <i className="iconoir-bell text-[17px]" aria-hidden />
            {alertCount > 0 && (
              <span className="absolute -top-[3px] -right-[3px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-bg bg-amber font-mono text-[9px] font-semibold text-[#181008]">
                {alertCount}
              </span>
            )}
          </Link>
          <Link
            to="/profile"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gradient-to-br from-[#6fe6cf] to-[#34a893] font-display text-sm font-bold text-[#08211c] shadow-soft"
          >
            M
          </Link>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-0px)] min-[900px]:min-h-[calc(100vh-72px)]">
        {/* Rail — desktop */}
        <nav className="border-white/5 hidden w-rail shrink-0 flex-col items-center gap-1.5 border-r py-6 min-[900px]:flex">
          {allNav.map((item) => {
            const active = isActive(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-2xl ${
                  active
                    ? 'bg-[rgba(255,138,76,0.1)] text-amber'
                    : 'text-ink-faint hover:bg-white/[0.03]'
                }`}
              >
                <NavIcon icon={item.icon} className="text-xl" />
                <span className="text-[9px] font-semibold">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <main className="relative min-w-0 flex-1 px-3.5 pt-5 pb-[108px] sm:px-6 sm:pt-7 min-[900px]:pb-20">
          {/* Mobile: notifications + profile (top-right) */}
          <div className="absolute top-4 right-3.5 z-10 flex items-center gap-2 min-[900px]:hidden sm:right-6">
            <Link
              to="/alerts"
              className={`glass shadow-soft inner-edge relative flex h-9 w-9 items-center justify-center rounded-sm ${
                isActive('/alerts') ? 'text-amber' : 'text-ink-dim'
              }`}
              aria-label="Notifikasi"
            >
              <i className="iconoir-bell text-[21px]" aria-hidden />
              {alertCount > 0 && (
                <span className="absolute -top-[3px] -right-[3px] flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-bg bg-amber px-0.5 font-mono text-[9px] font-semibold text-[#181008]">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-sm bg-gradient-to-br from-[#6fe6cf] to-[#34a893] font-display text-xs font-bold text-[#08211c] shadow-soft"
              aria-label="Profil"
            >
              M
            </Link>
          </div>
          <div className="mx-auto max-w-[1120px]">{children}</div>
        </main>
      </div>

      {/* Bottom nav — mobile (no alerts; alerts are top-right) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-white/5 bg-[rgba(14,17,20,0.92)] px-1 pt-1.5 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur-[20px] backdrop-saturate-[1.6] min-[900px]:hidden"
        aria-label="Navigasi utama"
      >
        {bottomNavItems.map((item) => {
          const active = isActive(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 ${
                active ? 'text-amber' : 'text-ink-faint'
              }`}
            >
              <NavIcon icon={item.icon} className="text-2xl" />
              <span className="font-mono text-[9px] font-semibold tracking-wide">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* FAB — raised on mobile so it clears bottom nav */}
      <button
        type="button"
        onClick={() => setAddOpen(true)}
        className="shadow-fab fixed right-5 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] z-[25] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ffa168] to-amber text-[#1a0f07] min-[900px]:right-6 min-[900px]:bottom-7"
        aria-label="Tambah"
      >
        <i className="iconoir-plus text-[22px]" aria-hidden />
      </button>

      <AddModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}

function Brand({ showOs = false }: { showOs?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 font-display text-base font-bold">
      <span className="h-2 w-2 animate-pulse-soft rounded-sm bg-amber shadow-[0_0_8px_rgba(255,138,76,0.7)]" />
      MERIDIAN
      {showOs ? (
        <span className="font-medium text-ink-faint max-sm:hidden"></span>
      ) : (
        <span className="font-medium text-ink-faint"></span>
      )}
    </div>
  )
}
