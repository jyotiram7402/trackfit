-- Migration B3: per-exercise "How did that feel?" from Guided Mode.
-- Only needed if you already ran schema.sql before this column existed.
-- Paste into the Supabase SQL Editor and Run (safe to run twice).

alter table public.workout_logs
  add column if not exists feeling text
  check (feeling in ('easy', 'right', 'hard'));
