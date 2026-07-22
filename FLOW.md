# Meridian — product flow

Build a full-stack **TanStack Start** PWA app, **Mobile First**

- Auth: single PIN (`00000`)
- Database: **Supabase** (fallback LocalStorage if env not set)
- UI reference: **`index-cdn.html`** (shell, tokens, nav patterns)

## Stack

- TanStack Start (React) + file routes
- Tailwind CSS v4
- Iconoir
- Font: **Manrope** (display) × **Inter 450** (body)

## Fitur utama

- **Dashboard** — ringkasan + monitoring minggu / bulan / 6 bulan
- **Alokasi** — catat pembagian uang (label, bukan 1-per-1 transaksi)
- **Subscription** — biaya bulanan/tahunan (cycle dari first input / start_date)
- **Utang** — nama + deadline + status lunas
- **Notifikasi deadline** — alert ≤ 7 hari / overdue
- FAB `+` → quick add alokasi / sub / utang

## Nav mapping

| Nav | Route |
|-----|--------|
| Home | `/` |
| Alokasi | `/alokasi` |
| Sub | `/subscription` |
| Utang | `/utang` |
| Alert | `/alerts` |
| Profil | `/profile` |

## Responsive (from index-cdn)

- **&lt; 900px**: bottom nav only (no topbar / hamburger)
- **≥ 900px**: topbar + side rail (+ drawer via hamburger)
