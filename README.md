# Meridian

Aplikasi **pencatatan keuangan** mobile-first: alokasi dana, subscription, utang, dan notifikasi deadline.

Built with **TanStack Start** (React), **Tailwind CSS v4**, and optional **Supabase**.  
UI shell follows the static reference `index-cdn.html` (dark glass ops theme).

---

## Features

| Feature | Behavior |
|---------|----------|
| **PIN lock** | Single PIN `00000` stored in `sessionStorage` for the browser session |
| **Dashboard** | Greeting, KPI chips, allocation bars, period switcher (7 days / month / 6 months), nearest debts |
| **Alokasi** | Label money buckets (e.g. Kost, Bensin) — not line-item transactions |
| **Subscription** | Monthly or yearly; cycle anchored on `start_date`; active toggle; monthly/yearly estimates |
| **Utang** | Name + amount + deadline; mark paid; overdue / soon badges |
| **Alerts** | Open debts with deadline within 7 days or already overdue |
| **FAB `+`** | Quick-add modal: Alokasi · Subscription · Utang |
| **Profile** | Data mode (Local / Supabase), counts, reset demo seed, logout |
| **PWA-ready** | `manifest.webmanifest`, favicons, theme-color `#0e1013` |

### Data layer

- **Default:** `localStorage` key `meridian_finance_v1` + demo seed on first run
- **Optional:** Supabase tables when `VITE_SUPABASE_*` env vars are set (see below)
- Writes go to local cache always; Supabase insert/update/delete when configured

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter PIN **`00000`**.

```bash
npm run build    # production client + SSR build
npm run preview  # preview production build
```

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | [TanStack Start](https://tanstack.com/start) + React 19 |
| Routing | File routes (`src/routes/*`) via `@tanstack/react-router` |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | [Iconoir](https://iconoir.com/) (CSS CDN) |
| Fonts | **Manrope** (display) · **Inter** weight **450** (body) |
| DB | Supabase JS client (optional) / LocalStorage |
| Tooling | Vite 8, TypeScript, ESLint, Prettier |

---

## Routes & navigation

| Path | Screen | Nav |
|------|--------|-----|
| `/` | Dashboard | Home |
| `/alokasi` | Allocation list | Alokasi |
| `/subscription` | Subscriptions | Sub |
| `/utang` | Debts | Utang |
| `/alerts` | Deadline alerts | Alert |
| `/profile` | Settings / logout | Profil (rail + mobile avatar) |

**Responsive shell** (breakpoint `900px`):

- **Mobile:** bottom nav (5 items) · no topbar · FAB above nav · avatar → Profile  
- **Desktop:** sticky topbar · icon rail · hamburger drawer · FAB bottom-right  

---

## Project structure

```
.
├── FLOW.md                 # Product intent / feature map
├── index-cdn.html          # Static UI reference (design shell)
├── index.html              # Legacy static mock (Robodog prototype)
├── public/
│   ├── favicon.ico
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   └── manifest.webmanifest
├── supabase/
│   └── schema.sql          # allocations · subscriptions · debts + RLS
├── src/
│   ├── components/
│   │   ├── AppShell.tsx    # Layout, nav, FAB
│   │   ├── AuthGate.tsx    # PIN screen + store hydrate
│   │   ├── AddModal.tsx    # Quick-add forms
│   │   ├── nav-items.ts
│   │   └── ui.tsx          # Glass cards, chips, modal, inputs
│   ├── lib/
│   │   ├── auth.ts         # PIN session helpers
│   │   ├── store.ts        # Finance CRUD + aggregates
│   │   ├── use-finance.ts  # useSyncExternalStore hook
│   │   ├── supabase.ts     # Client when env present
│   │   ├── seed.ts         # Demo data
│   │   ├── format.ts       # IDR / dates / greeting
│   │   └── types.ts
│   ├── routes/
│   │   ├── __root.tsx      # Head, fonts, icons, AuthGate + shell
│   │   ├── index.tsx       # Dashboard
│   │   ├── alokasi.tsx
│   │   ├── subscription.tsx
│   │   ├── utang.tsx
│   │   ├── alerts.tsx
│   │   └── profile.tsx
│   ├── router.tsx
│   ├── routeTree.gen.ts    # Generated — do not edit by hand
│   └── styles.css          # Theme tokens + utilities
└── vite.config.ts
```

---

## Design tokens (from UI reference)

| Token | Value |
|-------|--------|
| Background | `#0e1013` |
| Accent amber | `#ff8a4c` |
| Accent teal | `#4fdcc0` |
| Text | `#f5f1ea` / dim `#a7b0b8` / faint `#6b747c` |
| Display font | Manrope |
| Body font | Inter `450` |
| Icons | Iconoir |

Defined in `src/styles.css` (`@theme`) and used as Tailwind utilities (`bg-amber`, `text-ink-dim`, `font-display`, `glass`, …).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server on port **3000** |
| `npm run build` | Production build (`dist/client` + `dist/server`) |
| `npm run preview` | Serve production build |
| `npm run generate-routes` | Regenerate `routeTree.gen.ts` after adding routes |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write + ESLint fix |
| `npm run check` | Prettier check only |

---

## Supabase (optional)

Without env vars the app is fully usable offline via LocalStorage.

1. Create a Supabase project  
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL Editor  
3. Copy env template and fill keys:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Tables

- `allocations` — `id`, `label`, `amount`, `note`, `created_at`  
- `subscriptions` — `id`, `name`, `amount`, `cycle` (`monthly` \| `yearly`), `start_date`, `active`, `created_at`  
- `debts` — `id`, `name`, `amount`, `deadline`, `paid`, `note`, `created_at`  

Current policies allow anon read/write (single-PIN, single-user demo). Tighten RLS before multi-user production.

---

## Auth notes

- PIN is **client-side only** (`00000` hardcoded in `src/lib/auth.ts`) — fine for a personal local/demo vault, **not** real security  
- Logout clears the session flag and reloads the app  
- Profile → **Reset data demo** restores seed from `src/lib/seed.ts`

---

## License

Private project (`meridian`).
# pwa-mrdn
