-- Migration C3: per-set logging (each set its own weight × reps).
-- Only needed if you already ran schema.sql before this column existed.
-- Paste into the Supabase SQL Editor and Run (safe to run twice).

alter table public.workout_logs
  add column if not exists sets_detail jsonb;
