import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { BiEditAlt } from 'react-icons/bi';
import {
  getAllArticles,
  getOwnArticles,
  journalistRequestEditAccess,
} from '../../../utils/requests/articlesRequest';
import SEO from '../../../utils/SEO';
import { iArticleType } from '../../../utils/types/Article';
import { formatDateTime } from '../../../utils/helpers/articleHelpers';
import AdminArticlesSubHeader from '../../../components/staff/admin/AdminArticlesSubHeader';

const AdminViewArticles = () => {
  const [articles, setArticles] = useState<iArticleType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('date');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const profileParsed = sessionStorage.getItem('profile');
  const profile = profileParsed ? JSON.parse(profileParsed) : {};

  const articlesPerPage = 15;

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response =
        profile?.role === 'Admin' || profile?.role === 'Editor'
          ? await getAllArticles()
          : await getOwnArticles();

      const message = response?.message || 'Failed to fetch articles';
      if (!response || response.status !== 200) throw new Error(message);

      setArticles(response.articles || response.data?.articles || []);
      setError('');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article: iArticleType) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedArticles = useMemo(() => {
    return [...filteredArticles].sort((a: iArticleType, b: iArticleType) => {
      if (sortOption === 'date') return b.createdAt.localeCompare(a.createdAt);
      if (sortOption === 'status') return a.status.localeCompare(b.status);
      if (sortOption === 'category')
        return a.category.localeCompare(b.category);
      return 0;
    });
  }, [filteredArticles, sortOption]);

  const pageCount = Math.ceil(sortedArticles.length / articlesPerPage);
  const offset = currentPage * articlesPerPage;
  const displayedArticles = sortedArticles.slice(
    offset,
    offset + articlesPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sendEditRequest = async (id: any) => {
    try {
      const response = await journalistRequestEditAccess(id);

      if (response.status !== 201) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <SEO mainData={{ title: 'Journalist View Articles - Kickside News' }} />
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Articles list</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          <AdminArticlesSubHeader />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 p-2">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 py-2.5 border border-blue-300 outline-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    />
                  </div>
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="py-2.5 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                >
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                  <option value="category">Sort by Category</option>
                </select>
              </div>
              {displayedArticles.length > 0 ? (
                <div className="overflow-x-auto max-w-full">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                          #
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                          Image
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider truncate max-w-[200px]">
                          Title
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[150px] truncate">
                          Category
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[200px] truncate">
                          Author
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                          Date
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                          Status
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {displayedArticles.map((article: iArticleType, index) => (
                        <tr
                          key={article?._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-10">
                            {offset + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap w-32">
                            <img
                              src={article?.coverImage}
                              alt={article?.title}
                              className="w-24 object-cover rounded-lg shadow-sm"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate">
                            <div className="text-sm font-medium text-gray-900">
                              {article?.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap max-w-[150px] truncate">
                            <div className="text-sm text-gray-900">
                              {article?.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate">
                            <div className="text-sm text-gray-900">
                              {article?.author
                                ? `${article.author.firstName} ${article.author.lastName}`
                                : 'Unknown'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-40">
                            {formatDateTime(article?.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm w-28">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                article?.status
                              )}`}
                            >
                              {article?.status || ''}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-40">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/staff/article/${article?._id}`}
                                title="View article"
                              >
                                <FiEye className="text-indigo-600 hover:text-indigo-800 transition" />
                              </Link>
                              {profile?.role === 'Journalist' &&
                                (article?.isEditable === false ? (
                                  <button
                                    onClick={() =>
                                      sendEditRequest(article?._id)
                                    }
                                    title="Request to edit article"
                                    className="text-primary hover:text-blue-700 transition"
                                  >
                                    <BiEditAlt />
                                  </button>
                                ) : (
                                  <Link
                                    to={`/staff/article/edit/${article?.slug}`}
                                    title="Edit article"
                                    className="text-green-600 hover:text-green-800 transition"
                                  >
                                    <FiEdit />
                                  </Link>
                                ))}
                              {(profile?.role === 'Editor' ||
                                profile?.role === 'Admin') && (
                                <Link
                                  to={`/staff/article/edit/${article?.slug}`}
                                  title="Edit article"
                                  className="text-green-600 hover:text-green-800 transition"
                                >
                                  <FiEdit />
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-6">
                    <ReactPaginate
                      previousLabel="← Previous"
                      nextLabel="Next →"
                      forcePage={currentPage}
                      pageCount={pageCount}
                      onPageChange={(event) => setCurrentPage(event.selected)}
                      containerClassName="flex justify-center items-center gap-2"
                      pageClassName="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                      activeClassName="bg-indigo-50 text-indigo-600 font-medium"
                      previousClassName="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                      nextClassName="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                      disabledClassName="opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No articles found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminViewArticles;
