import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiSlash } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { formatDateTime } from '../../utils/helpers/articleHelpers';
import SEO from '../../utils/SEO';
import { getAllUsers } from '../../utils/requests/usersRequest';
import { iAuthor } from '../../utils/types/User';

const AdminViewUsers = ({ profile }: { profile: any }) => {
  const [users, setUsers] = useState<iAuthor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const usersPerPage = 15;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers();
      console.log(response);
      if (response.status !== 200)
        throw new Error(response.message || 'Failed to fetch users');
      setUsers(response.data.workers || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile) fetchUsers();
  }, []);

  const filteredUsers = users.filter((user: any) =>
    user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a: any, b: any) => {
    if (sortOption === 'Date Joined')
      return b?.createdAt?.localeCompare(a?.createdAt);
    if (sortOption === 'firstName')
      return a?.firstName.localeCompare(b?.firstName);
    if (sortOption === 'lastName') return a?.lastName.localeCompare(b.lastName);
    if (sortOption === 'role') return a?.role?.localeCompare(b?.role);
    return 0;
  });

  const pageCount = Math.ceil(sortedUsers.length / usersPerPage);
  const offset = currentPage * usersPerPage;
  const displayedUsers = sortedUsers.slice(offset, offset + usersPerPage);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <SEO mainData={{ title: 'View Users - Kickside News' }} />
      <ToastContainer />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            👥 Users Management
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-300">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <div className="relative w-full md:w-1/2">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                  />
                </div>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="text-sm py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                >
                  <option value="Date Joined">Sort by Date Joined</option>
                  <option value="firstName">Sort by First Name</option>
                  <option value="lastName">Sort by Last Name</option>
                  <option value="role">Sort by Role</option>
                </select>
              </div>

              {displayedUsers.length > 0 ? (
                <>
                  <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="min-w-full text-sm text-gray-700">
                      <thead className="bg-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                        <tr>
                          <th className="px-4 py-3 text-left">#</th>
                          <th className="px-4 py-3 text-left">Names</th>
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-left">Role</th>
                          <th className="px-4 py-3 text-left">Joined</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {displayedUsers.map((user, index) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{offset + index + 1}</td>
                            <td className="px-4 py-2">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="px-4 py-2">
                              <Link
                                to={`mailto:${user.email}`}
                                className="text-blue-600 hover:underline"
                              >
                                {user.email}
                              </Link>
                            </td>
                            <td className="px-4 py-2 capitalize">
                              {user.role}
                            </td>
                            <td className="px-4 py-2">
                              {formatDateTime(user.createdAt)}
                            </td>
                            <td className="px-4 py-2">
                              {user.isDisabled ? (
                                <span className="flex items-center text-red-600">
                                  <FiSlash className="mr-1" />
                                  Disabled{' '}
                                  {user.disableReason && (
                                    <span className="ml-1 italic text-xs text-gray-500">
                                      ({user.disableReason})
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span className="text-green-600 font-medium">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <Link
                                to={`/admin/user/${user._id}`}
                                className="text-indigo-600 hover:underline flex items-center gap-1"
                              >
                                <FiEye className="text-sm" /> View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <ReactPaginate
                      previousLabel="←"
                      nextLabel="→"
                      pageCount={pageCount}
                      onPageChange={({ selected }) => setCurrentPage(selected)}
                      containerClassName="flex items-center gap-2 text-sm"
                      pageClassName="px-3 py-1 border rounded-md hover:bg-gray-100"
                      activeClassName="bg-indigo-500 text-white"
                    />
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-sm text-gray-500">
                  No users found.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminViewUsers;
