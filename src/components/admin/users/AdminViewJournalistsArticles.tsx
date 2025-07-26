import { Link } from 'react-router-dom';
import SEO from '../../../utils/SEO';
import { BiUserCheck, BiGlobe } from 'react-icons/bi';

const AdminViewJournalistsArticles = ({
  formatDateToCustomString,
  analyticsData,
}: any) => {
  return (
    <>
      <SEO
        mainData={{
          title: `Journalist Articles - Admin : Kickside Rwanda`,
        }}
      />

      <div>
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Article Management
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8">
          <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 font-medium text-sm text-gray-500">
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Published</div>
            <div className="col-span-1">Views</div>
            <div className="col-span-1">Actions</div>
          </div>

          {analyticsData?.articles?.map((article: any) => (
            <div
              key={article._id}
              className="grid grid-cols-12 p-4 border-b border-gray-200 text-sm hover:bg-gray-50"
            >
              <div className="col-span-5 font-medium text-gray-800">
                {article.title}
              </div>
              <div className="col-span-2">
                <span className="px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                  {article.category}
                </span>
              </div>
              <div className="col-span-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    article.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : article.status === 'unpublished'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {article.status}
                </span>
              </div>
              <div className="col-span-2 text-gray-500">
                {article.createdAt
                  ? formatDateToCustomString(article.createdAt)
                  : '-'}
              </div>
              <div className="col-span-1 text-gray-800">
                {article.views.toLocaleString()}
              </div>

              <div className="col-span-1 flex gap-2">
                {' '}
                <Link
                  to={`/staff/article/${article._id}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition"
                >
                  <BiUserCheck className="text-lg" />
                  Staff View
                </Link>
                <Link
                  to={`/news/${article.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition"
                >
                  <BiGlobe className="text-lg" />
                  Client View
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing 1 to 5 of {analyticsData?.totalArticles} articles
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminViewJournalistsArticles;
