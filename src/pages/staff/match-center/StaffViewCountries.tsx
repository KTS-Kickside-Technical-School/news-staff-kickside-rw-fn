import { FaPlus, FaEdit, FaTrash, FaGlobe } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import MatchCenterSubNavbar from '../../../component/staff/match-center/MatchCenterSubNavbar';
import SEO from '../../../utils/SEO';
import NewCountry from '../../../component/staff/match-center/NewCountry';
import { useEffect, useState } from 'react';
import {
  getCountries,
  saveCountry,
} from '../../../utils/requests/tournaments/countriesRequest';
import { toast } from 'react-toastify';
import { ICountry } from '../../../utils/types/Tournaments';

const StaffViewCountries = () => {
  const [openNewForm, setOpenNewForm] = useState(false);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleSaveCountry = async (countryData: ICountry) => {
    try {
      const response = await saveCountry(countryData);

      if (response.status === 201) {
        setCountries((prev) => [response.data, ...prev]);
        toast.success('Country saved successfully');
        setOpenNewForm(false);
        return;
      }
      toast.error(
        response.message || 'Failed to save country. Please try again.'
      );
    } catch (error) {
      console.error('Error saving country:', error);
      toast.error('Failed to save country. Please try again.');
      throw error;
    }
  };

  const fetchData = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

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
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <SEO
        mainData={{
          title: 'Countries - Kickside Rwanda',
          description:
            'View and manage countries in the Kickside Rwanda system.',
        }}
      />
      <div className="p-4 md:p-6">
        <MatchCenterSubNavbar />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 mt-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">Countries</h1>
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
            <FaPlus /> Add Country
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
          ) : countries?.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <FaGlobe size={48} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No countries found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first country
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
                    <th className="px-6 py-3 font-medium">Flag</th>
                    <th className="px-6 py-3 font-medium">Country</th>
                    <th className="px-6 py-3 font-medium">Code</th>
                    <th className="px-6 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {countries?.map((country, index) => (
                    <tr
                      key={country?._id || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">
                        <img
                          src={country?.flagUrl}
                          alt={country?.name}
                          className="w-8 h-6 object-cover rounded-sm shadow-xs border border-gray-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://via.placeholder.com/32x24?text=Flag';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {country?.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono">
                        {country?.code?.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => console.log('Edit', country)}
                            className="text-blue-500 hover:text-blue-700 transition p-1 rounded-full hover:bg-blue-50"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => console.log('Delete', country)}
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
        <NewCountry
          onClose={() => setOpenNewForm(false)}
          onSave={handleSaveCountry}
        />
      )}
    </>
  );
};

export default StaffViewCountries;
