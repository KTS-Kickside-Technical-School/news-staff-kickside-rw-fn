// Components/staff/RoleProtectedRoute.tsx
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) => {
  const token = sessionStorage.getItem('token');
  const profile = sessionStorage.getItem('profile');

  if (!token || !profile) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(profile);
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/staff/dashboard" replace />;
  }
  return <>{children}</>;
};

export default RoleProtectedRoute;
