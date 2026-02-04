import { useTranslation } from 'react-i18next';

const Leaderboard = () => {
  const { t } = useTranslation();

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: 'User123', points: 2450, badge: '🥇' },
    { rank: 2, name: 'HoopsGuru', points: 2380, badge: '🥈' },
    { rank: 3, name: 'NBAfan99', points: 2210, badge: '🥉' },
    { rank: 4, name: 'Predictor', points: 2100, badge: '' },
    { rank: 5, name: 'CourtVision', points: 2050, badge: '' },
    { rank: 42, name: 'You', points: 1650, badge: '👤', highlight: true },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">{t('leaderboard')}</h1>
        <p className="text-gray-600">Top Predictors</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
            <div className="col-span-2">Rank</div>
            <div className="col-span-6">User</div>
            <div className="col-span-4 text-right">Points</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {leaderboardData.map((entry) => (
            <div
              key={entry.rank}
              className={`px-6 py-4 ${
                entry.highlight ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2 text-lg font-semibold text-gray-900">
                  {entry.badge || `#${entry.rank}`}
                </div>
                <div className="col-span-6">
                  <div className="font-medium text-gray-900">{entry.name}</div>
                </div>
                <div className="col-span-4 text-right">
                  <span className="text-lg font-semibold text-blue-600">
                    {entry.points}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">pts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TODO: Add filters (All-Time, Monthly, Weekly) */}
      {/* TODO: Load real leaderboard data from Supabase */}
      {/* TODO: Add pagination for large leaderboards */}
      {/* TODO: Show points breakdown on click */}

      <div className="text-center text-gray-500 text-sm mt-8">
        <p>Leaderboard will update in real-time with actual user data</p>
      </div>
    </div>
  );
};

export default Leaderboard;
