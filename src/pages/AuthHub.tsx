import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AuthHub = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">{t('auth')}</h1>
        <p className="text-gray-600">Choose how you want to continue</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full space-y-4">
        <Link
          to="/login"
          className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors"
        >
          {t('login')}
        </Link>
        <Link
          to="/register"
          className="block w-full px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-lg text-center border border-gray-300 transition-colors"
        >
          {t('register')}
        </Link>
      </div>

      {/* TODO: Add social auth buttons (Google, Apple) in Step 2 */}
    </div>
  );
};

export default AuthHub;
