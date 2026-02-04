import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Predictions = () => {
  const { t } = useTranslation();

  const predictionTypes = [
    {
      title: 'Series Predictions',
      description: 'Predict winners for each playoff series',
      link: '/predictions/series/1',
      icon: '🏀',
      status: 'Available',
    },
    {
      title: 'Champion Prediction',
      description: 'Pick the NBA Champion',
      link: '/predictions/champion',
      icon: '🏆',
      status: 'Available',
    },
    {
      title: 'Finals MVP',
      description: 'Predict the Finals MVP',
      link: '/predictions/mvp',
      icon: '⭐',
      status: 'Coming Soon',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">{t('predictions')}</h1>
        <p className="text-gray-600">Make your playoff predictions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {predictionTypes.map((type) => (
          <Link
            key={type.link}
            to={type.link}
            className="bg-white rounded-lg shadow-md p-6 space-y-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl">{type.icon}</span>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  type.status === 'Available'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {type.status}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{type.title}</h3>
            <p className="text-sm text-gray-600">{type.description}</p>
          </Link>
        ))}
      </div>

      {/* TODO: Add deadline timers for predictions */}
      {/* TODO: Show user's current predictions */}
      {/* TODO: Add points system explanation */}

      <div className="text-center text-gray-500 text-sm mt-8">
        <p>Prediction submission and scoring will be implemented with backend</p>
      </div>
    </div>
  );
};

export default Predictions;
