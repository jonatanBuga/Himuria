import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">{t('home')}</h1>
        <p className="text-gray-600">Your NBA Playoff Feed</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Feed Card 1 */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Live Game</span>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              LIVE
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">LAL vs GSW</h3>
          <p className="text-sm text-gray-600">
            Score: 98 - 95 | Q4 2:45
          </p>
        </div>

        {/* Feed Card 2 */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Prediction Alert</span>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              NEW
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Conference Finals Open
          </h3>
          <p className="text-sm text-gray-600">
            Make your predictions now!
          </p>
        </div>

        {/* Feed Card 3 */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
          <span className="text-sm text-gray-500">Leaderboard Update</span>
          <h3 className="text-lg font-semibold text-gray-900">
            You're ranked #42
          </h3>
          <p className="text-sm text-gray-600">
            +3 spots from yesterday! 🔥
          </p>
        </div>
      </div>

      {/* TODO: Add real-time game updates from Supabase */}
      {/* TODO: Add user's prediction feed */}
      {/* TODO: Add social features (comments, likes) */}

      <div className="text-center text-gray-500 text-sm mt-8">
        <p>Feed will show live games, predictions, and community activity</p>
      </div>
    </div>
  );
};

export default Home;
