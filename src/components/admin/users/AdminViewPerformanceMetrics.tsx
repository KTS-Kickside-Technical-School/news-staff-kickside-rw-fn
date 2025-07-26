import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { BiBarChartAlt2 } from 'react-icons/bi';
import SEO from '../../../utils/SEO';

const AdminViewPerformanceMetrics = ({
  readershipChartData,
  analyticsData,
}: any) => {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <>
      <SEO
        mainData={{
          title: `Journalist Performance - Admin : Kickside Rwanda`,
        }}
      />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Performance Metrics
          </h2>
          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-sm ${
                timeRange === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm ${
                timeRange === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 text-sm ${
                timeRange === 'year'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <BiBarChartAlt2 /> Readership Over Time
          </h3>
          <div className="h-80">
            <div className="h-64">
              <Bar
                data={readershipChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />{' '}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-medium mb-4">Engagement Metrics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Average Read Time</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {analyticsData.avgReadTime || 'NaN'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Shares per Article</p>
                <p className="text-2xl font-bold text-green-600">
                  {analyticsData.sharesPerArticle || 'NaN'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Comments per Article</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analyticsData?.commentsPerArticle
                    ? Number(analyticsData.commentsPerArticle).toFixed(2)
                    : 'NaN'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Comments</p>
                <p className="text-2xl font-bold text-pink-600">
                  {analyticsData.totalComments || 'NaN'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-medium mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Article Quality</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Timeliness</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Engagement</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminViewPerformanceMetrics;
