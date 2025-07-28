import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthGuard = ({ isAuthenticated, fetchUserProfile }: any) => {
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile().catch((error: any) => {
        console.error('Unknown error while fetchnig profile', error);
        toast.error('Failed to fetch user profile. Please log in again.');
      });
    }
  }, [isAuthenticated, fetchUserProfile]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthGuard;
