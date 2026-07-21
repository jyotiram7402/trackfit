-- Migration C1: customizable weekly split + profile photo upload.
-- Only needed if you already ran schema.sql before these existed.
-- Paste into the Supabase SQL Editor and Run (safe to run twice).

-- 1) New profile columns
alter table public.profiles
  add column if not exists custom_split jsonb;
alter table public.profiles
  add column if not exists avatar_url text;

-- 2) Storage bucket for avatars (public read)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 3) Storage policies: anyone can read; a user can only write their own folder
drop policy if exists "avatars: public read" on storage.objects;
drop policy if exists "avatars: user upload" on storage.objects;
drop policy if exists "avatars: user update" on storage.objects;
drop policy if exists "avatars: user delete" on storage.objects;

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
