import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  disableUser,
  enableUser,
  getSingleUser,
  updateUser,
} from '../../utils/requests/usersRequest';
import { iAuthor, iUser } from '../../utils/types/User';
import { BiCalendar, BiCategory, BiNews, BiTrendingUp } from 'react-icons/bi';
import { BsBan } from 'react-icons/bs';
import { MdTurnedInNot, MdOutlineAnalytics } from 'react-icons/md';
import { FiUsers, FiEdit } from 'react-icons/fi';
import { formatDateToCustomString } from '../../utils/helpers/articleHelpers';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { adminGetJournalistsAnalytics } from '../../utils/requests/articlesRequest';
import AdminViewPerformanceMetrics from '../../component/admin/users/AdminViewPerformanceMetrics';
import AdminViewPersonalInformation from '../../component/admin/users/AdminViewPersonalInformation';
import AdminViewJournalistsArticles from '../../component/admin/users/AdminViewJournalistsArticles';
import AdminViewJournalistOverview from '../../component/admin/users/AdminViewJournalistOverview';
import SEO from '../../utils/SEO';
import AdminDisableUser from '../../component/admin/users/AdminDisableUser';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const AdminViewSingleUser = () => {
  const [user, setUser] = useState<iAuthor>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [disableReason, setDisableReason] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<iAuthor>>({});
  const { id } = useParams<{ id: string }>();
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [analyticsData, setAnalyticsData] = useState<any>({});

  const fetchSingleUser = async () => {
    try {
      const response = await getSingleUser(id || '');
      if (response?.data?.worker) {
        setUser(response.data.worker);
        await generatePerformanceData();
      } else {
        toast.error('User not found!');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user.');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePerformanceData = async () => {
    const response = await adminGetJournalistsAnalytics(id || 'no user');
    if (response.status === 200) {
      setAnalyticsData(response.data);
    }
  };

  const handleInputChange = (field: keyof iAuthor, value: string) => {
    setEditedUser((prev: iAuthor) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      if (!id) return;
      const response = await updateUser(id, editedUser);
      if (response?.status === 200) {
        toast.success('User updated successfully!');
        setUser((prev: iUser) => ({ ...prev!, ...editedUser }));
        setEditedUser({});
        setIsEditing(false);
      } else {
        toast.error('Failed to update user!');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('An error occurred while updating the user.');
    }
  };

  const saveDisableReason = async () => {
    setIsFormLoading(true);
    handleInputChange('isDisabled', 'true');
    handleInputChange('disableReason', disableReason);

    if (disableReason.trim() === '') {
      toast.error('Disable reason is required');
      setIsFormLoading(false);
      return;
    }
    try {
      const response = await disableUser(id || '', disableReason);
      if (response.status === 200) {
        await fetchSingleUser();
        setShowModal(false);
        toast.success('User disabled successfully with reason!');
      } else {
        toast.error(
          response.message || 'An error occurred while disabling the user.'
        );
      }
    } catch (error) {
      console.error('Error saving disable reason:', error);
      toast.error('Failed to save disable reason.');
    } finally {
      setIsFormLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleUser();
  }, [id]);

  const handleEnableUser = async (id: any) => {
    setIsFormLoading(true);
    try {
      const response = await enableUser(id);
      if (response.status === 200) {
        toast.success('User enabled successfully!');
        await fetchSingleUser();
      } else {
        toast.error(
          response.message || 'An error occurred while enabling the user.'
        );
      }
    } catch (error) {
      console.error('Error enabling user:', error);
      toast.error('Failed to enable user.');
    } finally {
      setIsFormLoading(false);
    }
  };

  const readershipChartData = {
    labels: analyticsData?.readershipStats?.labels,
    datasets: [
      {
        label: 'Views',
        data: analyticsData?.readershipStats?.data,
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Comments',
        data: analyticsData?.commentStats?.data,
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(5, 150, 105, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const articleTrendsData = {
    labels: analyticsData?.articleTrends?.labels,
    datasets: [
      {
        label: 'Published',
        data: analyticsData?.articleTrends?.published,
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Drafts',
        data: analyticsData?.articleTrends?.drafts,
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const categoryDistributionData = {
    labels: analyticsData?.categoryDistribution?.labels,
    datasets: [
      {
        data: analyticsData?.categoryDistribution?.data,
        backgroundColor: [
          'rgba(79, 70, 229, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(59, 130, 246, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <SEO
        mainData={{
          title: `Journalist: ${user.firstName} ${user.lastName} - Admin : Kickside Rwanda`,
        }}
      />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-md rounded-lg max-w-full mx-auto overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={user.profile || '/avatar.svg'}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold">
                  {isEditing ? (
                    <div className="flex gap-4 mb-3 flex-wrap">
                      <input
                        type="text"
                        className="border p-2 rounded-md w-full md:w-auto outline-0 bg-white/20 text-white placeholder-white/70"
                        value={editedUser.firstName || user.firstName}
                        onChange={(e) =>
                          handleInputChange('firstName', e.target.value)
                        }
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        className="border p-2 rounded-md w-full md:w-auto outline-0 bg-white/20 text-white placeholder-white/70"
                        value={editedUser.lastName || user.lastName}
                        onChange={(e) =>
                          handleInputChange('lastName', e.target.value)
                        }
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    `${user.firstName} ${user.lastName}`
                  )}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <p className="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm">
                    <BiCategory className="mr-1" />
                    {isEditing ? (
                      <select
                        value={editedUser.role || user.role}
                        className="bg-transparent outline-0 text-white"
                        onChange={(e) =>
                          handleInputChange('role', e.target.value)
                        }
                      >
                        <option value="Admin" className="text-gray-800">
                          Admin
                        </option>
                        <option value="Editor" className="text-gray-800">
                          Editor
                        </option>
                        <option value="Journalist" className="text-gray-800">
                          Journalist
                        </option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </p>
                  <p className="flex items-center bg-white/20 px-3 py-1 rounded-full text-sm">
                    <BiCalendar className="mr-1" />
                    Joined: {formatDateToCustomString(user.createdAt)}
                  </p>
                  <p
                    className={`flex items-center px-3 py-1 rounded-full text-sm ${
                      user.isDisabled ? 'bg-red-500/90' : 'bg-green-500/90'
                    }`}
                  >
                    {user.isDisabled ? 'Disabled' : 'Active'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <FiEdit /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-indigo-800 text-white px-4 py-2 rounded-md hover:bg-indigo-900 transition-colors"
                      onClick={saveChanges}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
                <button
                  className={`flex items-center gap-1 px-4 py-2 rounded-md text-white transition-colors ${
                    user.isDisabled
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  onClick={
                    !user.isDisabled
                      ? () => setShowModal(true)
                      : () => handleEnableUser(user._id)
                  }
                >
                  {isFormLoading ? (
                    'Loading...'
                  ) : user.isDisabled ? (
                    <>
                      <MdTurnedInNot />
                      Enable
                    </>
                  ) : (
                    <>
                      <BsBan />
                      Disable
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'overview'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MdOutlineAnalytics /> Overview
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'articles'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BiNews /> Articles
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'performance'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BiTrendingUp /> Performance
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'details'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiUsers /> Details
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <AdminViewJournalistOverview
                analyticsData={analyticsData}
                articleTrendsData={articleTrendsData}
                categoryDistributionData={categoryDistributionData}
              />
            )}

            {activeTab === 'performance' && (
              <AdminViewPerformanceMetrics
                readershipChartData={readershipChartData}
                analyticsData={analyticsData}
              />
            )}

            {activeTab === 'details' && (
              <AdminViewPersonalInformation
                isEditing={isEditing}
                editedUser={editedUser}
                user={user}
                handleInputChange={handleInputChange}
                formatDateToCustomString={formatDateToCustomString}
              />
            )}

            {activeTab === 'articles' && (
              <AdminViewJournalistsArticles
                analyticsData={analyticsData}
                formatDateToCustomString={formatDateToCustomString}
              />
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <AdminDisableUser
          disableReason={disableReason}
          setDisableReason={setDisableReason}
          setShowModal={setShowModal}
          saveDisableReason={saveDisableReason}
          isFormLoading={isFormLoading}
        />
      )}
    </>
  );
};

export default AdminViewSingleUser;
