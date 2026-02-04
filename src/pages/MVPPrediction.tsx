const MVPPrediction = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">
          ⭐ Finals MVP Prediction
        </h1>
        <p className="text-gray-600">Who will be the Finals MVP?</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            Select Your MVP
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Placeholder players */}
            {[
              { name: 'LeBron James', team: 'Lakers' },
              { name: 'Jayson Tatum', team: 'Celtics' },
              { name: 'Steph Curry', team: 'Warriors' },
              { name: 'Giannis Antetokounmpo', team: 'Bucks' },
              { name: 'Nikola Jokic', team: 'Nuggets' },
              { name: 'Jimmy Butler', team: 'Heat' },
            ].map((player) => (
              <button
                key={player.name}
                className="flex items-center space-x-4 p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <span className="text-3xl">👤</span>
                <div>
                  <div className="font-semibold">{player.name}</div>
                  <div className="text-sm text-gray-500">{player.team}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4">
            <button className="w-full max-w-md mx-auto block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Submit Prediction
            </button>
          </div>
        </div>

        {/* TODO: Load actual players from playoff teams */}
        {/* TODO: Show player stats and probabilities */}
        {/* TODO: Only enable after Finals matchup is set */}

        <div className="text-center text-gray-500 text-sm pt-4 border-t border-gray-200">
          <p>Player data will be loaded from backend in Step 2</p>
          <p className="mt-1">
            This prediction opens when Finals teams are determined
          </p>
        </div>
      </div>
    </div>
  );
};

export default MVPPrediction;
