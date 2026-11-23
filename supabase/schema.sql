-- Mental Math Lab: per-user progress, one row per technique.
-- Applied to the Supabase project as two migrations (create_technique_progress, tighten_technique_progress_grants).

create table public.technique_progress (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  technique_id text not null check (char_length(technique_id) between 1 and 40),
  correct integer not null default 0 check (correct >= 0),
  wrong integer not null default 0 check (wrong >= 0),
  streak integer not null default 0 check (streak >= 0),
  best_streak integer not null default 0 check (best_streak >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, technique_id)
);

alter table public.technique_progress enable row level security;

revoke all on public.technique_progress from anon;
grant select, insert, update, delete on public.technique_progress to authenticated;
revoke truncate, references, trigger on public.technique_progress from authenticated;

create policy "own rows select" on public.technique_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "own rows insert" on public.technique_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own rows update" on public.technique_progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own rows delete" on public.technique_progress
  for delete to authenticated using ((select auth.uid()) = user_id);
