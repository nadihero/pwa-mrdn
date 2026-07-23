-- Meridian Finance — Supabase schema + Google Auth RLS
-- 1) Enable Google provider: Authentication → Providers → Google
-- 2) Add redirect URLs: http://localhost:3000/** and your Vercel domain/**
-- 3) Run this SQL in the Supabase SQL Editor
-- 4) Set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY in .env / Vercel

create table if not exists public.allocations (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  amount numeric not null check (amount >= 0),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  amount numeric not null check (amount >= 0),
  cycle text not null check (cycle in ('monthly', 'yearly')),
  start_date date not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.debts (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  amount numeric not null check (amount >= 0),
  deadline date not null,
  paid boolean not null default false,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists allocations_user_id_idx on public.allocations (user_id);
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists debts_user_id_idx on public.debts (user_id);

alter table public.allocations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.debts enable row level security;

-- Drop legacy open policies if present
drop policy if exists "anon all allocations" on public.allocations;
drop policy if exists "anon all subscriptions" on public.subscriptions;
drop policy if exists "anon all debts" on public.debts;
drop policy if exists "users own allocations" on public.allocations;
drop policy if exists "users own subscriptions" on public.subscriptions;
drop policy if exists "users own debts" on public.debts;

create policy "users own allocations" on public.allocations
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users own subscriptions" on public.subscriptions
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users own debts" on public.debts
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- If you already had tables without user_id, run (once):
-- alter table public.allocations add column if not exists user_id uuid references auth.users(id) on delete cascade;
-- alter table public.subscriptions add column if not exists user_id uuid references auth.users(id) on delete cascade;
-- alter table public.debts add column if not exists user_id uuid references auth.users(id) on delete cascade;
-- then backfill user_id for existing rows before enforcing NOT NULL.
