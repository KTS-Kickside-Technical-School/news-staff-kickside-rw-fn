import { ToastContainer } from 'react-toastify';
import ArticleEditRequests from '../../pages/staff/ArticleEditRequests';
import SEO from '../../utils/SEO';
import AdminArticlesSubHeader from '../../component/staff/admin/AdminArticlesSubHeader';
import EditorArticlesSubHeader from '../../component/staff/editor/EditorArticlesSubHeader';

const StaffViewArticlesEditRequests = ({ profile }: any) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <SEO mainData={{ title: 'Articles Edit Requests - Kickside News' }} />
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Article Edit Requests
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          {profile.role === 'Admin' ? (
            <AdminArticlesSubHeader />
          ) : (
            <EditorArticlesSubHeader />
          )}
          <ArticleEditRequests />
        </div>
      </div>
    </div>
  );
};

export default StaffViewArticlesEditRequests;
 