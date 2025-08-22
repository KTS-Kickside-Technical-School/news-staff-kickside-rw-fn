import { useEffect, useState } from 'react';
import { getPlayers } from '../../../utils/requests/tournaments/tournamentsRequests';
import { toast } from 'react-toastify';
import { calculateAge } from '../../../utils/helpers/tournamentsHelpers';
import PlayerAddTeam from './PlayerAddTeam';
import { IPlayer } from '../../../utils/types/Tournaments';
import { Link } from 'react-router-dom';

const PlayersList = () => {
  const [data, setData] = useState<IPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPLayer] = useState<IPlayer | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getPlayers();
      if (response.status === 200) {
        setData(response.data);
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching Players');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">View Players</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">Names</th>
              <th className="px-4 py-2 border-b">Nationality</th>
              <th className="px-4 py-2 border-b">Age</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {Array.from({ length: 7 }).map((__, i) => (
                      <td
                        key={i}
                        className="px-4 py-2 border-b bg-gray-200 h-6 rounded"
                      />
                    ))}
                  </tr>
                ))
              : data.map((item, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">
                      {item.firstname} {item.lastname}
                    </td>
                    <td className="px-4 py-2 border-b">{item.nationality}</td>
                    <td className="px-4 py-2 border-b">
                      {calculateAge(item.birthdate)}
                    </td>
                    <td className="px-4 py-2 border-b flex gap-2">
                      <button onClick={() => setSelectedPLayer(item)}>
                        Assign team
                      </button>
                      <Link to={`/staff/tr/setup/player/${item._id}`}>
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  No players found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedPlayer && (
        <PlayerAddTeam
          player={selectedPlayer}
          onClose={() => setSelectedPLayer(null)}
        />
      )}
    </div>
  );
};

export default PlayersList;
