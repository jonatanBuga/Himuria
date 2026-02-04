import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
      <div className="text-center space-y-4">
        <div className="text-8xl">🏀</div>
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700">
          {t('notFound')}
        </h2>
        <p className="text-gray-600 max-w-md">
          {t('notFoundDescription')}
        </p>
      </div>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        {t('goHome')}
      </Link>
    </div>
  );
};

export default NotFound;
