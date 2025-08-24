import { useEffect, useState } from 'react';
import { getPlayerDetails } from '../../../utils/requests/tournaments/tournamentsRequests';
import { toast } from 'react-toastify';
import { calculateAge } from '../../../utils/helpers/tournamentsHelpers';
import { IPlayer } from '../../../utils/types/Tournaments';
import { Link, useParams } from 'react-router-dom';
import SEO from '../../../utils/SEO';
import { FaUsers, FaArrowLeft } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { formatDateTime } from '../../../utils/helpers/articleHelpers';

const PlayerDetails = () => {
  const [player, setPlayer] = useState<IPlayer | null>(null);
  const [playerTeams, setPlayerTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const response = await getPlayerDetails(id || '');
      if (response.status === 200) {
        setPlayer(response.data.player);
        setPlayerTeams(response.data.playerTeams);
      } else {
        throw new Error(response.message || 'Failed to fetch');
      }
    } catch (error: any) {
      toast.error(error.message || "Can't fetch player details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <SEO
        mainData={{
          title: `Player: ${player?.firstname || ''} ${
            player?.lastname || ''
          } details`,
          description: `Profile and career history of ${player?.firstname} ${player?.lastname}`,
        }}
      />

      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/staff/tr/setup"
            className="flex items-center text-blue-600 hover:underline gap-2"
          >
            <FaArrowLeft /> Back to Players
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-40">
            <AiOutlineLoading3Quarters className="animate-spin w-10 h-10 text-blue-600" />
          </div>
        )}

        {!loading && !player && (
          <div className="text-center text-gray-500 text-lg">
            Player not found
          </div>
        )}

        {player && (
          <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                {player.firstname?.[0]}
                {player.lastname?.[0]}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold">
                {player.firstname} {player.lastname}
              </h2>
              <p className="text-gray-600">Nationality: {player.nationality}</p>
              <p className="text-gray-600">
                Birthdate: {formatDateTime(player.birthdate)} (
                {calculateAge(player.birthdate)} years old)
              </p>
            </div>
          </div>
        )}

        {playerTeams?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaUsers /> Teams Played
            </h3>
            <div className="space-y-4">
              {playerTeams.map((item, i) => (
                <div
                  key={i}
                  className="bg-white shadow-md rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition"
                >
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border">
                    {item?.team?.logo ? (
                      <img
                        src={item.team.logo}
                        alt={item.team.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                        {item.team?.name?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.team?.name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(item.startDate)} →{' '}
                      {formatDateTime(item.endDate) || 'Present'}
                    </p>
                    <p
                      className={`text-xs mt-1 font-semibold ${
                        item.stillPlaying ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {item.stillPlaying ? 'Still Playing' : 'Inactive'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlayerDetails;
