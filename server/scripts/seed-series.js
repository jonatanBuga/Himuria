/**
 * seed-series.js
 * Inserts the 2026 NBA Playoffs first-round data into Supabase.
 * Run from the server/ directory: node scripts/seed-series.js
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server/.env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ── NBA Teams ────────────────────────────────────────────────────────────────
const NBA_TEAMS = [
  // Eastern Conference
  { team_name: 'Pistons',      conference: 'east', image_url: 'https://cdn.nba.com/logos/nba/1610612765/global/L/logo.svg' },
  { team_name: 'Celtics',      conference: 'east', image_url: 'https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg' },
  { team_name: 'Knicks',       conference: 'east', image_url: 'https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg' },
  { team_name: 'Cavaliers',    conference: 'east', image_url: 'https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg' },
  { team_name: 'Raptors',      conference: 'east', image_url: 'https://cdn.nba.com/logos/nba/1610612761/global/L/logo.svg' },
  { team_name: 'Hawks',        conference: 'east', image_url: 'https://cdn.nba.com/logos/nba/1610612737/global/L/logo.svg' },
  { team_name: '76ers',        conference: 'east', image_url: 'https://cdn.nba.com/logos/nba/1610612755/global/L/logo.svg' },
  // Western Conference
  { team_name: 'Thunder',      conference: 'west', image_url: 'https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg' },
  { team_name: 'Spurs',        conference: 'west', image_url: 'https://cdn.nba.com/logos/nba/1610612759/global/L/logo.svg' },
  { team_name: 'Nuggets',      conference: 'west', image_url: 'https://cdn.nba.com/logos/nba/1610612743/global/L/logo.svg' },
  { team_name: 'Lakers',       conference: 'west', image_url: 'https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg' },
  { team_name: 'Rockets',      conference: 'west', image_url: 'https://cdn.nba.com/logos/nba/1610612745/global/L/logo.svg' },
  { team_name: 'Timberwolves', conference: 'west', image_url: 'https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg' },
  { team_name: 'Blazers',      conference: 'west', image_url: 'https://cdn.nba.com/logos/nba/1610612757/global/L/logo.svg' },
];

// ── 2026 First Round Series ──────────────────────────────────────────────────
// Game 1 start times (UTC). Source: nba.com/playoffs/2026/series
// TBD = play-in winner not yet determined.
const SERIES = [
  // Eastern Conference Round 1
  { series_id: 'east-r1-1v8', conference: 'EAST', team_a: 'Pistons',   team_b: 'TBD',         start_time: '2026-04-20T17:00:00Z', round: 'R1', status: 'UPCOMING' }, // TBD after play-in
  { series_id: 'east-r1-2v7', conference: 'EAST', team_a: 'Celtics',   team_b: '76ers',        start_time: '2026-04-19T17:00:00Z', round: 'R1', status: 'UPCOMING' }, // Sun Apr 19 · 1:00 PM ET
  { series_id: 'east-r1-3v6', conference: 'EAST', team_a: 'Knicks',    team_b: 'Hawks',        start_time: '2026-04-18T19:30:00Z', round: 'R1', status: 'UPCOMING' }, // Sat Apr 18 · 3:30 PM ET
  { series_id: 'east-r1-4v5', conference: 'EAST', team_a: 'Cavaliers', team_b: 'Raptors',      start_time: '2026-04-18T16:30:00Z', round: 'R1', status: 'UPCOMING' }, // Sat Apr 18 · 12:30 PM ET
  // Western Conference Round 1
  { series_id: 'west-r1-1v8', conference: 'WEST', team_a: 'Thunder',   team_b: 'TBD',          start_time: '2026-04-20T19:30:00Z', round: 'R1', status: 'UPCOMING' }, // TBD after play-in
  { series_id: 'west-r1-2v7', conference: 'WEST', team_a: 'Spurs',     team_b: 'Blazers',      start_time: '2026-04-19T19:30:00Z', round: 'R1', status: 'UPCOMING' }, // Sun Apr 19 · 3:30 PM ET
  { series_id: 'west-r1-3v6', conference: 'WEST', team_a: 'Nuggets',   team_b: 'Timberwolves', start_time: '2026-04-18T23:00:00Z', round: 'R1', status: 'UPCOMING' }, // Sat Apr 18 · 7:00 PM ET
  { series_id: 'west-r1-4v5', conference: 'WEST', team_a: 'Lakers',    team_b: 'Rockets',      start_time: '2026-04-19T01:30:00Z', round: 'R1', status: 'UPCOMING' }, // Sat Apr 18 · 9:30 PM ET
];

async function run() {
  console.log('Seeding nba_teams…');
  // Delete stale rows then re-insert (table may lack a PK/unique on team_name).
  await supabase.from('nba_teams').delete().neq('team_name', '__never__');
  const { error: teamsErr } = await supabase.from('nba_teams').insert(NBA_TEAMS);
  if (teamsErr) {
    console.error('nba_teams error:', teamsErr.message);
  } else {
    console.log(`  ✓ ${NBA_TEAMS.length} teams inserted`);
  }

  console.log('Seeding series…');
  const { error: seriesErr } = await supabase
    .from('series')
    .upsert(SERIES, { onConflict: 'series_id' });
  if (seriesErr) {
    console.error('series error:', seriesErr.message);
  } else {
    console.log(`  ✓ ${SERIES.length} series upserted`);
  }

  console.log('Done.');
}

run();
