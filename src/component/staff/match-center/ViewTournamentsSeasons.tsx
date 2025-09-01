import { useEffect, useState } from 'react';
import { getAllTournamentsSeasons } from '../../../utils/requests/tournaments/tournamentsRequests';
import { ITrSeason } from '../../../utils/types/Tournaments';
import { toast } from 'react-toastify';
import { FaPlus, FaEye } from 'react-icons/fa';
import NewTournamentMatchModal from './NewTournamentMatchModal';

const STATUS_FILTERS = ['All', 'Ongoing', 'Upcoming', 'Completed'] as const;

const ViewTournamentsSeasons = () => {
  const [data, setData] = useState<ITrSeason[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>('All');
  const [selectedTournament, setSelectedTournament] =
    useState<ITrSeason | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllTournamentsSeasons();

      if (response.status === 200) {
        setData(response.data);
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching tournaments seasons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = (
    filter === 'All' ? data : data.filter((d) => d.status === filter)
  ).sort((a, b) => (a.isLatest === b.isLatest ? 0 : a.isLatest ? -1 : 1));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">View Tournament Seasons</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">Tournament</th>
              <th className="px-4 py-2 border-b">Year</th>
              <th className="px-4 py-2 border-b">Teams</th>
              <th className="px-4 py-2 border-b">Start Date</th>
              <th className="px-4 py-2 border-b">End Date</th>
              <th className="px-4 py-2 border-b">Is latest</th>
              <th className="px-4 py-2 border-b">Status</th>
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
              : filteredData.map((item, idx) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 border-b">{idx + 1}</td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex items-center gap-3">
                        <img
                          src={item?.tournament?.logo}
                          alt={`${item?.tournament?.name || 'Tournament'} logo`}
                          className="w-10 h-10 object-contain rounded"
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-2 border-b">{item.year.name}</td>
                    <td className="px-4 py-2 border-b">{item.teams.length}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(item.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {item?.isLatest ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`px-4 py-2 border-b font-semibold ${
                          item.status === 'Ongoing'
                            ? 'text-green-700 bg-green-100'
                            : item.status === 'Upcoming'
                            ? 'text-blue-700 bg-blue-100'
                            : 'text-gray-700 bg-gray-100'
                        } rounded`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b flex gap-2">
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        onClick={() => toast.info(`Viewing ${item.name}`)}
                      >
                        <FaEye size={14} /> View
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        onClick={() => setSelectedTournament(item)}
                      >
                        <FaPlus size={14} /> New Match
                      </button>
                    </td>
                  </tr>
                ))}
            {!loading && filteredData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  No tournament seasons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedTournament && (
        <NewTournamentMatchModal
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
        />
      )}
    </div>
  );
};

export default ViewTournamentsSeasons;
