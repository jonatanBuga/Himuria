import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">{t('profile')}</h1>
        <p className="text-gray-600">Your Account & Settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Profile Info</h2>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">Guest User</div>
              <div className="text-sm text-gray-500">guest@himuria.com</div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Your Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Predictions</span>
              <span className="font-semibold text-gray-900">0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Correct Predictions</span>
              <span className="font-semibold text-gray-900">0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-semibold text-green-600">0%</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Current Rank</span>
              <span className="font-semibold text-blue-600">#42</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <div className="font-medium text-gray-900">Notifications</div>
              <div className="text-sm text-gray-500">
                Get alerts for new games and predictions
              </div>
            </div>
            <button className="w-12 h-6 bg-gray-300 rounded-full relative">
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
            </button>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <div className="font-medium text-gray-900">Email Updates</div>
              <div className="text-sm text-gray-500">
                Receive weekly summaries
              </div>
            </div>
            <button className="w-12 h-6 bg-blue-600 rounded-full relative">
              <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
            </button>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-medium text-gray-900">Dark Mode</div>
              <div className="text-sm text-gray-500">
                Coming soon
              </div>
            </div>
            <button className="w-12 h-6 bg-gray-300 rounded-full relative" disabled>
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* TODO: Connect to Supabase user profile */}
      {/* TODO: Add avatar upload */}
      {/* TODO: Load real user stats */}
      {/* TODO: Implement settings toggles */}

      <div className="text-center text-gray-500 text-sm">
        <p>Profile data will be connected to Supabase in Step 2</p>
      </div>
    </div>
  );
};

export default Profile;
