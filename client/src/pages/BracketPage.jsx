import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { fetchSeriesSchedule } from '../api.js';
import { supabase } from '../supabaseClient.js';
import { TeamLogo } from '../components/SeriesPickCard.jsx';

// Real 2026 NBA Playoffs first-round series.
// Used as fallback when the backend returns empty data.
// Game 1 start times are UTC. Source: nba.com/playoffs/2026/series
const FALLBACK_SERIES = [
  // ── Eastern Conference Round 1 ─────────────────────────────────────────
  {
    series_id: 'east-r1-1v8',
    conference: 'EAST', round: 'R1', status: 'UPCOMING',
    team_a: 'Pistons', team_b: 'TBD',
    start_time: '2026-04-20T17:00:00Z',   // Game 1 TBD (after play-in)
  },
  {
    series_id: 'east-r1-2v7',
    conference: 'EAST', round: 'R1', status: 'UPCOMING',
    team_a: 'Celtics', team_b: '76ers',
    start_time: '2026-04-19T17:00:00Z',   // Game 1 Sun Apr 19 · 1:00 PM ET
  },
  {
    series_id: 'east-r1-3v6',
    conference: 'EAST', round: 'R1', status: 'UPCOMING',
    team_a: 'Knicks', team_b: 'Hawks',
    start_time: '2026-04-18T19:30:00Z',   // Game 1 Sat Apr 18 · 3:30 PM ET
  },
  {
    series_id: 'east-r1-4v5',
    conference: 'EAST', round: 'R1', status: 'UPCOMING',
    team_a: 'Cavaliers', team_b: 'Raptors',
    start_time: '2026-04-18T16:30:00Z',   // Game 1 Sat Apr 18 · 12:30 PM ET
  },
  // ── Western Conference Round 1 ─────────────────────────────────────────
  {
    series_id: 'west-r1-1v8',
    conference: 'WEST', round: 'R1', status: 'UPCOMING',
    team_a: 'Thunder', team_b: 'TBD',
    start_time: '2026-04-20T19:30:00Z',   // Game 1 TBD (after play-in)
  },
  {
    series_id: 'west-r1-2v7',
    conference: 'WEST', round: 'R1', status: 'UPCOMING',
    team_a: 'Spurs', team_b: 'Blazers',
    start_time: '2026-04-19T19:30:00Z',   // Game 1 Sun Apr 19 · 3:30 PM ET
  },
  {
    series_id: 'west-r1-3v6',
    conference: 'WEST', round: 'R1', status: 'UPCOMING',
    team_a: 'Nuggets', team_b: 'Timberwolves',
    start_time: '2026-04-18T23:00:00Z',   // Game 1 Sat Apr 18 · 7:00 PM ET
  },
  {
    series_id: 'west-r1-4v5',
    conference: 'WEST', round: 'R1', status: 'UPCOMING',
    team_a: 'Lakers', team_b: 'Rockets',
    start_time: '2026-04-19T01:30:00Z',   // Game 1 Sat Apr 18 · 9:30 PM ET
  },
];

const FALLBACK_MAP = Object.fromEntries(FALLBACK_SERIES.map((s) => [s.series_id, s]));

// Fixed bracket slots in display order.
// series_id must match what's in the DB. Placeholder slots have no series_id.
const EAST_SLOTS = {
  r1: [
    { series_id: 'east-r1-1v8', seedA: 1, seedB: 8 },
    { series_id: 'east-r1-4v5', seedA: 4, seedB: 5 },
    { series_id: 'east-r1-2v7', seedA: 2, seedB: 7 },
    { series_id: 'east-r1-3v6', seedA: 3, seedB: 6 },
  ],
  r2: [
    { series_id: 'east-r2-1' },
    { series_id: 'east-r2-2' },
  ],
  cf: [{ series_id: 'east-cf' }],
};

const WEST_SLOTS = {
  r1: [
    { series_id: 'west-r1-1v8', seedA: 1, seedB: 8 },
    { series_id: 'west-r1-4v5', seedA: 4, seedB: 5 },
    { series_id: 'west-r1-2v7', seedA: 2, seedB: 7 },
    { series_id: 'west-r1-3v6', seedA: 3, seedB: 6 },
  ],
  r2: [
    { series_id: 'west-r2-1' },
    { series_id: 'west-r2-2' },
  ],
  cf: [{ series_id: 'west-cf' }],
};

const FINALS_SLOT = { series_id: 'nba-finals' };

