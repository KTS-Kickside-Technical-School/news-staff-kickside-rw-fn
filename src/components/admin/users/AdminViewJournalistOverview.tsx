import { Line, Pie } from 'react-chartjs-2';
import { BiBarChartAlt2, BiCalendar } from 'react-icons/bi';
import { BsCheckCircle, BsClockHistory } from 'react-icons/bs';
import { MdOutlineArticle } from 'react-icons/md';

const AdminViewJournalistOverview = ({
  analyticsData,
  articleTrendsData,
  categoryDistributionData,
}: any) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        Journalist Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Articles
              </p>
              <p className="text-3xl font-bold mt-1 text-indigo-600">
                {analyticsData?.totalArticles}
              </p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <MdOutlineArticle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-3xl font-bold mt-1 text-green-600">
                {analyticsData?.articlesThisMonth}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <BiCalendar size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Approval Rate</p>
              <p className="text-3xl font-bold mt-1 text-blue-600">
                {analyticsData?.approvalRate}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <BsCheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Articles
              </p>
              <p className="text-3xl font-bold mt-1 text-yellow-600">
                {analyticsData?.pendingArticles}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <BsClockHistory size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <BiBarChartAlt2 /> Article Trends
          </h3>
          <div className="h-64">
            <Line
              data={articleTrendsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <BiBarChartAlt2 /> Category Distribution
          </h3>
          <div className="h-64">
            <Pie
              data={categoryDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
        <h3 className="font-medium mb-4">Top Categories</h3>
        <div className="flex flex-wrap gap-2">
          {analyticsData?.topCategories?.map((category: any, index: any) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminViewJournalistOverview;
