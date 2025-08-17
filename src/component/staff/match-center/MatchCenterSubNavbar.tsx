import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

type MenuItem = {
  label: string;
  to: string;
  id?: string;
};

type SubNavDropdownProps = {
  title: string;
  items: MenuItem[];
  isOpen: boolean;
  onToggle: () => void;
};

const SubNavDropdown = ({
  title,
  items,
  isOpen,
  onToggle,
}: SubNavDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-full" ref={dropdownRef}>
      <button
        className="flex items-center gap-1 px-4 py-2 hover:bg-gray-200 rounded-md transition-colors h-full"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`
            absolute left-0 top-full mt-1 
            bg-white border border-gray-200 rounded-md 
            shadow-lg z-[1000] min-w-[180px]
            animate-fadeIn
          `}
          role="menu"
        >
          <ul className="py-1">
            {items.map((item) => (
              <li key={item.id || item.to}>
                <Link
                  to={item.to}
                  className="block px-4 py-2 hover:bg-gray-100 transition-colors text-gray-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                  role="menuitem"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

type MenuType =
  | 'matches'
  | 'tournaments'
  | 'teams'
  | 'players'
  | 'setup'
  | null;

const MatchCenterSubNavbar = () => {
  const [openMenu, setOpenMenu] = useState<MenuType>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = (menu: MenuType) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="sticky top-0 z-[999] bg-gray-100 shadow rounded-md">
      <nav ref={navRef} className="flex gap-1 p-2 overflow-x-auto">
        <Link
          to="/staff/match-center"
          className="px-4 py-2 hover:bg-gray-200 rounded-md transition-colors whitespace-nowrap"
          onClick={() => setOpenMenu(null)}
        >
          Dashboard
        </Link>

        <SubNavDropdown
          title="Matches"
          items={[
            {
              label: 'Fixtures',
              to: '/staff/match-center/fixtures',
              id: 'fixtures',
            },
            {
              label: 'Results',
              to: '/staff/match-center/results',
              id: 'results',
            },
            {
              label: 'Live Matches',
              to: '/staff/match-center/live',
              id: 'live',
            },
          ]}
          isOpen={openMenu === 'matches'}
          onToggle={() => handleMenuToggle('matches')}
        />
        <SubNavDropdown
          title="Tournaments"
          items={[
            {
              label: 'Add Tournament',
              to: '/staff/tournaments/add',
              id: 'add-tournament',
            },
            {
              label: 'Manage Tournaments',
              to: '/staff/tournaments',
              id: 'manage-tournaments',
            },
            {
              label: 'Groups & Rounds',
              to: '/staff/tournaments/groups',
              id: 'groups-rounds',
            },
          ]}
          isOpen={openMenu === 'tournaments'}
          onToggle={() => handleMenuToggle('tournaments')}
        />
        <SubNavDropdown
          title="Teams"
          items={[
            { label: 'Add Team', to: '/staff/teams/add', id: 'add-team' },
            { label: 'Manage Teams', to: '/staff/teams', id: 'manage-teams' },
          ]}
          isOpen={openMenu === 'teams'}
          onToggle={() => handleMenuToggle('teams')}
        />
        <SubNavDropdown
          title="Players"
          items={[
            { label: 'Add Player', to: '/staff/players/add', id: 'add-player' },
            {
              label: 'Manage Players',
              to: '/staff/players',
              id: 'manage-players',
            },
          ]}
          isOpen={openMenu === 'players'}
          onToggle={() => handleMenuToggle('players')}
        />
        <SubNavDropdown
          title="Setup"
          items={[
            { label: 'Sports', to: '/staff/sports', id: 'sports' },
            {
              label: 'Sports Years',
              to: '/staff/sports-years',
              id: 'sports-years',
            },
            { label: 'Countries', to: '/staff/countries', id: 'countries' },
          ]}
          isOpen={openMenu === 'setup'}
          onToggle={() => handleMenuToggle('setup')}
        />
      </nav>
    </div>
  );
};

export default MatchCenterSubNavbar;
