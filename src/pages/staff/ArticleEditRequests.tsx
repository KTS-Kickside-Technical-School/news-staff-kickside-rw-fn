import { useState, useEffect } from 'react';
import { FiCheck, FiEye } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import {
  getArticleEditRequests,
  approveEditRequest,
} from '../../utils/requests/articlesRequest'; // Adjust the import based on your actual requests
import { iArticleType } from '../../utils/types/Article';
import ReactPaginate from 'react-paginate';
import { formatDateTime } from '../../utils/helpers/articleHelpers';
import { Link } from 'react-router-dom';

const ArticleEditRequests = () => {
  const [editRequests, setEditRequests] = useState<iArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const requestsPerPage = 10;

  const fetchEditRequests = async () => {
    try {
      setIsLoading(true);
      const response = await getArticleEditRequests();

      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to fetch edit requests');
      }

      setEditRequests(response.data.editRequests || []);
      setError('');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEditRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const response = await approveEditRequest(id);
      if (response.status !== 200) {
        throw new Error(response?.message || 'Failed to approve request');
      }
      toast.success('Edit request approved successfully');
      fetchEditRequests();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const pageCount = Math.ceil(editRequests.length / requestsPerPage);
  const offset = currentPage * requestsPerPage;
  const displayedRequests = editRequests.slice(
    offset,
    offset + requestsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="max-w-8xl mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : displayedRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedRequests.map((article: any, index) => (
                  <tr
                    key={article._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {offset + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {article.article.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {article.journalist.firstName}{' '}
                        {article.journalist.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(article.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
      ${
        article?.isAccepted
          ? 'bg-green-100 text-green-700'
          : 'bg-yellow-100 text-yellow-700'
      }
    `}
                      >
                        {article?.isAccepted ? 'Accepted' : 'Waiting'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <Link
                          className="text-blue-600 hover:text-blue-900"
                          title="View Article"
                          to={`/staff/article/${article.article._id}`}
                        >
                          <FiEye />
                        </Link>
                        {article.isAccepted === false && (
                          <button
                            onClick={() => handleApprove(article._id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <FiCheck className="w-5 h-5" />
                          </button>
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
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No edit requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleEditRequests;
