import { useParams } from 'react-router-dom';

const SeriesPrediction = () => {
  const { seriesId } = useParams();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">
          Series #{seriesId} Prediction
        </h1>
        <p className="text-gray-600">Eastern Conference - First Round</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Pick the Winner
          </h2>
          <div className="flex items-center justify-center space-x-8">
            <button className="flex flex-col items-center space-y-2 p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
              <span className="text-4xl">🏀</span>
              <span className="font-semibold">Team A</span>
              <span className="text-sm text-gray-500">#1 Seed</span>
            </button>

            <span className="text-2xl font-bold text-gray-400">VS</span>

            <button className="flex flex-col items-center space-y-2 p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
              <span className="text-4xl">🏀</span>
              <span className="font-semibold">Team B</span>
              <span className="text-sm text-gray-500">#8 Seed</span>
            </button>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Games to Win Series
            </label>
            <select className="w-full max-w-xs mx-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>4 Games</option>
              <option>5 Games</option>
              <option>6 Games</option>
              <option>7 Games</option>
            </select>
          </div>

          <button className="w-full max-w-xs mx-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Submit Prediction
          </button>
        </div>

        {/* TODO: Load actual series data from Supabase */}
        {/* TODO: Save predictions to database */}
        {/* TODO: Show prediction history */}

        <div className="text-center text-gray-500 text-sm pt-4">
          <p>Series data will be loaded from backend in Step 2</p>
        </div>
      </div>
    </div>
  );
};

export default SeriesPrediction;
