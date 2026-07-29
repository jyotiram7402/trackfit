-- Migration C2: hand-picked exercises per day (Today "choose exercises").
-- Only needed if you already ran schema.sql before this table existed.
-- Paste into the Supabase SQL Editor and Run (safe to run twice).

create table if not exists public.day_selections (
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  exercise_ids jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

alter table public.day_selections enable row level security;

drop policy if exists "day_selections: select own" on public.day_selections;
drop policy if exists "day_selections: insert own" on public.day_selections;
drop policy if exists "day_selections: update own" on public.day_selections;
drop policy if exists "day_selections: delete own" on public.day_selections;

create policy "day_selections: select own" on public.day_selections
  for select using (auth.uid() = user_id);
create policy "day_selections: insert own" on public.day_selections
  for insert with check (auth.uid() = user_id);
create policy "day_selections: update own" on public.day_selections
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "day_selections: delete own" on public.day_selections
  for delete using (auth.uid() = user_id);
