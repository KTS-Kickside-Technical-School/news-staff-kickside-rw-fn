import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BiComment, BiEdit, BiTrendingUp } from 'react-icons/bi';
import { FiDownload, FiFilter } from 'react-icons/fi';
import { Chart, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Link } from 'react-router-dom';
import { iArticleType, MonthlyAnalytics } from '../../../utils/types/Article';
import {
  getTopArticlesByMonth,
  journalistFindAnalysis,
} from '../../../utils/requests/articlesRequest';
import SEO from '../../../utils/SEO';
import { getGreeting } from '../../../utils/helpers/articleHelpers';
import { BsArrowUpRight, BsEye } from 'react-icons/bs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface JournalistAnalysis {
  monthlyAnalytics: MonthlyAnalytics[];
  totalViews: number;
  totalComments: number;
  totalArticles: number;
  engagementRate?: number;
  avgReadTime?: number;
}

const AdminDashboard = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [journalistAnalysis, setJournalistAnalysis] =
    useState<JournalistAnalysis | null>(null);
  const [topArticles, setTopArticles] = useState<iArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'articles' | 'analytics'
  >('overview');

  const profileParsed = sessionStorage.getItem('profile');
  const profile = profileParsed ? JSON.parse(profileParsed) : {};

  const monthlyData = journalistAnalysis?.monthlyAnalytics || [];
  const currentMonthData = monthlyData[monthlyData.length - 1];
  const prevMonthData = monthlyData[monthlyData.length - 2] || {};

  const getJournalistAnalysis = async (year: number) => {
    try {
      setIsLoading(true);
      const response = await journalistFindAnalysis(year);
      if (response.status === 200) {
        setJournalistAnalysis({
          ...response.data,
          engagementRate: calculateEngagementRate(response.data),
          avgReadTime: calculateAvgReadTime(),
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error getting journalist analysis', error);
      toast.error('Error fetching analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEngagementRate = (data: JournalistAnalysis) => {
    if (!data.totalViews) return 0;
    return Math.round((data.totalComments / data.totalViews) * 100);
  };

  const calculateAvgReadTime = () => {
    return Math.floor(Math.random() * 5) + 2;
  };

  useEffect(() => {
    getJournalistAnalysis(year);
  }, [year]);

  const fetchTopArticles = async (month: number) => {
    try {
      setMonth(month);
      setIsLoading(true);
      console.log(month);
      const res = await getTopArticlesByMonth(month, year);
      setTopArticles(res.data.monthsTopRead || []);
    } catch (err) {
      toast.error('Failed to fetch top articles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopArticles(month);
  }, [month, year]);

  const chartData = {
    labels:
      journalistAnalysis?.monthlyAnalytics.map((item) => item.month) || [],
    datasets: [
      {
        label: 'Views',
        data:
          journalistAnalysis?.monthlyAnalytics.map((item) => item.views) || [],
        backgroundColor: 'rgba(99, 102, 241, 0.6)', // Indigo 500 with transparency
        borderColor: 'rgba(79, 70, 229, 1)', // Indigo 600
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
        hoverBorderColor: 'rgba(79, 70, 229, 1)',
      },
      {
        label: 'Comments',
        data:
          journalistAnalysis?.monthlyAnalytics.map((item) => item.comments) ||
          [],
        backgroundColor: 'rgba(34, 197, 94, 0.4)', // Emerald 500
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 3,
        pointBackgroundColor: '#10B981', // Custom point style
        pointBorderColor: '#10B981',
        pointRadius: 5,
        pointHoverRadius: 7,
        borderDash: [4, 4],
        type: 'line' as const,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Articles',
        data:
          journalistAnalysis?.monthlyAnalytics.map((item) => item.articles) ||
          [],
        backgroundColor: 'rgba(255, 159, 64, 0.3)', // Orange
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2,
        pointBackgroundColor: '#FF9F40',
        pointBorderColor: '#FF9F40',
        pointRadius: 4,
        pointHoverRadius: 6,
        type: 'line' as const,
        tension: 0.5,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#fff',
        bodyColor: '#D1D5DB',
        borderColor: '#6B7280',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#6B7280' },
        grid: { color: 'rgba(229,231,235,0.3)' },
      },
      y: {
        ticks: { color: '#6B7280' },
        grid: { color: 'rgba(229,231,235,0.3)' },
      },
    },
  };

  const handleExport = (format: string) => {
    const chartElement = document.getElementById('analyticsChart');
    if (!chartElement || !journalistAnalysis?.monthlyAnalytics?.length) {
      toast.error('No data available for export');
      return;
    }

    const dynamicData = journalistAnalysis.monthlyAnalytics.map((item) => ({
      month: item.month,
      views: item.views,
      comments: item.comments,
    }));

    switch (format) {
      case 'png':
        html2canvas(chartElement).then((canvas) => {
          const img = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = img;
          a.download = `analytics-${month}-${year}.png`;
          a.click();
        });
        break;

      case 'pdf':
        html2canvas(chartElement).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const doc = new jsPDF('landscape');
          doc.addImage(imgData, 'PNG', 15, 15, 260, 120);
          doc.setFontSize(16);
          doc.text(`Monthly Analytics Report - ${month}/${year}`, 15, 10);
          doc.setFontSize(10);
          dynamicData.forEach((data, index) => {
            doc.text(
              `${index + 1}. ${data.month}: ${data.views} views, ${
                data.comments
              } comments`,
              15,
              140 + index * 7
            );
          });
          doc.save(`analytics-${month}-${year}.pdf`);
        });
        break;

      case 'excel':
      case 'csv':
        const ws = XLSX.utils.json_to_sheet(dynamicData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Analytics Data');
        if (format === 'excel') {
          XLSX.writeFile(wb, `analytics-${month}-${year}.xlsx`);
        } else {
          const csv = XLSX.utils.sheet_to_csv(ws);
          const blob = new Blob([csv], { type: 'text/csv' });
          saveAs(blob, `analytics-${month}-${year}.csv`);
        }
        break;
    }
  };

  const calcPercentChange = (current = 0, prev = 0) => {
    if (!prev || prev === 0) return current === 0 ? 0 : 100;
    return Math.round(((current - prev) / prev) * 100);
  };

  const currentEngagement =
    currentMonthData && currentMonthData.views
      ? Math.round((currentMonthData.comments / currentMonthData.views) * 100)
      : 0;

  const prevEngagement =
    prevMonthData && prevMonthData.views
      ? Math.round((prevMonthData.comments / prevMonthData.views) * 100)
      : 0;

  const engagementChange = calcPercentChange(currentEngagement, prevEngagement);

  const renderStatCard = (
    icon: JSX.Element,
    title: string,
    value: number | string,
    change?: number
  ) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">{title}</span>
          <span className="text-2xl font-bold mt-1">{value}</span>
        </div>
        <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div
          className={`mt-3 flex items-center text-sm ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change >= 0 ? (
            <BiTrendingUp className="mr-1" />
          ) : (
            <BiTrendingUp className="mr-1 transform rotate-180" />
          )}
          <span>{Math.abs(change)}% from last month</span>
        </div>
      )}
    </div>
  );

  if (isLoading && !journalistAnalysis) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 h-28 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 h-96 animate-pulse"></div>
          <div className="bg-white rounded-xl p-6 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        mainData={{
          title: `${profile.firstName}'s Dashboard – Kickside Analytics`,
          description: 'Track your article performance and audience engagement',
          author: 'Kickside Rwanda',
          type: 'website',
          publishedAt: new Date().toISOString(),
        }}
        canonicalUrl="https://www.kickside.rw/staff/dashboard"
      />

      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Title & Date */}
          <div className="flex flex-col items-start sm:items-start">
            <h1 className="text-3xl font-semibold text-indigo-800">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-indigo-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Optional: Notification Icon */}
          {/* <button className="text-indigo-600 hover:text-indigo-800 transition">
      <BiBell size={24} />
    </button> */}

          {/* Greeting Badge + User Avatar */}
          <div className="flex items-center space-x-3">
            <div
              className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition duration-200 hover:bg-indigo-200"
              title={`Welcome, ${profile.firstName}!`}
            >
              {getGreeting(profile.firstName)}
            </div>
            <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-medium uppercase">
              {profile.firstName?.[0] || 'U'} {/* first letter */}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Detailed Analytics
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {renderStatCard(
            <BsEye size={20} />,
            'Views (This Month)',
            new Intl.NumberFormat().format(currentMonthData?.views || 0),
            calcPercentChange(currentMonthData?.views, prevMonthData?.views)
          )}

          {renderStatCard(
            <BiComment size={20} />,
            'Comments (This Month)',
            new Intl.NumberFormat().format(currentMonthData?.comments || 0),
            calcPercentChange(
              currentMonthData?.comments,
              prevMonthData?.comments
            )
          )}

          {renderStatCard(
            <BiEdit size={20} />,
            'Articles Published',
            currentMonthData?.articles || 0,
            calcPercentChange(
              currentMonthData?.articles,
              prevMonthData?.articles
            )
          )}
          {renderStatCard(
            <BiTrendingUp size={20} />,
            'Engagement Rate',
            `${currentEngagement}%`,
            engagementChange
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Performance Analytics
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                  >
                    {Array.from(
                      { length: new Date().getFullYear() - 2023 + 1 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <FiDownload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue="export"
                    onChange={(e) => handleExport(e.target.value)}
                  >
                    <option value="export" disabled>
                      Export
                    </option>
                    <option value="png">PNG Image</option>
                    <option value="pdf">PDF Report</option>
                    <option value="excel">Excel Data</option>
                    <option value="csv">CSV File</option>
                  </select>
                </div>
              </div>
            </div>
            <div id="analyticsChart" className="w-full h-80">
              <Chart type="bar" data={chartData} options={chartOptions} />{' '}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Articles
              </h2>
              <div className="relative">
                <select
                  className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                  value={month}
                  onChange={(e) => fetchTopArticles(Number(e.target.value))}
                >
                  {[...Array(12)].map((_, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {new Date(0, idx).toLocaleString('default', {
                        month: 'long',
                      })}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {topArticles.length > 0 ? (
              <div className="space-y-4">
                {topArticles.map((article, idx) => (
                  <div key={article._id} className="group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <span className="text-gray-400 font-medium mr-3 mt-1">
                          {idx + 1}
                        </span>
                        <div>
                          <Link
                            to={`/staff/article/${article._id}`}
                            // target="_blank"
                            className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2"
                          >
                            {article.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Intl.NumberFormat().format(article.views)}{' '}
                            views
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <BsArrowUpRight />
                      </button>
                    </div>
                    {idx < topArticles.length - 1 && (
                      <div className="border-t border-gray-100 mt-3"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No articles found for this period
                </p>
              </div>
            )}
          </div>
        </div>

        {activeTab === 'analytics' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Engagement Metrics
              </h2>
              <div className="h-64">
                <Line
                  data={{
                    labels:
                      journalistAnalysis?.monthlyAnalytics.map(
                        (item) => item.month
                      ) || [],
                    datasets: [
                      {
                        label: 'Engagement Rate (%)',
                        data:
                          journalistAnalysis?.monthlyAnalytics.map(
                            (item) =>
                              Math.round((item.comments / item.views) * 100) ||
                              0
                          ) || [],
                        borderColor: 'rgba(139, 92, 246, 1)',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start">
                    <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                      {i === 0 ? (
                        <BiEdit />
                      ) : i === 1 ? (
                        <BiComment />
                      ) : (
                        <BsEye />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {i === 0
                          ? 'Article Published'
                          : i === 1
                          ? 'New Comment'
                          : 'View Milestone'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {i === 0
                          ? '"How to Improve Your Writing Skills" was published'
                          : i === 1
                          ? 'John Doe commented on "Latest Political Analysis"'
                          : '"Tech Trends 2023" reached 10,000 views'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
