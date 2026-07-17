-- Migration B2: "mark as learned" tracking for exercise detail pages.
-- Only needed if you already ran schema.sql before this table existed.
-- Paste into the Supabase SQL Editor and Run (safe to run twice).

create table if not exists public.learned_exercises (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id text not null,
  learned_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);

alter table public.learned_exercises enable row level security;

drop policy if exists "learned_exercises: select own" on public.learned_exercises;
drop policy if exists "learned_exercises: insert own" on public.learned_exercises;
drop policy if exists "learned_exercises: delete own" on public.learned_exercises;

create policy "learned_exercises: select own" on public.learned_exercises
  for select using (auth.uid() = user_id);
create policy "learned_exercises: insert own" on public.learned_exercises
  for insert with check (auth.uid() = user_id);
create policy "learned_exercises: delete own" on public.learned_exercises
  for delete using (auth.uid() = user_id);
