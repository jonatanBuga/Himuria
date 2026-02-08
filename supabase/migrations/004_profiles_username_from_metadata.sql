-- Capture username from auth metadata on initial profile insert.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'username', null))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public, auth;
