import { FaPlus, FaGlobe } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import SEO from '../../../utils/SEO';
import { useEffect, useState } from 'react';
import { getCountries } from '../../../utils/requests/tournaments/countriesRequest';
import { toast } from 'react-toastify';
import { ICountry, ITeam } from '../../../utils/types/Tournaments';
import NewTeam from '../../../component/staff/match-center/NewTeam';
import {
  getTeams,
  saveTeam,
} from '../../../utils/requests/tournaments/teamsRequests';
import { Link } from 'react-router-dom';

const StaffViewTeams = () => {
  const [openNewForm, setOpenNewForm] = useState(false);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<ITeam[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  const handleSaveTeam = async (data: ITeam) => {
    try {
      const response = await saveTeam(data);
      if (response?.status === 201 && response.data) {
        setData((prev) => [
          response.data,
          ...prev.filter((t) => t._id !== response.data._id),
        ]);
        toast.success('Team saved successfully');
        setOpenNewForm(false);
        return response.data;
      }
      throw new Error(response.message || 'Failed to save team');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save team');
      return { error: true, message: error.message };
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await getCountries();
      if (response.status === 200) setCountries(response.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch countries');
    }
  };

  const fetchData = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const response = await getTeams();
      if (response.status === 200) setData(response.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch teams');
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchData();
  }, []);

  // Apply filters
  const filteredTeams = data.filter((team) => {
    const matchesSearch = team.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCountry =
      selectedCountry === 'all' || team.country?._id === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <>
      <SEO
        mainData={{
          title: 'Teams - Kickside Rwanda',
          description: 'View and manage teams in the Kickside News system.',
        }}
      />

      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 mt-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">Teams</h1>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className={`p-2 rounded-full hover:bg-gray-100 transition ${
                refreshing ? 'animate-spin' : ''
              }`}
              title="Refresh teams"
            >
              <FiRefreshCw
                size={18}
                className={refreshing ? 'text-blue-500' : 'text-gray-500'}
              />
            </button>
          </div>
          <button
            onClick={() => setOpenNewForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            <FaPlus /> Add Team
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by team name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Countries</option>
            {countries.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Teams Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-4 animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <FaGlobe size={48} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No teams found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or add a new team.
            </p>
            <button
              onClick={() => setOpenNewForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mx-auto"
            >
              <FaPlus /> Add Team
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTeams.map((team, index) => (
              <Link
                to={`/staff/tr/teams/${team._id}`}
                key={team._id || index}
                className="bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 p-4 relative group"
              >
                <div className="flex justify-center mb-4">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-20 h-20 object-cover rounded-full border shadow-sm"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/80')
                    }
                  />
                </div>

                <h3 className="text-lg font-bold text-center text-gray-800">
                  {team.name}
                </h3>
                <p className="text-center text-sm text-gray-500">
                  {team.country?.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {openNewForm && (
        <NewTeam
          onClose={() => setOpenNewForm(false)}
          onSave={handleSaveTeam}
          countries={countries}
        />
      )}
    </>
  );
};

export default StaffViewTeams;
