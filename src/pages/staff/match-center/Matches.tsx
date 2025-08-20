import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SEO from '../../../utils/SEO';
import { getMatches } from '../../../utils/requests/tournaments/tournamentsRequests';
import { ITrMatch } from '../../../utils/types/Tournaments';
import { FaEye, FaEdit } from 'react-icons/fa';

const Matches = () => {
  const [data, setData] = useState<ITrMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getMatches();
      if (response.status === 200) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error fetching matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <>
      <SEO mainData={{ title: 'Matches List - Kickside News' }} />

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-blue-600 mb-6">
          Matches List
        </h1>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Home Team</th>
                <th className="px-4 py-2 border-b">Away Team</th>

                <th className="px-4 py-2 border-b">Home Goals</th>
                <th className="px-4 py-2 border-b">Away Goals</th>
                <th className="px-4 py-2 border-b">Date & Time</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {Array.from({ length: 9 }).map((__, i) => (
                      <td
                        key={i}
                        className="px-4 py-3 border-b bg-gray-200 h-6 rounded"
                      />
                    ))}
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((item: ITrMatch, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b font-medium text-gray-700">
                      {item.homeTeam?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-2 border-b font-medium text-gray-700">
                      {item.awayTeam?.name || 'N/A'}
                    </td>

                    <td className="px-4 py-2 border-b text-center">
                      {item?.homeScore ?? '-'}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      {item?.awayScore ?? '-'}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {formatDateTime(item.matchTime)}
                    </td>

                    <td className="px-4 py-2 border-b">
                      <span
                        className={`px-2 py-1 rounded text-sm font-semibold  ${
                          item.status === 'in_progress'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-700'
                            : item.status === 'finished'
                            ? 'bg-gray-200 text-gray-800'
                            : item.status === 'postponed'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item?.status?.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-2 border-b flex gap-2">
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        onClick={() => toast.info(`Viewing match ${item._id}`)}
                      >
                        <FaEye size={14} /> View
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                        onClick={() => toast.info(`Editing match ${item._id}`)}
                      >
                        <FaEdit size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No matches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Matches;
