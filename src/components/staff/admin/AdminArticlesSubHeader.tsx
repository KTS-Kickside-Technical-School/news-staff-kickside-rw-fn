import { FiEdit } from 'react-icons/fi';
import { PiArticleNyTimes } from 'react-icons/pi';
import { Link } from 'react-router-dom';

interface AdminArticlesSubHeaderProps {}
const AdminArticlesSubHeader = ({}: AdminArticlesSubHeaderProps) => {
  return (
    <div className="m-2">
      <div className="flex flex-col sm:flex-row gap-4 px-5 py-4 mb-3 bg-gray-100 rounded-lg shadow-md">
        <Link
          to="/admin/articles/view"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200"
        >
          <PiArticleNyTimes className="text-xl" />
          <span className="font-medium">View Own Articles</span>
        </Link>
        <Link
          to="/staff/articles/admin-view-own-articles"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200"
        >
          <PiArticleNyTimes className="text-xl" />
          <span className="font-medium">View Own Articles</span>
        </Link>
        <Link
          to="/staff/articles/edit-requests"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200"
        >
          <FiEdit className="text-xl" />
          <span className="font-medium">Edit Requests</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminArticlesSubHeader;
