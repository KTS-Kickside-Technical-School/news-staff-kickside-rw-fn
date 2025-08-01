import { useEffect, useState } from 'react';
import { getSubscribersList } from '../../utils/requests/newsLetterRequests';
import { toast, ToastContainer } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SEO from '../../utils/SEO';
import { formatDateTime } from '../../utils/helpers/articleHelpers';
import ReactPaginate from 'react-paginate';

const AdminMailingList = () => {
  const [data, setData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const usersPerPage = 15;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getSubscribersList();

      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to fetch users');
      }

      setData(response.data.subscribers || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((row: any) =>
    row.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a: any, b: any) => {
    if (sortOption === 'Subscription Date')
      return b.createdAt.localeCompare(a.createdAt);
    if (sortOption === 'email') return a.email.localeCompare(b.email);
    return 0;
  });

  const pageCount = Math.ceil(sortedData.length / usersPerPage);
  const offset = currentPage * usersPerPage;
  const displayedData = sortedData.slice(offset, offset + usersPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <SEO mainData={{ title: 'Admin View Mailing List - Kickside News' }} />
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mailing List</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 py-2.5 border border-blue-300 outline-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    />
                  </div>
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="py-2.5 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 border-primary outline-0"
                >
                  <option value="Mailing date">
                    Sort by Subscription Date
                  </option>
                  <option value="email">Sort by Email</option>
                </select>
              </div>

              {displayedData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mailing date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedData.map((inquiry: any, index) => (
                        <tr
                          key={inquiry._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {offset + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link to={`mailto: ${inquiry.email}`}>
                              {inquiry.email}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(inquiry.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {inquiry.status === 'pending' ? (
                              <span className="flex text-red-600">Pending</span>
                            ) : (
                              <span className="text-green-600">Solved</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-6">
                    <ReactPaginate
                      previousLabel="← Previous"
                      nextLabel="Next →"
                      pageCount={pageCount}
                      onPageChange={(event) => setCurrentPage(event.selected)}
                      containerClassName="flex justify-center items-center gap-2"
                      pageClassName="px-3 py-1 border rounded-lg cursor-pointer hover:bg-gray-200"
                      activeClassName="bg-indigo-500 text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-gray-500">
                  No data found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMailingList;
