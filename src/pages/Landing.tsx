import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Landing = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-gray-900">{t('welcome')}</h1>
        <p className="text-xl text-gray-600">{t('welcomeDescription')}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Get Started
        </h2>
        <div className="space-y-3">
          <Link
            to="/auth"
            className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors"
          >
            {t('auth')}
          </Link>
          <Link
            to="/home"
            className="block w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg text-center transition-colors"
          >
            Browse as Guest
          </Link>
        </div>
      </div>

      <div className="text-sm text-gray-500 text-center">
        <p>NBA Playoff predictions, leaderboards, and community insights</p>
      </div>
    </div>
  );
};

export default Landing;
