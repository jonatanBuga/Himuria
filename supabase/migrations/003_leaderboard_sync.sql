-- Update leaderboard sync to allow username fallback from email.
create or replace function public.sync_leaderboard_for_user(user_uuid uuid)
returns void as $$
declare
  confirmed_at timestamptz;
  display_name text;
  fallback_email text;
begin
  select email_confirmed_at into confirmed_at from auth.users where id = user_uuid;
  if confirmed_at is null then
    return;
  end if;

  select username, email into display_name, fallback_email from public.profiles where id = user_uuid;
  if display_name is null then
    display_name := split_part(coalesce(fallback_email, ''), '@', 1);
  end if;
  if display_name is null or display_name = '' then
    return;
  end if;

  insert into public.leaderboard_players (user_id, username)
  values (user_uuid, display_name)
  on conflict (user_id) do update
    set username = excluded.username,
        updated_at = now();
end;
$$ language plpgsql security definer set search_path = public, auth;

-- Also sync when profile username/email is updated.
create or replace function public.handle_profiles_leaderboard()
returns trigger as $$
begin
  perform public.sync_leaderboard_for_user(new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public, auth;

drop trigger if exists profiles_leaderboard_sync on public.profiles;
create trigger profiles_leaderboard_sync
after insert or update of username, email on public.profiles
for each row execute function public.handle_profiles_leaderboard();
