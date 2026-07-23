# Meridian

Aplikasi **pencatatan keuangan** mobile-first: alokasi dana, subscription, utang, dan notifikasi deadline.

Built with **TanStack Start** (React), **Tailwind CSS v4**, and optional **Supabase**.  
UI shell follows the static reference `index-cdn.html` (dark glass ops theme).

---

## Features

| Feature | Behavior |
|---------|----------|
| **Google login** | Single gate — “Lanjutkan dengan Google” (Supabase OAuth), no forms |
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

Open [http://localhost:3000](http://localhost:3000) → **Lanjutkan dengan Google**.

Requires Supabase env + Google provider (see below).

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

## Auth — Google only (Supabase)

Login screen has **one action**: Continue with Google. No email/password form.

### Setup

1. Create a [Supabase](https://supabase.com) project  
2. **Authentication → Providers → Google** — enable; paste Google Cloud OAuth Client ID + Secret  
3. **Authentication → URL Configuration** — add Redirect URLs:
   - `http://localhost:3000/**`
   - `https://YOUR_VERCEL_DOMAIN/**`
4. Run [`supabase/schema.sql`](./supabase/schema.sql) (tables + `user_id` + RLS)  
5. Env:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Also set the same vars in **Vercel → Environment Variables**, then redeploy.

### Tables (per user)

- `allocations` — + `user_id`  
- `subscriptions` — + `user_id`  
- `debts` — + `user_id`  

RLS: `authenticated` users only access rows where `auth.uid() = user_id`.

### Notes

- Session managed by Supabase JS (persisted in browser)  
- Logout = `supabase.auth.signOut()`  
- LocalStorage mirrors data per user id for offline read fallback  
- Profile → Reset demo only resets **local** seed for that user  

---

## Deploy ke Vercel (dari GitHub)

TanStack Start di Vercel memakai **Nitro** (`nitro` + plugin di `vite.config.ts`). Saat build di Vercel, env `VERCEL=1` otomatis mengaktifkan preset output `.vercel/output`.

### 1. Pastikan config sudah di repo

Sudah disiapkan di project ini:

- dependency `nitro`
- `vite.config.ts` → plugin `nitro()`
- `vercel.json` → `buildCommand` / `installCommand`
- script `npm run build`

Push perubahan ini ke GitHub dulu:

```bash
git add package.json package-lock.json vite.config.ts vercel.json README.md
git commit -m "chore: enable Nitro for Vercel deploy"
git push
```

### 2. Import project di Vercel

1. Buka [vercel.com/new](https://vercel.com/new)
2. **Import** repo GitHub Meridian
3. Framework Preset: biarkan **Other** / deteksi otomatis (jangan pilih Next.js)
4. Root Directory: `.` (root repo)
5. Build & Output (otomatis dari `vercel.json`):
   - **Install:** `npm install`
   - **Build:** `npm run build`
6. **Deploy**

Setelah sukses, URL-nya mirip `https://meridian-xxx.vercel.app`.

### 3. Environment variables (opsional)

Kalau pakai Supabase, di Vercel → Project → **Settings → Environment Variables**:

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon key |

Lalu **Redeploy**.

Tanpa env, app tetap jalan dengan **LocalStorage** di browser user.

### 4. Redeploy otomatis

Setiap `git push` ke branch production (biasanya `main`) → Vercel build ulang.

### CLI (opsional)

```bash
npm i -g vercel
vercel login
vercel          # preview
vercel --prod   # production
```

### Troubleshooting

| Masalah | Cek |
|---------|-----|
| Build gagal / 404 | Pastikan `nitro` terpasang & `nitro()` ada di `vite.config.ts` |
| Output kosong | Build harus menghasilkan `.vercel/output` (preset Vercel) |
| Env tidak kebaca | Nama harus `VITE_*`, lalu redeploy |
| PIN / data hilang | Data LocalStorage per-browser; Supabase untuk sinkron multi-device |

---

## License

Private project (`meridian`).
# pwa-mrdn
