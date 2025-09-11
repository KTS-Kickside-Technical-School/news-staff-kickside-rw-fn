import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import SEO from '../../utils/SEO';
import CreateNewArticleForm from '../../component/staff/CreateNewArticleForm';

const StaffNewArticle = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <SEO mainData={{ title: 'New Article - Kickside News' }} />
      <CreateNewArticleForm />
    </div>
  );
};

export default StaffNewArticle;
