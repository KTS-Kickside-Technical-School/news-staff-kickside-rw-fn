import { useState, useEffect } from 'react';
import { FiCheckCircle, FiEdit, FiTrash2, FiUser, FiEye } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import {
  staffGetSingleArticle,
  staffToggleArticlePublish,
  staffDeleteArticle,
} from '../../utils/requests/articlesRequest';
import { BiCalendar, BiCategory } from 'react-icons/bi';
import { formatDateTime } from '../../utils/helpers/articleHelpers';
import { GrStatusInfo } from 'react-icons/gr';
import { iArticleType } from '../../utils/types/Article';

const StaffViewArticleDetails = ({ profile }: any) => {
  const [article, setArticle] = useState<iArticleType | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams<{ id: string }>();
  const userRole = profile?.role;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await staffGetSingleArticle(id || '');
        if (response?.data?.article) {
          setArticle(response.data.article);
          setComments(response.data.comments || []);
        } else {
          toast.error('Article not found!');
        }
      } catch {
        toast.error('Failed to load article.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const toggleArticlePublish = async () => {
    setIsLoading(true);
    try {
      const response = await staffToggleArticlePublish(id || '');
      if (response.status === 200) {
        toast.success('Article status updated successfully!');
        setArticle(response.data.article);
      } else toast.error('Failed to update article status.');
    } catch {
      toast.error('Failed to update article status.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async () => {
    setIsLoading(true);
    try {
      const response = await staffDeleteArticle(id || '');
      if (response.status === 200) {
        toast.success('Article deleted successfully!');
        navigate('/staff/articles');
      } else toast.error('Failed to delete article.');
    } catch {
      toast.error('Failed to delete article.');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="p-4 text-sm bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="bg-white rounded-md shadow p-6 max-w-6xl mx-auto">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-24 bg-gray-300 rounded"></div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between border-b pb-3 mb-4">
              <h1 className="text-xl font-semibold text-gray-800 leading-snug flex items-center gap-2">
                <FiEdit /> {article?.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {(userRole === 'Admin' || userRole === 'Editor') && (
                  <>
                    {article?.status === 'unpublished' ? (
                      <button
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        onClick={toggleArticlePublish}
                      >
                        <FiCheckCircle /> Publish
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={toggleArticlePublish}
                      >
                        <FiEdit /> Unpublish
                      </button>
                    )}

                    {userRole === 'Admin' && (
                      <button
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-center gap-2">
                <FiUser className="text-gray-500" />
                <strong>Author:</strong> {article?.author.firstName}{' '}
                {article?.author.lastName}
              </div>
              <div className="flex items-center gap-2">
                <GrStatusInfo className="text-gray-500" />
                <strong>Status:</strong> {article?.status}
              </div>
              <div className="flex items-center gap-2">
                <BiCalendar className="text-gray-500" />
                <strong>Published:</strong> {formatDateTime(article?.createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <BiCategory className="text-gray-500" />
                <strong>Category:</strong> {article?.category}
              </div>
              <div className="flex items-center gap-2">
                <FiEye className="text-gray-500" />
                <strong>Views:</strong> {article?.views || 0}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                Cover Image
              </h2>
              <img
                src={article?.coverImage}
                alt="cover"
                className="w-full max-h-96 object-cover rounded-md"
              />
            </div>

            <div className="mt-6">
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                Content
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: article?.content || '' }}
              ></div>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Comments
              </h3>
              {comments.length > 0 ? (
                <ul className="space-y-3">
                  {comments.map((comment, idx) => (
                    <li key={idx} className="border p-3 rounded-md bg-gray-100">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          {comment.names}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700 text-sm">
                        {comment.comment}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
          </>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              This action is irreversible. Do you really want to delete this
              article?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-1 text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                onClick={deleteArticle}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffViewArticleDetails;
