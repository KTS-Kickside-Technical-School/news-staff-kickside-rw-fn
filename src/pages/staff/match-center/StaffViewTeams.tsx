import { FaPlus, FaEdit, FaTrash, FaGlobe } from 'react-icons/fa';
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

const StaffViewTeams = () => {
  const [openNewForm, setOpenNewForm] = useState(false);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<ITeam[]>();
  const handleSaveTeam = async (data: ITeam) => {
    try {
      const response = await saveTeam(data);

      if (!response) {
        throw new Error('No response received from server');
      }

      if (response.status === 201 && response.data) {
        setData((prev) => {
          if (!prev) return [response.data];
          return [
            response.data,
            ...prev.filter((team) => team._id !== response.data._id),
          ];
        });

        toast.success('Team saved successfully');
        setOpenNewForm(false);
        return response.data;
      }

      const errorMessage =
        response.message || 'Failed to save team. Please try again.';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } catch (error) {
      console.error('Error saving team:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to save team. Please try again.';
      toast.error(errorMessage);
      return { error: true, message: errorMessage };
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await getCountries();
      if (response.status === 200) {
        setCountries(response?.data);
        return;
      }
      throw new Error(response.message || 'Failed to fetch countries');
    } catch (error: any) {
      console.error('Error fetching countries:', error);
      toast.error(
        error.message || 'Failed to fetch countries. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

      const response = await getTeams();

      if (response.status === 200) {
        setData(response?.data);
        return;
      }
      throw new Error(response.message || 'Failed to fetch countries');
    } catch (error: any) {
      console.error('Error fetching countries:', error);
      toast.error(
        error.message || 'Failed to fetch countries. Please try again.'
      );
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
  };

  useEffect(() => {
    fetchCountries();
    fetchData();
  }, []);

  return (
    <>
      <SEO
        mainData={{
          title: 'Teams - Kickside Rwanda',
          description: 'View and manage teams in the Kickside News system.',
        }}
      />
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 mt-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">Teams list</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`p-2 rounded-full hover:bg-gray-100 transition ${
                refreshing ? 'animate-spin' : ''
              }`}
              title="Refresh countries"
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-8 h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="ml-auto flex gap-4">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : data?.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <FaGlobe size={48} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No teams found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first team
              </p>
              <button
                onClick={() => setOpenNewForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mx-auto"
              >
                <FaPlus /> Add Country
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="px-6 py-3 font-medium">#</th>
                    <th className="px-6 py-3 font-medium">Logo</th>
                    <th className="px-6 py-3 font-medium">Country</th>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.map((team, index) => (
                    <tr
                      key={team?._id || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">
                        <img
                          src={team?.logo}
                          alt={team?.name}
                          className="w-8 h-8 object-cover rounded-sm shadow-xs border border-gray-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://via.placeholder.com/32x24?text=Flag';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono">
                        {team?.country?.name}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {team?.name}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => console.log('Edit')}
                            className="text-blue-500 hover:text-blue-700 transition p-1 rounded-full hover:bg-blue-50"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => console.log('Delete')}
                            className="text-red-500 hover:text-red-700 transition p-1 rounded-full hover:bg-red-50"
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
