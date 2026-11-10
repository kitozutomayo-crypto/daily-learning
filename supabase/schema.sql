-- Run in Supabase Dashboard > SQL Editor.
-- Enable email sign-in in Authentication > Providers > Email.
create table if not exists public.daily_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  study_date date not null,
  word_ids text[] not null,
  problem_id text not null,
  completed_word_ids text[] not null default '{}',
  problem_done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, study_date),
  constraint ten_words check (cardinality(word_ids) = 10)
);

alter table public.daily_sessions enable row level security;

drop policy if exists "Read own study days" on public.daily_sessions;
create policy "Read own study days" on public.daily_sessions
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Create own study days" on public.daily_sessions;
create policy "Create own study days" on public.daily_sessions
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Update own study days" on public.daily_sessions;
create policy "Update own study days" on public.daily_sessions
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
