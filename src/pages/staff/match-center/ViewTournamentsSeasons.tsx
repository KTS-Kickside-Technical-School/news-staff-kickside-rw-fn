import { useEffect, useState } from 'react';
import {
  getAllTournamentsSeasons,
  setFeaturedTournamentSeason,
} from '../../../utils/requests/tournaments/tournamentsRequests';
import { ITrSeason } from '../../../utils/types/Tournaments';
import { toast } from 'react-toastify';
import { FaPlus, FaEye } from 'react-icons/fa';
import NewTournamentMatchModal from '../../../component/staff/match-center/NewTournamentMatchModal';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import SEO from '../../../utils/SEO';

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
      console.log(response.data);
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

  const handleToggleFeatured = async (slug: string) => {
    try {
      const response = await setFeaturedTournamentSeason(slug);
      console.log(response);
      if (response.status === 200) {
        const updatedSeason = response.data;
        setData((prev) =>
          prev.map((season) => ({
            ...season,
            isFeatured: season._id === updatedSeason._id,
          }))
        );

        toast.success('Season set as latest successfully');
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message || 'Error updating featured status');
    }
  };

  return (
    <>
      <SEO
        mainData={{
          title: 'View Tournaments Seasons - Kickside News',
          description: 'View Tournaments Seasons',
        }}
      />
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
          Tournament Seasons
        </h2>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-thin">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all shadow-sm ${
                filter === s
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full bg-gray-100 animate-pulse rounded-xl h-40"
                />
              ))
            : filteredData.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 sm:p-5 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={item?.tournament?.logo}
                      alt="logo"
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full border"
                    />
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {item.year.name}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full font-medium ${
                        item.status === 'Ongoing'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'Upcoming'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm text-gray-700 mb-6">
                    <div className="flex flex-col items-start">
                      <span className="uppercase text-[10px] sm:text-[11px] text-gray-500 tracking-wide">
                        Start Date
                      </span>
                      <span className="font-semibold text-gray-800">
                        {format(new Date(item.startDate), 'dd MMM yyyy')}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="uppercase text-[10px] sm:text-[11px] text-gray-500 tracking-wide">
                        End Date
                      </span>
                      <span className="font-semibold text-gray-800">
                        {format(new Date(item.endDate), 'dd MMM yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-auto">
                    <Link
                      to={`/staff/tr/seasons/${encodeURIComponent(
                        item.slug || ''
                      )}`}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-xs sm:text-sm"
                    >
                      <FaEye size={14} /> View
                    </Link>
                    <button
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-xs sm:text-sm"
                      onClick={() => setSelectedTournament(item)}
                    >
                      <FaPlus size={14} /> New Match
                    </button>
                    <div className="flex items-center justify-between sm:justify-start gap-2">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={item.isFeatured}
                        onClick={() => handleToggleFeatured(item.slug || '')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                          item.isFeatured ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            item.isFeatured ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {item.isFeatured ? 'Featured' : 'Not featured'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

          {!loading && filteredData.length === 0 && (
            <p className="text-gray-500 text-center col-span-full">
              No tournament seasons found.
            </p>
          )}
        </div>

        {selectedTournament && (
          <NewTournamentMatchModal
            tournament={selectedTournament}
            onClose={() => setSelectedTournament(null)}
          />
        )}
      </div>
    </>
  );
};

export default ViewTournamentsSeasons;
