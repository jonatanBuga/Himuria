-- ============================================================
-- 005_seed_real_data.sql
-- Creates nba_teams table and seeds the 2026 NBA Playoffs data.
-- ============================================================

-- nba_teams: ensure table exists (may already exist with team_name + image_url).
-- Add extra columns if not present.
create table if not exists public.nba_teams (
  team_name text primary key,
  image_url text
);

alter table public.nba_teams add column if not exists full_name text;
alter table public.nba_teams add column if not exists conference text;
alter table public.nba_teams add column if not exists seed int;

alter table public.nba_teams enable row level security;

create policy if not exists "NBA teams are readable by authenticated users" on public.nba_teams
  for select using (auth.role() = 'authenticated');

-- Seed 2026 playoff teams
-- TBD rows represent play-in winners not yet determined
insert into public.nba_teams (team_name, full_name, conference, seed, image_url) values
  -- Eastern Conference
  ('Pistons',     'Detroit Pistons',          'EAST', 1, 'https://cdn.nba.com/logos/nba/1610612765/global/L/logo.svg'),
  ('Celtics',     'Boston Celtics',            'EAST', 2, 'https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg'),
  ('Knicks',      'New York Knicks',           'EAST', 3, 'https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg'),
  ('Cavaliers',   'Cleveland Cavaliers',       'EAST', 4, 'https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg'),
  ('Raptors',     'Toronto Raptors',           'EAST', 5, 'https://cdn.nba.com/logos/nba/1610612761/global/L/logo.svg'),
  ('Hawks',       'Atlanta Hawks',             'EAST', 6, 'https://cdn.nba.com/logos/nba/1610612737/global/L/logo.svg'),
  ('76ers',       'Philadelphia 76ers',        'EAST', 7, 'https://cdn.nba.com/logos/nba/1610612755/global/L/logo.svg'),
  -- Western Conference
  ('Thunder',     'Oklahoma City Thunder',     'WEST', 1, 'https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg'),
  ('Spurs',       'San Antonio Spurs',         'WEST', 2, 'https://cdn.nba.com/logos/nba/1610612759/global/L/logo.svg'),
  ('Nuggets',     'Denver Nuggets',            'WEST', 3, 'https://cdn.nba.com/logos/nba/1610612743/global/L/logo.svg'),
  ('Lakers',      'Los Angeles Lakers',        'WEST', 4, 'https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg'),
  ('Rockets',     'Houston Rockets',           'WEST', 5, 'https://cdn.nba.com/logos/nba/1610612745/global/L/logo.svg'),
  ('Timberwolves','Minnesota Timberwolves',    'WEST', 6, 'https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg'),
  ('Blazers',     'Portland Trail Blazers',    'WEST', 7, 'https://cdn.nba.com/logos/nba/1610612757/global/L/logo.svg')
on conflict (team_name) do update set
  full_name   = excluded.full_name,
  conference  = excluded.conference,
  seed        = excluded.seed,
  image_url   = excluded.image_url;

-- ============================================================
-- 2026 NBA Playoffs — First Round (Regional Quarterfinals)
-- All times are UTC. Start time = Game 1 tip-off.
-- TBD matchups await play-in results (East 8 and West 8 seeds).
-- ============================================================
insert into public.series (series_id, conference, team_a, team_b, start_time, round, status) values
  -- Eastern Conference
  ('east-r1-1v8', 'EAST', 'Pistons',    'TBD',          '2026-04-21 21:00:00+00', 'R1', 'UPCOMING'),
  ('east-r1-2v7', 'EAST', 'Celtics',    '76ers',         '2026-04-19 19:30:00+00', 'R1', 'UPCOMING'),
  ('east-r1-3v6', 'EAST', 'Knicks',     'Hawks',         '2026-04-20 17:00:00+00', 'R1', 'UPCOMING'),
  ('east-r1-4v5', 'EAST', 'Cavaliers',  'Raptors',       '2026-04-19 17:00:00+00', 'R1', 'UPCOMING'),
  -- Western Conference
  ('west-r1-1v8', 'WEST', 'Thunder',    'TBD',           '2026-04-21 23:30:00+00', 'R1', 'UPCOMING'),
  ('west-r1-2v7', 'WEST', 'Spurs',      'Blazers',       '2026-04-20 22:00:00+00', 'R1', 'UPCOMING'),
  ('west-r1-3v6', 'WEST', 'Nuggets',    'Timberwolves',  '2026-04-19 22:00:00+00', 'R1', 'UPCOMING'),
  ('west-r1-4v5', 'WEST', 'Lakers',     'Rockets',       '2026-04-20 19:30:00+00', 'R1', 'UPCOMING')
on conflict (series_id) do update set
  conference = excluded.conference,
  team_a     = excluded.team_a,
  team_b     = excluded.team_b,
  start_time = excluded.start_time,
  round      = excluded.round,
  status     = excluded.status;
