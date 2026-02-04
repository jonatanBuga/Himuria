const ChampionPrediction = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">
          🏆 Champion Prediction
        </h1>
        <p className="text-gray-600">Pick the 2024 NBA Champion</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            Select Your Champion
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Placeholder teams */}
            {[
              'Lakers',
              'Celtics',
              'Warriors',
              'Bucks',
              'Nuggets',
              'Heat',
              'Suns',
              '76ers',
            ].map((team) => (
              <button
                key={team}
                className="flex flex-col items-center space-y-2 p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <span className="text-3xl">🏀</span>
                <span className="font-semibold">{team}</span>
              </button>
            ))}
          </div>

          <div className="pt-4">
            <button className="w-full max-w-md mx-auto block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Submit Prediction
            </button>
          </div>
        </div>

        {/* TODO: Load actual playoff teams from Supabase */}
        {/* TODO: Show odds/probabilities */}
        {/* TODO: Save predictions and track changes */}

        <div className="text-center text-gray-500 text-sm pt-4 border-t border-gray-200">
          <p>Team data will be loaded from backend in Step 2</p>
        </div>
      </div>
    </div>
  );
};

export default ChampionPrediction;
