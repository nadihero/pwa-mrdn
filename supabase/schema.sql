-- Meridian Finance — Supabase schema
-- Run in Supabase SQL editor after creating a project.
-- Then set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env

create table if not exists public.allocations (
  id text primary key,
  label text not null,
  amount numeric not null check (amount >= 0),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id text primary key,
  name text not null,
  amount numeric not null check (amount >= 0),
  cycle text not null check (cycle in ('monthly', 'yearly')),
  start_date date not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.debts (
  id text primary key,
  name text not null,
  amount numeric not null check (amount >= 0),
  deadline date not null,
  paid boolean not null default false,
  note text,
  created_at timestamptz not null default now()
);

-- Demo-friendly: open read/write for anon (single-PIN app, no multi-user yet).
-- Tighten RLS when you add real multi-user auth.
alter table public.allocations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.debts enable row level security;

create policy "anon all allocations" on public.allocations
  for all to anon using (true) with check (true);

create policy "anon all subscriptions" on public.subscriptions
  for all to anon using (true) with check (true);

create policy "anon all debts" on public.debts
  for all to anon using (true) with check (true);
