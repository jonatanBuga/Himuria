# Himuria — NBA Playoffs Prediction App

## Vision
Build an engaging social app that centralizes live NBA Playoff data, a structured prediction system, and community interaction, fostering friendly competition and shared excitement throughout the playoff season.

## Tech Stack
- **Frontend**: React (Vite), React Router, i18n via LanguageContext
- **Backend**: Node.js + Express (`server/src/index.js`)
- **Database**: Supabase (Postgres + Auth)
- **Auth**: Supabase JWT verified server-side with `jose`
- **Deployment**: Vercel (SPA routing configured in `vercel.json`)

## Project Structure
```
client/src/
  pages/          HomePage, PredictPage, LeaderboardPage, ProfilePage, LoginPage, RegisterPage
  components/     AppShell, SeriesPickCard, SeasonOnboardingModal
  contexts/       AuthContext, LanguageContext, SeasonModalContext
  hooks/          useSeriesPicks, useSeasonPicks
  api.js          All REST calls to Express backend
  rules.js        Scoring rules content
  seriesPickUtils.js  Shared pick validation/payload helpers

server/src/
  index.js        All Express routes + commit engine
```

## Core Features

### Prediction System
- **Season picks** (pre-playoffs): Champion team + Finals MVP — saved as drafts, locked when playoffs start
- **Series picks** (per matchup): Predict winner + exact series score (e.g. 4-2) — saved as drafts, auto-committed at game start time minus 60s
- Two-stage flow: `*_draft` tables (editable) → `*_committed` tables (locked, immutable)

### Scoring (defined in `server/src/index.js`, not yet implemented)
| Round                | Winner | Exact Score |
|----------------------|--------|-------------|
| Regional Quarterfinals | 10   | 13          |
| Regional Semifinals  | 15     | 19          |
| Regional Finals      | 20     | 25          |
| NBA Finals           | 25     | 33          |
| Champion Pick bonus  | +40    |             |
| Finals MVP bonus     | +10    |             |
| Most Exact Results   | +20    |             |
| Most Incorrect       | -20    |             |

`calculateTotalPoints()` is a stub — scoring is not yet live.

### Commit Engine
Runs on a server-side interval (`COMMIT_INTERVAL_MS`, default 45s). Automatically promotes draft picks to committed when `series.start_time - 60s` passes. Also locks season picks (champion at playoffs start, MVP at Finals start).

### Analytics
`GET /api/analytics/round` — returns community-wide pick distribution per series (East/West team win counts), powered by draft picks only.

### Leaderboard
`GET /api/leaderboard` — fetches `leaderboard_players` table; backfills rows for confirmed users if empty. Joins champion picks from drafts for display.

### Home Stats
`GET /api/home/stats` — returns `activeFriends` (total profiles), `totalPoints` (user's leaderboard row), `picksSubmitted` (committed series count).

## Supabase Tables
| Table | Purpose |
|-------|---------|
| `profiles` | User profile (id, username, email, has_onboarded) |
| `series` | NBA playoff matchups (series_id, team_a, team_b, conference, round, start_time, status) |
| `nba_teams` | Team metadata including `image_url` for logos |
| `series_picks_draft` | Editable series predictions |
| `series_picks_committed` | Locked series predictions |
| `season_picks_draft` | Editable champion/MVP season picks |
| `season_picks_committed` | Locked season picks |
| `leaderboard_players` | Scores per user (correct, exact, wrong, total_points) |

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/profile/me` | Get/create user profile |
| PUT | `/api/draft/season` | Save season draft (champion + MVP) |
| GET | `/api/draft/season` | Get season draft |
| GET | `/api/committed/season` | Get locked season picks |
| PUT | `/api/draft/series` | Save series draft pick |
| GET | `/api/draft/series` | Get all user's series drafts |
| GET | `/api/committed/series` | Get all user's committed picks |
| POST | `/api/commit/series` | Manually commit a series pick |
| GET | `/api/series` | Get all series (schedule) |
| GET | `/api/analytics/round` | Community pick analytics |
| GET | `/api/leaderboard` | Full leaderboard |
| GET | `/api/home/stats` | Home page stats for current user |
| POST | `/api/admin/series/upsert` | Admin: upsert series data |
| POST | `/api/admin/commit/run` | Admin: manually trigger commit engine |

## Auth
- All routes require `Authorization: Bearer <supabase_jwt>`
- Admin routes additionally require user ID in `ADMIN_USER_IDS` env var
- Client gets token from `AuthContext` or falls back to `supabase.auth.getSession()`

## Environment Variables
**Server** (`server/.env`):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `ADMIN_USER_IDS` (comma-separated user UUIDs)
- `COMMIT_INTERVAL_MS` (default: 45000)
- `PORT` (default: 4000)

**Client** (`.env`):
- `VITE_API_URL` (default: `http://localhost:4000/api`)

## Key Conventions
- Series win validation: one team must have exactly 4 wins, the other 0–3 (`isValidSeriesWins`)
- Series lock time: `start_time - 60 seconds`
- Season champion locks at first series start; MVP locks at Finals start
- Fallback series data in `PredictPage` used if backend returns empty (dev/MVP mode)
- i18n: all UI strings go through `useLanguage()` → `t('key')`
- Team logos fetched from Supabase `nba_teams` table at runtime
