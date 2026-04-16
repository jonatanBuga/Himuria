import { saveSeriesDraft } from './api.js';

export function getSeriesPayload(seriesRow, winsA, winsB) {
  return {
    series_id: seriesRow.series_id || seriesRow.id,
    team_a: seriesRow.team_a || seriesRow.teamA,
    team_b: seriesRow.team_b || seriesRow.teamB,
    team_a_wins: winsA,
    team_b_wins: winsB,
    start_time: seriesRow.start_time,
  };
}

export function isValidSeriesWins(winsA, winsB) {
  const a = Number(winsA);
  const b = Number(winsB);
  if (!Number.isInteger(a) || !Number.isInteger(b)) return false;
  if (a < 0 || a > 4 || b < 0 || b > 4) return false;
  return (a === 4 && b <= 3) || (b === 4 && a <= 3);
}

export function getLockTime(seriesRow) {
  // Betting closes at series start time (Game 1 tip-off).
  return new Date(seriesRow.start_time).getTime();
}

export async function saveDraftPick(token, seriesRow, winsA, winsB) {
  const payload = getSeriesPayload(seriesRow, winsA, winsB);
  return saveSeriesDraft(token, payload);
}
