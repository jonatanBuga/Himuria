import { useParams } from 'react-router-dom';

const GameDetail = () => {
  const { gameId } = useParams();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Game #{gameId}</h1>
        <p className="text-gray-600">Lakers vs Warriors</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        {/* Score Display */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-4xl">🏀</span>
              <span className="text-xl font-semibold">Lakers</span>
              <span className="text-4xl font-bold text-blue-600">98</span>
            </div>

            <div className="text-2xl font-bold text-gray-400">VS</div>

            <div className="flex flex-col items-center space-y-2">
              <span className="text-4xl">🏀</span>
              <span className="text-xl font-semibold">Warriors</span>
              <span className="text-4xl font-bold text-blue-600">95</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full">
              LIVE
            </span>
            <span>Q4 - 2:45 remaining</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="pt-6 border-t border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Game Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">45%</div>
              <div className="text-sm text-gray-600">FG%</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">38%</div>
              <div className="text-sm text-gray-600">3P%</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">42</div>
              <div className="text-sm text-gray-600">REB</div>
            </div>
          </div>
        </div>

        {/* Community Predictions */}
        <div className="pt-6 border-t border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Community Predictions
          </h3>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Lakers to win</span>
              <span className="font-semibold text-blue-600">68%</span>
            </div>
          </div>
        </div>

        {/* TODO: Load real game data from NBA API */}
        {/* TODO: Show live updates via Supabase subscriptions */}
        {/* TODO: Add play-by-play feed */}
        {/* TODO: Show user's prediction for this game */}

        <div className="text-center text-gray-500 text-sm pt-4 border-t border-gray-200">
          <p>Live game data will be integrated in Step 3</p>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
