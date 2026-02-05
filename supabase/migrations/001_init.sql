-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  has_onboarded boolean default false
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Season picks draft
create table if not exists public.season_picks_draft (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  champion_team text not null,
  mvp_player text not null,
  updated_at timestamptz default now()
);

create trigger season_picks_draft_set_updated_at
before update on public.season_picks_draft
for each row execute function public.set_updated_at();

-- Season picks committed
create table if not exists public.season_picks_committed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles(id) on delete cascade,
  champion_team text not null,
  mvp_player text not null,
  champion_locked boolean default false,
  mvp_locked boolean default false,
  committed_at timestamptz default now()
);

-- Series picks draft
create table if not exists public.series_picks_draft (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  series_id text not null,
  team_a text not null,
  team_b text not null,
  team_a_wins int not null,
  team_b_wins int not null,
  updated_at timestamptz default now(),
  constraint series_picks_draft_unique unique (user_id, series_id),
  constraint series_picks_draft_wins check (
    team_a_wins between 0 and 4
    and team_b_wins between 0 and 4
    and ((team_a_wins = 4 and team_b_wins <= 3) or (team_b_wins = 4 and team_a_wins <= 3))
  )
);

create trigger series_picks_draft_set_updated_at
before update on public.series_picks_draft
for each row execute function public.set_updated_at();

-- Series picks committed
create table if not exists public.series_picks_committed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  series_id text not null,
  team_a text not null,
  team_b text not null,
  team_a_wins int not null,
  team_b_wins int not null,
  locked boolean default true,
  committed_at timestamptz default now(),
  constraint series_picks_committed_unique unique (user_id, series_id),
  constraint series_picks_committed_wins check (
    team_a_wins between 0 and 4
    and team_b_wins between 0 and 4
    and ((team_a_wins = 4 and team_b_wins <= 3) or (team_b_wins = 4 and team_a_wins <= 3))
  )
);

-- Series schedule table
create table if not exists public.series (
  series_id text primary key,
  conference text,
  team_a text,
  team_b text,
  start_time timestamptz not null,
  round text,
  status text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.season_picks_draft enable row level security;
alter table public.season_picks_committed enable row level security;
alter table public.series_picks_draft enable row level security;
alter table public.series_picks_committed enable row level security;
alter table public.series enable row level security;

-- Profiles policies
create policy "Profiles are readable by owner" on public.profiles
  for select using (auth.uid() = id);

create policy "Profiles are updatable by owner" on public.profiles
  for update using (auth.uid() = id);

-- Season draft policies
create policy "Season draft read" on public.season_picks_draft
  for select using (auth.uid() = user_id);

create policy "Season draft write" on public.season_picks_draft
  for insert with check (auth.uid() = user_id);

create policy "Season draft update" on public.season_picks_draft
  for update using (auth.uid() = user_id);

create policy "Season draft delete" on public.season_picks_draft
  for delete using (auth.uid() = user_id);

-- Season committed policies (read-only for user)
create policy "Season committed read" on public.season_picks_committed
  for select using (auth.uid() = user_id);

-- Series draft policies
create policy "Series draft read" on public.series_picks_draft
  for select using (auth.uid() = user_id);

create policy "Series draft write" on public.series_picks_draft
  for insert with check (auth.uid() = user_id);

create policy "Series draft update" on public.series_picks_draft
  for update using (auth.uid() = user_id);

create policy "Series draft delete" on public.series_picks_draft
  for delete using (auth.uid() = user_id);

-- Series committed policies (read-only for user)
create policy "Series committed read" on public.series_picks_committed
  for select using (auth.uid() = user_id);

-- Series schedule read policy
create policy "Series schedule read" on public.series
  for select using (auth.role() = 'authenticated');
