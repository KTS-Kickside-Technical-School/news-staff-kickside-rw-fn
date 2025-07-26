import { useState, useEffect } from 'react';
import {
  BiSupport,
  BiUser,
  BiChevronDown,
  BiChevronUp,
  BiPlus,
} from 'react-icons/bi';
import { BsMailbox } from 'react-icons/bs';
import { FaNewspaper } from 'react-icons/fa';
import { MdDashboard, MdLogout, MdMenu } from 'react-icons/md';
import { PiArticleNyTimesBold } from 'react-icons/pi';
import { Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffSideBar = ({ onLogout }: { onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const { pathname } = useLocation();

  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    const profileParsed = sessionStorage.getItem('profile');
    const storedProfile = profileParsed ? JSON.parse(profileParsed) : {};
    setProfile(storedProfile);
  }, []);

  const menuItems = [
    {
      to: profile.role === 'Admin' ? '/admin/dashboard' : '/staff/dashboard',
      label: 'Dashboard',
      icon: <MdDashboard size={18} />,
    },
  ];

  const adminItems = [
    {
      to: '/admin/articles',
      label: 'Articles',
      icon: <FaNewspaper size={18} />,
      subItems: [
        {
          to: '/admin/articles/add',
          label: 'Add Article',
          icon: <BiPlus size={16} />,
        },
        {
          to: '/admin/articles/view',
          label: 'View Articles',
          icon: <FaNewspaper size={16} />,
        },
      ],
    },
    {
      to: '/admin/users',
      label: 'Users',
      icon: <BiUser size={18} />,
      subItems: [
        {
          to: '/admin/users/add',
          label: 'Add User',
          icon: <BiPlus size={16} />,
        },
        {
          to: '/admin/users/view',
          label: 'View Users',
          icon: <BiUser size={16} />,
        },
      ],
    },
    {
      to: '/admin/mailing-list',
      label: 'Mailing List',
      icon: <BsMailbox size={18} />,
    },
    {
      to: '/admin/inquiries',
      label: 'Customer Inquiries',
      icon: <BiSupport size={18} />,
    },
  ];

  const journalistItems = [
    {
      to: '/journalist/my-articles',
      label: 'My Articles',
      icon: <PiArticleNyTimesBold size={18} />,
      subItems: [
        {
          to: '/journalist/my-articles/add',
          label: 'Add Article',
          icon: <BiPlus size={16} />,
        },
        {
          to: '/journalist/my-articles/view',
          label: 'View Articles',
          icon: <PiArticleNyTimesBold size={16} />,
        },
      ],
    },
  ];

  const editorItems = [
    {
      to: '/editor/articles',
      label: 'Articles',
      icon: <PiArticleNyTimesBold size={18} />,
      subItems: [
        {
          to: '/editor/articles/add',
          label: 'Add Article',
          icon: <BiPlus size={16} />,
        },
        {
          to: '/editor/articles/view',
          label: 'View Articles',
          icon: <PiArticleNyTimesBold size={16} />,
        },
      ],
    },
  ];

  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};

    const allItems = [...adminItems, ...journalistItems, ...editorItems];
    for (const item of allItems) {
      if (item.subItems) {
        const isActiveSubItem = item.subItems.some((subItem) =>
          pathname.startsWith(subItem.to)
        );
        if (isActiveSubItem) {
          initialExpanded[item.label] = true;
        }
      }
    }

    setExpandedSections(initialExpanded);
  }, [pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderMenuItem = ({ to, label, icon, subItems }: any) => {
    const isActive =
      pathname === to ||
      (subItems &&
        subItems.some((subItem: any) => pathname.startsWith(subItem.to)));

    return (
      <li key={to}>
        {subItems ? (
          <>
            <div
              className={`flex items-center justify-between gap-4 px-4 py-3 rounded-lg cursor-pointer transition ${
                isActive
                  ? 'bg-primary text-white font-medium'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
              onClick={() => toggleSection(label)}
            >
              <div className="flex items-center gap-4">
                {icon}
                {isOpen && <span className="text-sm">{label}</span>}
              </div>
              {isOpen &&
                (expandedSections[label] ? (
                  <BiChevronUp size={16} />
                ) : (
                  <BiChevronDown size={16} />
                ))}
            </div>

            {isOpen && expandedSections[label] && (
              <ul className="ml-8 mt-1 space-y-1">
                {subItems.map((subItem: any) => (
                  <li key={subItem.to}>
                    <Link
                      to={subItem.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition ${
                        pathname.startsWith(subItem.to)
                          ? 'bg-primary/20 text-primary font-medium'
                          : 'hover:bg-gray-700/50 text-gray-400'
                      }`}
                    >
                      {subItem.icon}
                      <span>{subItem.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <Link
            to={to}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition ${
              isActive
                ? 'bg-primary text-white font-medium'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            {icon}
            {isOpen && <span className="text-sm">{label}</span>}
          </Link>
        )}
      </li>
    );
  };

  const renderSection = (title: string, items: any[]) => {
    return (
      <>
        <div
          className={`text-[11px] uppercase tracking-wider mt-6 mb-2 px-4 ${
            isOpen ? 'text-gray-400' : 'hidden'
          }`}
        >
          {title}
        </div>
        <ul className="space-y-1 px-2">{items.map(renderMenuItem)}</ul>
      </>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />

      {/* Responsive Sidebar - always visible but changes width */}
      <aside
        className={`relative bg-gray-900 text-white shadow-lg transition-all duration-300 flex flex-col ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-800">
          {isOpen && (
            <h1 className="text-lg font-bold text-white truncate">
              Kickside Staff
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition"
            title="Toggle Menu"
          >
            <MdMenu size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
          <ul className="space-y-1 px-2">{menuItems.map(renderMenuItem)}</ul>

          {profile?.role === 'Journalist' &&
            renderSection('Journalist Panel', journalistItems)}

          {profile?.role === 'Editor' &&
            renderSection('Editor Panel', editorItems)}

          {profile?.role === 'Admin' &&
            renderSection('Admin Panel', adminItems)}
        </div>

        <div className="px-2 py-4 border-t border-gray-800">
          <button
            onClick={onLogout}
            className="flex items-center gap-4 px-4 py-3 w-full text-left text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition"
          >
            <MdLogout size={18} />
            {isOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        
        @media (max-width: 768px) {
          aside {
            width: ${isOpen ? '240px' : '72px'} !important;
          }
          aside h1 {
            font-size: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          aside {
            width: ${isOpen ? '200px' : '60px'} !important;
          }
          .text-sm {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StaffSideBar;