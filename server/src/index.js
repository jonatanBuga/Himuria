import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { createRemoteJWKSet, jwtVerify } from 'jose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET?.trim();
const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || '').split(',').filter(Boolean);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_JWT_SECRET) {
  console.error('Missing Supabase environment variables. Check server/.env (no spaces around =).');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://himuria.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

const jwksUrl = SUPABASE_URL
  ? new URL('/auth/v1/.well-known/jwks.json', SUPABASE_URL)
  : null;
const jwks = jwksUrl ? createRemoteJWKSet(jwksUrl) : null;
const jwtIssuer = SUPABASE_URL ? `${SUPABASE_URL}/auth/v1` : undefined;

async function verifySupabaseJwt(token) {
  if (SUPABASE_JWT_SECRET) {
    try {
      const secret = new TextEncoder().encode(SUPABASE_JWT_SECRET);
      return await jwtVerify(token, secret, {
        issuer: jwtIssuer,
      });
    } catch (err) {
      // Fall through to JWKS validation if legacy secret fails.
    }
  }
  if (jwks) {
    return jwtVerify(token, jwks, { issuer: jwtIssuer });
  }
  throw new Error('JWT verification not configured.');
}

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token.' });

  try {
    const { payload } = await verifySupabaseJwt(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

function requireAdmin(req, res, next) {
  if (!ADMIN_USER_IDS.length) return next();
  if (ADMIN_USER_IDS.includes(req.user.id)) return next();
  return res.status(403).json({ error: 'Not authorized.' });
}

function isValidSeriesWins(teamAWins, teamBWins) {
  const a = Number(teamAWins);
  const b = Number(teamBWins);
  if (!Number.isInteger(a) || !Number.isInteger(b)) return false;
  if (a < 0 || a > 4 || b < 0 || b > 4) return false;
  return (a === 4 && b <= 3) || (b === 4 && a <= 3);
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/profile/me', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .limit(1)
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });

  if (!data) {
    const { data: created, error: createError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: req.user.id,
        email: req.user.email || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();
    if (createError) return res.status(400).json({ error: createError.message });
    return res.json(created);
  }

  return res.json(data);
});

app.put('/api/draft/season', requireAuth, async (req, res) => {
  const body = req.body || {};
  const championPick = body.championPick || body.champion_team;
  const mvpPick = body.mvpPick || body.mvp_player;
  if (!championPick || !mvpPick) {
    return res.status(400).json({ error: 'Champion and MVP picks are required.' });
  }

  const payload = {
    user_id: req.user.id,
    champion_team: championPick,
    mvp_player: mvpPick,
    updated_at: new Date().toISOString(),
  };

  // Manual upsert so we don't require a unique constraint on user_id.
  const { data: existing, error: existingError } = await supabaseAdmin
    .from('season_picks_draft')
    .select('id')
    .eq('user_id', req.user.id)
    .maybeSingle();

  if (existingError) return res.status(400).json({ error: existingError.message });

  let saved;
  if (existing?.id) {
    const { data, error } = await supabaseAdmin
      .from('season_picks_draft')
      .update(payload)
      .eq('id', existing.id)
      .select('*')
      .single();
    if (error) return res.status(400).json({ error: error.message });
    saved = data;
  } else {
    const { data, error } = await supabaseAdmin
      .from('season_picks_draft')
      .insert(payload)
      .select('*')
      .single();
    if (error) return res.status(400).json({ error: error.message });
    saved = data;
  }

  await supabaseAdmin
    .from('profiles')
    .update({ has_onboarded: true, updated_at: new Date().toISOString() })
    .eq('id', req.user.id);

  return res.json(saved);
});

app.get('/api/draft/season', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('season_picks_draft')
    .select('*')
    .eq('user_id', req.user.id)
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || {});
});

app.get('/api/committed/season', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('season_picks_committed')
    .select('*')
    .eq('user_id', req.user.id)
    .maybeSingle();

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || {});
});

