const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || 'Something went wrong';
    throw new Error(message);
  }
  return data;
}

export async function fetchProfile(token) {
  return request('/profile/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchSeasonDraft(token) {
  return request('/draft/season', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function saveSeasonDraft(token, payload) {
  const body = {
    champion_team: payload.championPick ?? payload.champion_team,
    mvp_player: payload.mvpPick ?? payload.mvp_player,
  };
  return request('/draft/season', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function fetchSeasonCommitted(token) {
  return request('/committed/season', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchSeriesDraft(token) {
  return request('/draft/series', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function saveSeriesDraft(token, payload) {
  return request('/draft/series', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchSeriesCommitted(token) {
  return request('/committed/series', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function commitSeriesPick(token, seriesId) {
  return request('/commit/series', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ series_id: seriesId }),
  });
}

export async function fetchSeriesSchedule(token) {
  return request('/series', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchRoundAnalytics(token) {
  return request('/analytics/round', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchLeaderboard(token) {
  return request('/leaderboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchHomeStats(token) {
  return request('/home/stats', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
