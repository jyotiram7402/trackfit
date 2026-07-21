-- AERO Fitness database schema
-- Paste this whole file into the Supabase SQL Editor and click "Run".
-- (Supabase dashboard → your project → SQL Editor → New query)

-- ============================================================
-- Tables
-- ============================================================

-- One row per user, created during onboarding. id = the auth user's id.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  age integer check (age between 10 and 120),
  gender text check (gender in ('male', 'female', 'other')),
  height_cm numeric(5, 1) check (height_cm between 80 and 260),
  current_weight_kg numeric(5, 1) check (current_weight_kg between 20 and 400),
  target_weight_kg numeric(5, 1) check (target_weight_kg between 20 and 400),
  goal text check (goal in ('lose', 'gain', 'maintain')),
  fitness_level text check (fitness_level in ('beginner', 'intermediate', 'advanced')),
  custom_split jsonb,           -- user's Mon–Sat split; null = default
  avatar_url text,              -- public URL of uploaded profile photo
  created_at timestamptz not null default now()
);

-- One row per exercise per workout session.
create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  day_type text,                -- e.g. "Chest & Triceps"
  exercise_id text not null,    -- id from the static exercise catalog
  exercise_name text not null,
  muscle_group text,
  sets_done integer,
  reps_done integer,
  weight_used numeric(6, 2),    -- kg
  completed boolean not null default false,
  feeling text check (feeling in ('easy', 'right', 'hard')),
  created_at timestamptz not null default now()
);

create index if not exists workout_logs_user_date_idx
  on public.workout_logs (user_id, date);

-- Body-weight check-ins; at most one per user per day.
create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  weight_kg numeric(5, 1) not null check (weight_kg between 20 and 400),
  unique (user_id, date)
);

-- The generated week of exercises, frozen as JSON so the plan
-- doesn't shift mid-week; one per user per week.
create table if not exists public.weekly_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  week_start_date date not null,
  plan_json jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, week_start_date)
);

-- Which exercises the user has reviewed ("mark as learned").
create table if not exists public.learned_exercises (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id text not null,
  learned_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);

-- ============================================================
-- Row Level Security — each user can only touch their own rows
-- ============================================================

alter table public.profiles enable row level security;
alter table public.workout_logs enable row level security;
alter table public.weight_logs enable row level security;
alter table public.weekly_plans enable row level security;
alter table public.learned_exercises enable row level security;

-- profiles (row ownership via id)
create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles: delete own" on public.profiles
  for delete using (auth.uid() = id);

-- workout_logs (row ownership via user_id)
create policy "workout_logs: select own" on public.workout_logs
  for select using (auth.uid() = user_id);
create policy "workout_logs: insert own" on public.workout_logs
  for insert with check (auth.uid() = user_id);
create policy "workout_logs: update own" on public.workout_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workout_logs: delete own" on public.workout_logs
  for delete using (auth.uid() = user_id);

-- weight_logs
create policy "weight_logs: select own" on public.weight_logs
  for select using (auth.uid() = user_id);
create policy "weight_logs: insert own" on public.weight_logs
  for insert with check (auth.uid() = user_id);
create policy "weight_logs: update own" on public.weight_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "weight_logs: delete own" on public.weight_logs
  for delete using (auth.uid() = user_id);

-- weekly_plans
create policy "weekly_plans: select own" on public.weekly_plans
  for select using (auth.uid() = user_id);
create policy "weekly_plans: insert own" on public.weekly_plans
  for insert with check (auth.uid() = user_id);
create policy "weekly_plans: update own" on public.weekly_plans
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "weekly_plans: delete own" on public.weekly_plans
  for delete using (auth.uid() = user_id);

-- learned_exercises
create policy "learned_exercises: select own" on public.learned_exercises
  for select using (auth.uid() = user_id);
create policy "learned_exercises: insert own" on public.learned_exercises
  for insert with check (auth.uid() = user_id);
create policy "learned_exercises: delete own" on public.learned_exercises
  for delete using (auth.uid() = user_id);

-- ============================================================
-- Storage: profile photos (bucket "avatars", public read)
-- Files are stored at "<user-id>/avatar.<ext>" so a user can only
-- write inside their own folder.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars: public read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "avatars: user upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars: user update" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars: user delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
