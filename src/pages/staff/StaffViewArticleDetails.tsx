import { useState, useEffect } from 'react';
import { FiCheckCircle, FiEdit, FiTrash2 } from 'react-icons/fi';
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

  const fetchSingleArticle = async () => {
    try {
      const response = await staffGetSingleArticle(id || '');

      if (response?.data?.article) {
        setArticle(response.data.article);
        if (response?.data?.comments) {
          setComments(response.data.comments);
        }
      } else {
        toast.error('Article not found!');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Failed to load article.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleArticle();
  }, [id]);

  const toggleArticlePublish = async () => {
    setIsLoading(true);
    try {
      const response = await staffToggleArticlePublish(id || '');
      if (response.status === 200) {
        toast.success('Article status updated successfully!');
        setArticle(response.data.article);
      } else {
        toast.error('Failed to update article status.');
      }
    } catch (error) {
      console.error('Error updating article status:', error);
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
      } else {
        toast.error('Failed to delete article.');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article.');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="bg-white shadow-xl rounded-lg p-8 transition-all duration-300 ease-in-out max-w-4xl mx-auto">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>
            <div className="h-36 bg-gray-300 rounded mb-6"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {article?.title}
              </h1>
              <div className="flex gap-3">
                {(userRole === 'Admin' || userRole === 'Editor') && (
                  <>
                    {article?.status === 'unpublished' ? (
                      <button
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
                        title="Publish Article"
                        onClick={toggleArticlePublish}
                      >
                        <FiCheckCircle /> Publish
                      </button>
                    ) : article?.status === 'published' ? (
                      <button
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                        title="Unpublish Article"
                        onClick={toggleArticlePublish}
                      >
                        <FiEdit /> Unpublish
                      </button>
                    ) : null}

                    {userRole === 'Admin' && (
                      <button
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
                        title="Delete Article"
                        onClick={() => setShowDeleteModal(true)} // Open the delete confirmation modal
                      >
                        <FiTrash2 /> Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mb-8 space-y-4">
              <div className="flex items-center text-gray-700">
                <FiEdit className="mr-2 text-lg" />
                <span className="font-semibold">Author:</span>{' '}
                {article?.author.firstName} {article?.author.lastName}
              </div>
              <div
                className={`flex items-center text-gray-700 ${
                  article?.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : article?.status === 'unpublished'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-700'
                } p-2 rounded-md`}
              >
                <GrStatusInfo className="mr-2 text-lg" />
                <span className="font-semibold">Status:</span> {article?.status}
              </div>

              <div className="flex items-center text-gray-700">
                <BiCalendar className="mr-2 text-lg" />
                <span className="font-semibold">Published:</span>{' '}
                {article?.createdAt ? formatDateTime(article.createdAt) : ''}
              </div>
              <div className="flex items-center text-gray-700">
                <BiCategory className="mr-2 text-lg" />
                <span className="font-semibold">Category:</span>{' '}
                {article?.category}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Cover image:
              </h2>
              <img
                className="w-full h-65 object-cover rounded-lg"
                src={article?.coverImage}
                alt="Article Cover Image"
              />
            </div>
            <div className="mt-3">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Content:
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article?.content || '' }}
              ></p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Comments:
              </h3>
              {comments.length > 0 ? (
                <ul>
                  {comments.map((comment, index) => (
                    <li key={index} className="mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">
                          {comment.names}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {formatDateTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-2">{comment.comment}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No comments yet.</p>
              )}
            </div>
          </>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure?
            </h2>
            <p className="text-gray-700 mb-6">
              This action is irreversible. Do you really want to delete this
              article?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
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
