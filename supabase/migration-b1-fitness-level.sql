-- Migration B1: fitness level for beginner-adapted plans.
-- Only needed if you already ran schema.sql before this column existed.
-- Paste into the Supabase SQL Editor and Run (safe to run twice).

alter table public.profiles
  add column if not exists fitness_level text
  check (fitness_level in ('beginner', 'intermediate', 'advanced'));
