import { useState } from 'react';
import Avatar from '/avatar.svg';
import { Link } from 'react-router-dom';
import { BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const StaffHeader = ({ onLogout }: any) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileParsed = sessionStorage.getItem('profile');
  const profile = profileParsed ? JSON.parse(profileParsed) : {};

  return (
    <header className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <Link to="/admin" className="text-2xl font-bold text-primary">
          Kickside
        </Link>
      </div>

      <div className="flex-grow max-w-lg mx-6 hidden md:block">
        <input
          type="text"
          placeholder="Search for users, articles..."
          className="w-full px-4 py-2 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative text-gray-700 hover:text-primary">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        <div className="relative">
          <button
            className="flex items-center space-x-2 bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <img
              src={profile?.profile || Avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="hidden md:block text-sm font-medium text-gray-800">
              {profile?.firstName || 'Admin'}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-[100] border border-gray-100">
              <div className="p-3 border-b">
                <p className="text-sm font-semibold text-gray-900">
                  {profile?.firstName} {profile?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {profile?.role || 'Admin'}
                </p>
              </div>
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <Link
                    to={
                      profile.role === 'Editor'
                        ? '/editor/profile'
                        : '/journalist/profile'
                    }
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;