export default function BracketPage() {
  const { auth } = useAuth();
  const { t } = useLanguage();
  const [seriesMap, setSeriesMap] = useState({});
  const [teamLogoMap, setTeamLogoMap] = useState({});
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    if (auth?.token) return auth.token;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      const token = await getToken();
      if (!token) return;
      try {
        const rows = await fetchSeriesSchedule(token);
        if (!active) return;
        if (rows.length) {
          const map = {};
          rows.forEach((s) => { map[s.series_id] = s; });
          setSeriesMap(map);
        } else {
          setSeriesMap(FALLBACK_MAP);
        }
      } catch {
        if (active) setSeriesMap(FALLBACK_MAP);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [auth?.token]);

  useEffect(() => {
    let active = true;
    supabase.from('nba_teams').select('team_name, image_url').then(({ data }) => {
      if (!active || !data) return;
      const map = {};
      data.forEach((r) => { if (r.team_name && r.image_url) map[r.team_name.toLowerCase()] = r.image_url; });
      setTeamLogoMap(map);
    });
    return () => { active = false; };
  }, []);

  const s = (id) => seriesMap[id] || null;

  return (
    <div className="page">
      <section className="card bracket-section">
        <div className="card-header">
          <div>
            <p className="eyebrow">{t('bracket.eyebrow')}</p>
            <h3>{t('bracket.title')}</h3>
          </div>
        </div>

        {loading ? (
          <p className="muted">{t('bracket.loading')}</p>
        ) : (
          <div className="bracket-scroll-outer">
            <div className="bracket-wrap">

              {/* ── Conference labels ── */}
              <div className="bracket-conf-labels">
                <span className="bracket-conf-label east">{t('bracket.east')}</span>
                <span className="bracket-conf-label finals">{t('bracket.finals')}</span>
                <span className="bracket-conf-label west">{t('bracket.west')}</span>
              </div>

              {/* ── Bracket body ── */}
              <div className="bracket-body">

                {/* EAST R1 */}
                <div className="bracket-col r1 east-r1">
                  <BracketHalf
                    top={EAST_SLOTS.r1[0]}
                    bottom={EAST_SLOTS.r1[1]}
                    seriesMap={seriesMap}
                    teamLogoMap={teamLogoMap}
                    side="right"
                  />
                  <BracketHalf
                    top={EAST_SLOTS.r1[2]}
                    bottom={EAST_SLOTS.r1[3]}
                    seriesMap={seriesMap}
                    teamLogoMap={teamLogoMap}
                    side="right"
                  />
                </div>

                {/* EAST R2 */}
                <div className="bracket-col r2 east-r2">
                  <BracketSlotCentered
                    slot={EAST_SLOTS.r2[0]}
                    series={s(EAST_SLOTS.r2[0].series_id)}
                    teamLogoMap={teamLogoMap}
                    side="right"
                  />
                  <BracketSlotCentered
                    slot={EAST_SLOTS.r2[1]}
                    series={s(EAST_SLOTS.r2[1].series_id)}
                    teamLogoMap={teamLogoMap}
                    side="right"
                  />
                </div>

                {/* EAST CF */}
                <div className="bracket-col cf east-cf">
                  <BracketSlotCentered
                    slot={EAST_SLOTS.cf[0]}
                    series={s(EAST_SLOTS.cf[0].series_id)}
                    teamLogoMap={teamLogoMap}
                    side="right"
                    label={t('bracket.confFinals')}
                  />
                </div>

                {/* NBA FINALS */}
                <div className="bracket-col finals-col">
                  <BracketSlotCentered
                    slot={FINALS_SLOT}
                    series={s(FINALS_SLOT.series_id)}
                    teamLogoMap={teamLogoMap}
                    side="center"
                    label={t('bracket.nbaFinals')}
                    isFinals
                  />
                </div>

                {/* WEST CF */}
                <div className="bracket-col cf west-cf">
                  <BracketSlotCentered
                    slot={WEST_SLOTS.cf[0]}
                    series={s(WEST_SLOTS.cf[0].series_id)}
                    teamLogoMap={teamLogoMap}
                    side="left"
                    label={t('bracket.confFinals')}
                  />
                </div>

                {/* WEST R2 */}
                <div className="bracket-col r2 west-r2">
                  <BracketSlotCentered
                    slot={WEST_SLOTS.r2[0]}
                    series={s(WEST_SLOTS.r2[0].series_id)}
                    teamLogoMap={teamLogoMap}
                    side="left"
                  />
                  <BracketSlotCentered
                    slot={WEST_SLOTS.r2[1]}
                    series={s(WEST_SLOTS.r2[1].series_id)}
                    teamLogoMap={teamLogoMap}
                    side="left"
                  />
                </div>

                {/* WEST R1 */}
                <div className="bracket-col r1 west-r1">
                  <BracketHalf
                    top={WEST_SLOTS.r1[0]}
                    bottom={WEST_SLOTS.r1[1]}
                    seriesMap={seriesMap}
                    teamLogoMap={teamLogoMap}
                    side="left"
                  />
                  <BracketHalf
                    top={WEST_SLOTS.r1[2]}
                    bottom={WEST_SLOTS.r1[3]}
                    seriesMap={seriesMap}
                    teamLogoMap={teamLogoMap}
                    side="left"
                  />
                </div>

              </div>
              {/* Round labels */}
              <div className="bracket-round-labels">
                <span>{t('bracket.round1')}</span>
                <span>{t('bracket.round2')}</span>
                <span>{t('bracket.confFinals')}</span>
                <span>{t('bracket.nbaFinals')}</span>
                <span>{t('bracket.confFinals')}</span>
                <span>{t('bracket.round2')}</span>
                <span>{t('bracket.round1')}</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// ── Two R1 matchups stacked in a half (with a connector line to R2) ────────
function BracketHalf({ top, bottom, seriesMap, teamLogoMap, side }) {
  return (
    <div className={`bracket-half bracket-half--${side}`}>
      <MatchupCard
        slot={top}
        series={seriesMap[top.series_id] || null}
        teamLogoMap={teamLogoMap}
      />
      <MatchupCard
        slot={bottom}
        series={seriesMap[bottom.series_id] || null}
        teamLogoMap={teamLogoMap}
      />
    </div>
  );
}

// ── Single matchup slot, vertically centered (for R2/CF/Finals) ─────────────
function BracketSlotCentered({ slot, series, teamLogoMap, label, isFinals }) {
  return (
    <div className="bracket-centered-slot">
      {label && <p className="bracket-round-tag">{label}</p>}
      <MatchupCard slot={slot} series={series} teamLogoMap={teamLogoMap} isFinals={isFinals} />
    </div>
  );
}

// ── A single matchup card ────────────────────────────────────────────────────
function MatchupCard({ slot, series, teamLogoMap, isFinals }) {
  const teamA = series?.team_a || null;
  const teamB = series?.team_b === 'TBD' ? null : series?.team_b || null;
  const status = series?.status || null;
  const winner = series?.winner || null;

  const isCompleted = status === 'COMPLETED';
  const isActive = status === 'ACTIVE';

  return (
    <div className={`bracket-card ${isFinals ? 'bracket-card--finals' : ''} ${isActive ? 'bracket-card--active' : ''} ${isCompleted ? 'bracket-card--done' : ''}`}>
      {/* Status badge */}
      {isActive && <span className="bracket-badge live">LIVE</span>}
      {isCompleted && <span className="bracket-badge done">FINAL</span>}

      {/* Team A */}
      <div className={`bracket-team ${winner && winner === teamA ? 'bracket-team--winner' : ''} ${winner && winner !== teamA ? 'bracket-team--loser' : ''}`}>
        {teamA ? (
          <>
            {slot.seedA !== undefined && <span className="bracket-seed">{slot.seedA}</span>}
            <TeamLogo name={teamA} teamLogoMap={teamLogoMap} />
            <span className="bracket-team-name">{teamA}</span>
            {series?.team_a_wins !== undefined && isCompleted && (
              <span className="bracket-wins">{series.team_a_wins}</span>
            )}
          </>
        ) : (
          <>
            {slot.seedA !== undefined && <span className="bracket-seed">{slot.seedA}</span>}
            <span className="bracket-tbd">TBD</span>
          </>
        )}
      </div>

      <div className="bracket-divider" />

      {/* Team B */}
      <div className={`bracket-team ${winner && winner === teamB ? 'bracket-team--winner' : ''} ${winner && winner !== teamB ? 'bracket-team--loser' : ''}`}>
        {teamB ? (
          <>
            {slot.seedB !== undefined && <span className="bracket-seed">{slot.seedB}</span>}
            <TeamLogo name={teamB} teamLogoMap={teamLogoMap} />
            <span className="bracket-team-name">{teamB}</span>
            {series?.team_b_wins !== undefined && isCompleted && (
              <span className="bracket-wins">{series.team_b_wins}</span>
            )}
          </>
        ) : (
          <>
            {slot.seedB !== undefined && <span className="bracket-seed">{slot.seedB}</span>}
            <span className="bracket-tbd">TBD</span>
          </>
        )}
      </div>
    </div>
  );
}