app.put('/api/draft/series', requireAuth, async (req, res) => {
  const body = req.body || {};
  const series_id = body.series_id || body.seriesId;
  const team_a = body.team_a || body.teamA;
  const team_b = body.team_b || body.teamB;
  const team_a_wins = body.team_a_wins ?? body.teamAWins;
  const team_b_wins = body.team_b_wins ?? body.teamBWins;
  if (!series_id || !team_a || !team_b) {
    console.warn('Draft series payload missing fields', body);
    return res.status(400).json({ error: 'Series and team data are required.' });
  }
  if (!isValidSeriesWins(team_a_wins, team_b_wins)) {
    return res.status(400).json({ error: 'Invalid series win totals.' });
  }

  const payload = {
    user_id: req.user.id,
    series_id,
    team_a,
    team_b,
    team_a_wins,
    team_b_wins,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('series_picks_draft')
    .upsert(payload, { onConflict: 'user_id,series_id' })
    .select('*')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

app.get('/api/draft/series', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('series_picks_draft')
    .select('*')
    .eq('user_id', req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

app.get('/api/committed/series', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('series_picks_committed')
    .select('*')
    .eq('user_id', req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

app.post('/api/commit/series', requireAuth, async (req, res) => {
  const { series_id } = req.body || {};
  if (!series_id) {
    return res.status(400).json({ error: 'series_id is required.' });
  }

  const { data: draft, error: draftError } = await supabaseAdmin
    .from('series_picks_draft')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('series_id', series_id)
    .maybeSingle();

  if (draftError) return res.status(400).json({ error: draftError.message });
  if (!draft) return res.status(204).json({ status: 'no_draft' });

  if (!isValidSeriesWins(draft.team_a_wins, draft.team_b_wins)) {
    return res.status(400).json({ error: 'Invalid series win totals.' });
  }

  const payload = {
    user_id: draft.user_id,
    series_id: draft.series_id,
    team_a: draft.team_a,
    team_b: draft.team_b,
    team_a_wins: draft.team_a_wins,
    team_b_wins: draft.team_b_wins,
    locked: true,
    committed_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('series_picks_committed')
    .upsert(payload, { onConflict: 'user_id,series_id' })
    .select('*')
    .single();

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

app.get('/api/series', requireAuth, async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('series').select('*').order('start_time');
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

app.get('/api/analytics/round', requireAuth, async (req, res) => {
  console.log('[analytics] user', req.user.id);
  // Draft-only analytics source (no committed).
  const { data: drafts, error: draftsError } = await supabaseAdmin
    .from('series_picks_draft')
    .select('*');
  if (draftsError) return res.status(400).json({ error: draftsError.message });
  const seriesIds = Array.from(new Set((drafts || []).map((row) => row.series_id)));
  console.log('[analytics] seriesIds', seriesIds);
  console.log('[analytics] draft picks count', drafts?.length || 0);

  const userIds = Array.from(new Set((drafts || []).map((row) => row.user_id))).filter(Boolean);
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id,email')
    .in('id', userIds);
  const profileMap = new Map((profiles || []).map((p) => [p.id, p.email]));

  const draftsBySeries = new Map();
  (drafts || []).forEach((row) => {
    const list = draftsBySeries.get(row.series_id) || [];
    list.push(row);
    draftsBySeries.set(row.series_id, list);
  });

  // Optional conference mapping from series table if present.
  const { data: seriesRows } = await supabaseAdmin.from('series').select('*').in('series_id', seriesIds);
  const conferenceMap = new Map((seriesRows || []).map((row) => [row.series_id, row.conference]));
  const teamConferenceMap = new Map([
    ['Celtics', 'EAST'], ['Knicks', 'EAST'], ['Bucks', 'EAST'], ['76ers', 'EAST'], ['Heat', 'EAST'], ['Cavaliers', 'EAST'],
    ['Nuggets', 'WEST'], ['Timberwolves', 'WEST'], ['Thunder', 'WEST'], ['Mavericks', 'WEST'], ['Lakers', 'WEST'], ['Suns', 'WEST'],
  ]);

  const teamAgg = new Map();
  const seriesAnalytics = seriesIds.map((seriesId) => {
    const picks = draftsBySeries.get(seriesId) || [];
    const totalUsers = new Set(picks.map((p) => p.user_id)).size;
    let teamACount = 0;
    let teamBCount = 0;
    picks.forEach((p) => {
      const email = profileMap.get(p.user_id) || 'Unknown';
      if (p.team_a_wins === 4) {
        teamACount += 1;
        const conf = conferenceMap.get(seriesId) || teamConferenceMap.get(p.team_a) || 'EAST';
        const key = `${conf}:${p.team_a}`;
        const agg = teamAgg.get(key) || { team: p.team_a, conference: conf, count: 0, users: [] };
        agg.count += 1;
        agg.users.push(email);
        teamAgg.set(key, agg);
      }
      if (p.team_b_wins === 4) {
        teamBCount += 1;
        const conf = conferenceMap.get(seriesId) || teamConferenceMap.get(p.team_b) || 'WEST';
        const key = `${conf}:${p.team_b}`;
        const agg = teamAgg.get(key) || { team: p.team_b, conference: conf, count: 0, users: [] };
        agg.count += 1;
        agg.users.push(email);
        teamAgg.set(key, agg);
      }
    });
    const userPick = picks.find((p) => p.user_id === req.user.id) || null;
    return {
      series_id: seriesId,
      team_a: picks[0]?.team_a || '',
      team_b: picks[0]?.team_b || '',
      team_a_count: teamACount,
      team_b_count: teamBCount,
      total_users: totalUsers,
      user_picked: Boolean(userPick),
    };
  });

  const pickedCount = seriesAnalytics.filter((s) => s.user_picked).length;
  const totalSeries = seriesAnalytics.length;
  const eastTeams = Array.from(teamAgg.values()).filter((t) => t.conference === 'EAST');
  const westTeams = Array.from(teamAgg.values()).filter((t) => t.conference === 'WEST');

  return res.json({
    round: 'DRAFT',
    totalSeries,
    pickedCount,
    notPickedCount: Math.max(0, totalSeries - pickedCount),
    east: eastTeams,
    west: westTeams,
  });
});

app.post('/api/admin/series/upsert', requireAuth, requireAdmin, async (req, res) => {
  const payload = Array.isArray(req.body) ? req.body : [req.body];
  const { data, error } = await supabaseAdmin
    .from('series')
    .upsert(payload, { onConflict: 'series_id' })
    .select('*');

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data || []);
});

app.post('/api/admin/commit/run', requireAuth, requireAdmin, async (_req, res) => {
  await runCommitEngine();
  return res.json({ status: 'ok' });
});

async function runCommitEngine() {
  const now = new Date();
  const { data: seriesRows, error } = await supabaseAdmin.from('series').select('*');
  if (error || !seriesRows) return;

  const lockThreshold = now.getTime();
  const seriesToLock = seriesRows.filter((row) => {
    const start = new Date(row.start_time).getTime() - 60 * 1000;
    return start <= lockThreshold;
  });

  if (seriesToLock.length) {
    const seriesIds = seriesToLock.map((row) => row.series_id);
    const { data: drafts } = await supabaseAdmin
      .from('series_picks_draft')
      .select('*')
      .in('series_id', seriesIds);

    const { data: existing } = await supabaseAdmin
      .from('series_picks_committed')
      .select('*')
      .in('series_id', seriesIds);

    const committedMap = new Map(existing?.map((row) => [`${row.user_id}:${row.series_id}`, row]));

    const toCommit = (drafts || []).filter((row) => {
      const key = `${row.user_id}:${row.series_id}`;
      return !committedMap.has(key);
    });

    if (toCommit.length) {
      await supabaseAdmin.from('series_picks_committed').upsert(
        toCommit.map((row) => ({
          user_id: row.user_id,
          series_id: row.series_id,
          team_a: row.team_a,
          team_b: row.team_b,
          team_a_wins: row.team_a_wins,
          team_b_wins: row.team_b_wins,
          locked: true,
          committed_at: now.toISOString(),
        })),
        { onConflict: 'user_id,series_id' }
      );
    }
  }

  const startTimes = seriesRows
    .map((row) => new Date(row.start_time).getTime())
    .filter((value) => !Number.isNaN(value));
  if (!startTimes.length) return;

  const firstStart = Math.min(...startTimes) - 60 * 1000;
  const finalsStarts = seriesRows
    .filter((row) => row.round === 'FINALS')
    .map((row) => new Date(row.start_time).getTime());
  const finalsStart = finalsStarts.length ? Math.min(...finalsStarts) - 60 * 1000 : null;

  const { data: seasonDrafts } = await supabaseAdmin.from('season_picks_draft').select('*');
  if (!seasonDrafts?.length) return;

  const { data: seasonCommitted } = await supabaseAdmin
    .from('season_picks_committed')
    .select('*');
  const committedByUser = new Map(seasonCommitted?.map((row) => [row.user_id, row]) || []);

  if (lockThreshold >= firstStart) {
    const payload = seasonDrafts
      .filter((row) => {
        const existing = committedByUser.get(row.user_id);
        return !existing?.champion_locked;
      })
      .map((row) => {
        const existing = committedByUser.get(row.user_id);
        return {
          user_id: row.user_id,
          champion_team: row.champion_team,
          mvp_player: existing?.mvp_player || row.mvp_player,
          champion_locked: true,
          mvp_locked: existing?.mvp_locked || false,
          committed_at: now.toISOString(),
        };
      });

    if (payload.length) {
      await supabaseAdmin.from('season_picks_committed').upsert(payload, { onConflict: 'user_id' });
    }
  }

  if (finalsStart && lockThreshold >= finalsStart) {
    const payload = seasonDrafts
      .filter((row) => {
        const existing = committedByUser.get(row.user_id);
        return !existing?.mvp_locked;
      })
      .map((row) => {
        const existing = committedByUser.get(row.user_id);
        return {
          user_id: row.user_id,
          champion_team: existing?.champion_team || row.champion_team,
          mvp_player: row.mvp_player,
          champion_locked: existing?.champion_locked || false,
          mvp_locked: true,
          committed_at: now.toISOString(),
        };
      });

    if (payload.length) {
      await supabaseAdmin.from('season_picks_committed').upsert(payload, { onConflict: 'user_id' });
    }
  }
}

const COMMIT_INTERVAL_MS = Number(process.env.COMMIT_INTERVAL_MS || 45000);
setInterval(() => {
  runCommitEngine().catch((err) => console.error('Commit engine error', err));
}, COMMIT_INTERVAL_MS);

app.listen(PORT, () => {
  console.log(`Himuria server running on http://localhost:${PORT}`);
});
