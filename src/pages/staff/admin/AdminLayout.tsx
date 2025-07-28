import { Outlet } from 'react-router-dom';
import AdminHeader from '../../../component/staff/admin/AdminHeader';
import StaffSideBar from '../../../component/staff/StaffSideBar';

const AdminLayout = ({ onLogout }: any) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <StaffSideBar onLogout={onLogout} />
      <div className="flex-grow flex flex-col w-1/4 md:w-1/5">
        <AdminHeader onLogout={onLogout} />
        <main className="flex-grow overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
