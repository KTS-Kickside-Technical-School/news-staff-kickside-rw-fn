import { useState, useEffect, createContext, useContext } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import StaffLogin from './pages/staff/StaffLogin';
import AuthGuard from './components/staff/AuthGuard';
import StaffViewArticles from './pages/staff/StaffViewArticles';
import StaffNotFound from './pages/staff/StaffNotFound';
import StaffViewArticleDetails from './pages/staff/StaffViewArticleDetails';
import StaffNewArticle from './pages/staff/StaffNewArticle';
import ForgotPassword from './pages/staff/ForgotPassword';
import ResetPassword from './pages/staff/ResetPassword';
import { toast } from 'react-toastify';
import { userLogout, userViewProfile } from './utils/requests/authRequest';
import Settings from './pages/staff/Settings';
import StaffLayout from './pages/staff/StaffLayout';
import StaffViewArticlesEditRequests from './pages/staff/StaffViewArticlesEditRequests';
import StaffViewOwnArticles from './pages/staff/StaffViewOwnArticles';
import AdminViewUsers from './pages/staff/AdminViewUsers';
import StaffViewSingleUser from './pages/staff/StaffViewSingleUser';
import AdminNewUser from './pages/staff/AdminNewUser';
import Dashboard from './pages/staff/Dashboard';
import AdminViewInquiries from './pages/staff/AdminViewInquiries';
import AdminVIewSingleInquiry from './pages/staff/AdminVIewSingleInquiry';
import AdminMailingList from './pages/staff/AdminMailingList';
import StaffEditArticle from './pages/staff/StaffEditArticle';
import AdminDashboard from './pages/staff/admin/AdminDashboard';
import AdminLayout from './pages/staff/admin/AdminLayout';
import JournalistMyArticles from './pages/staff/journalist/JournalistMyArticles';
import EditorViewArticles from './pages/staff/editor/EditorViewArticles';
import RoleProtectedRoute from './components/staff/RoleProtectRoute';
import AdminNewArticle from './pages/staff/admin/AdminNewArticle';
import AdminViewArticles from './pages/staff/admin/AdminViewArticles';

const AuthContext = createContext<any>(null);

const AppRouter = () => {
  const isAuthenticated = Boolean(sessionStorage.getItem('token'));
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);

  const logout = async () => {
    try {
      await userLogout(token);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('profile');
      toast.success('Logged out successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      toast.error(error?.message || 'Logout failed. Please try again.');
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await userViewProfile();
      if (response.status === 401) {
        toast.error('Session expired. Please log in again.');
        sessionStorage.removeItem('token');
        navigate('/login');
      } else if (response.status === 200) {
        setProfile(response.data.user);
        sessionStorage.setItem('profile', JSON.stringify(response.data.user));
      }
    } catch (error: any) {
      toast.error(error?.message || 'Unable to fetch profile.');
    }
  };

  useEffect(() => {
    const cachedProfile = sessionStorage.getItem('profile');
    if (isAuthenticated && !profile) {
      if (cachedProfile) {
        setProfile(JSON.parse(cachedProfile));
      } else {
        fetchUserProfile();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ profile, setProfile }}>
      <Routes>
        <Route path="/" element={<StaffLogin />} />
        <Route path="login" element={<StaffLogin />} />
        <Route path="/staff">
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route
            element={
              <AuthGuard
                isAuthenticated={isAuthenticated}
                fetchUserProfile={fetchUserProfile}
              />
            }
          >
            <Route
              element={<StaffLayout onLogout={logout} profile={profile} />}
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="articles"
                element={<StaffViewArticles profile={profile} />}
              />
              <Route path="article/new" element={<StaffNewArticle />} />
              <Route path="article/edit/:slug" element={<StaffEditArticle />} />
              <Route
                path="article/:id"
                element={<StaffViewArticleDetails profile={profile} />}
              />
              <Route
                path="articles/edit-requests"
                element={<StaffViewArticlesEditRequests profile={profile} />}
              />
              <Route
                path="articles/admin-view-own-articles"
                element={<StaffViewOwnArticles profile={profile} />}
              />

              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<StaffNotFound />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={['Admin']}>
              <AdminLayout onLogout={logout} />
            </RoleProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="articles/view" element={<AdminViewArticles />} />
          <Route path="articles/add" element={<AdminNewArticle />} />
          <Route path="profile" element={<Settings />} />
          <Route
            path="users/view"
            element={<AdminViewUsers profile={profile} />}
          />
          <Route path="user/:id" element={<StaffViewSingleUser />} />
          <Route path="users/add" element={<AdminNewUser />} />
          <Route
            path="inquiries"
            element={<AdminViewInquiries profile={profile} />}
          />
          <Route path="inquiry/:id" element={<AdminVIewSingleInquiry />} />
          <Route path="mailing-list" element={<AdminMailingList />} />
        </Route>

        <Route
          path="/editor"
          element={
            <RoleProtectedRoute allowedRoles={['Editor']}>
              <StaffLayout onLogout={logout} />
            </RoleProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="articles/view" element={<EditorViewArticles />} />
          <Route path="articles/add" element={<StaffNewArticle />} />
          <Route path="profile" element={<Settings />} />
        </Route>

        <Route
          path="/journalist"
          element={
            <RoleProtectedRoute allowedRoles={['Journalist']}>
              <StaffLayout onLogout={logout} />
            </RoleProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-articles/view" element={<JournalistMyArticles />} />
          <Route path="my-articles/add" element={<StaffNewArticle />} />
          <Route path="profile" element={<Settings />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
};

export default AppRouter;

export const useAuth = () => useContext(AuthContext);
