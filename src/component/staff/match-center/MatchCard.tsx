import { FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MatchStatusBadge from './MatchStatusBadge';

interface MatchCardProps {
  match: {
    _id: string;
    status: string;
    matchTime: string;
    homeTeam: { name: string; logo: string };
    awayTeam: { name: string; logo: string };
    homeScore: number;
    awayScore: number;
    slug: string;
  };
  formatTime: (time: string, isScheduled: boolean) => string;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, formatTime }) => {
  const isLive = match.status === 'in_progress';
  console.log(match.slug);
  return (
    <div
      className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition-all  mb-3 w-full
      ${isLive ? 'border-l-4 border-l-green-600' : 'border-gray-200'}`}
    >
      <Link
        to={`/staff/tr/seasons/match/${match._id}`}
        title={`${match.homeTeam.name} ${match.homeScore} - ${match.awayScore} vs ${match.awayTeam.name}`}
      >
        {' '}
        <div className="flex justify-between items-center text-xs text-gray-600 border-b border-gray-100 px-3 py-1.5">
          <MatchStatusBadge status={match.status} />
          <div className="flex items-center gap-1 text-gray-500">
            <FaClock size={12} />
            <span className="font-medium">
              {formatTime(match.matchTime, match.status === 'scheduled')}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2 w-2/5">
            <img
              src={match.homeTeam.logo}
              alt=""
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm font-medium text-gray-800 truncate">
              {match.homeTeam.name}
            </span>
          </div>

          <div className="flex flex-col items-center w-1/5 text-base font-bold">
            {match.status === 'finished' || match.status === 'in_progress' ? (
              <span
                className={`${
                  isLive ? 'text-blue-600 animate-pulse' : 'text-gray-900'
                }`}
              >
                {match.homeScore} - {match.awayScore}
              </span>
            ) : (
              <span className="text-gray-400">vs</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-2/5 justify-end">
            <span className="text-sm font-medium text-gray-800 truncate text-right">
              {match.awayTeam.name}
            </span>
            <img
              src={match.awayTeam.logo}
              alt=""
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MatchCard;
