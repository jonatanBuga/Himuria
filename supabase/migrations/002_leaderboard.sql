-- Leaderboard players
create table if not exists public.leaderboard_players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  username text not null,
  correct integer not null default 0,
  exact integer not null default 0,
  wrong integer not null default 0,
  champion_team text null,
  total_points integer not null default 0,
  updated_at timestamptz default now()
);

create trigger leaderboard_players_set_updated_at
before update on public.leaderboard_players
for each row execute function public.set_updated_at();

-- Sync leaderboard row once email is confirmed.
create or replace function public.sync_leaderboard_for_user(user_uuid uuid)
returns void as $$
declare
  confirmed_at timestamptz;
  display_name text;
begin
  select email_confirmed_at into confirmed_at from auth.users where id = user_uuid;
  if confirmed_at is null then
    return;
  end if;

  select username into display_name from public.profiles where id = user_uuid;
  if display_name is null then
    return;
  end if;

  insert into public.leaderboard_players (user_id, username)
  values (user_uuid, display_name)
  on conflict (user_id) do update
    set username = excluded.username,
        updated_at = now();
end;
$$ language plpgsql security definer set search_path = public, auth;

create or replace function public.handle_profiles_leaderboard()
returns trigger as $$
begin
  perform public.sync_leaderboard_for_user(new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public, auth;

create trigger profiles_leaderboard_sync
after insert on public.profiles
for each row execute function public.handle_profiles_leaderboard();

create or replace function public.handle_auth_user_confirmed()
returns trigger as $$
begin
  if new.email_confirmed_at is not null and (old.email_confirmed_at is null or old.email_confirmed_at <> new.email_confirmed_at) then
    perform public.sync_leaderboard_for_user(new.id);
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public, auth;

create trigger on_auth_user_confirmed
after update of email_confirmed_at on auth.users
for each row execute function public.handle_auth_user_confirmed();

alter table public.leaderboard_players enable row level security;

create policy "Leaderboard readable by authenticated users" on public.leaderboard_players
  for select using (auth.role() = 'authenticated');
