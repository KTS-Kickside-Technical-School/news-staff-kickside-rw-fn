const TeamPlayerInfo = ({ player }: any) => {
  return (
    <div>
      <div
        key={player?.player?._id}
        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col gap-4 border border-gray-100"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <img
              src={player?.player?.image || '/api/placeholder/80/80'}
              alt="Player"
              className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {player?.player?.firstname} {player?.player?.lastname}
              </h3>
              {player?.player?.position && (
                <p className="text-sm text-gray-500">
                  {player.player.position}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
          {player?.player?.nationality && (
            <div className="flex items-center gap-2">
              <img
                src={player.player.nationality.flagUrl}
                alt={player.player.nationality.name}
                className="w-5 h-4 object-cover rounded-sm border"
              />
              <span>{player.player.nationality.name}</span>
            </div>
          )}
          {player?.player?.dateOfBirth && (
            <div>
              <span className="font-medium">Age:</span>{' '}
              {Math.floor(
                (new Date().getTime() -
                  new Date(player.player.dateOfBirth).getTime()) /
                  3.15576e10
              )}{' '}
              yrs
            </div>
          )}
          {player?.player?.height && (
            <div>
              <span className="font-medium">Height:</span>{' '}
              {player.player.height} cm
            </div>
          )}
          {player?.player?.weight && (
            <div>
              <span className="font-medium">Weight:</span>{' '}
              {player.player.weight} kg
            </div>
          )}
        </div>

        {/* Stints Section */}
        <div className="space-y-4">
          {player.stints.map((stint: any, idx: number) => (
            <div
              key={idx}
              className="rounded-xl bg-gray-50 border border-gray-200 p-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  Contract #{idx + 1}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stint.isStillPlaying
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {stint.isStillPlaying ? 'Active' : 'Completed'}
                </span>
              </div>

              {/* Jersey + Position */}
              <div className="flex flex-wrap gap-2 mb-3">
                {stint?.jerseyNumber && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-semibold">
                    #{stint.jerseyNumber}
                  </span>
                )}
                {stint?.position && (
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-xs">
                    {stint.position}
                  </span>
                )}
              </div>

              {/* Value */}
              {stint?.playerValue && (
                <div className="text-sm font-semibold text-green-600 mb-2">
                  Market Value: RWF {stint.playerValue.toLocaleString()}
                </div>
              )}

              {/* Dates */}
              <div className="text-xs text-gray-600 flex justify-between">
                <span>
                  {new Date(stint.contractStartDate).toLocaleDateString()} →{' '}
                  {stint.isStillPlaying
                    ? 'Present'
                    : new Date(stint.constractEndDate).toLocaleDateString()}
                </span>
                {stint.duration && (
                  <span className="text-blue-600 font-medium">
                    {stint.duration}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPlayerInfo;
