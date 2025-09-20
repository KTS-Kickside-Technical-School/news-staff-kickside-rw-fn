// src/components/StatusBadge.tsx
import React from 'react';
import {
  FaCheck,
  FaClock,
  FaExclamationTriangle,
  FaPlay,
} from 'react-icons/fa';
import { formatTournamentsTime } from '../../../utils/helpers/tournamentsHelpers';

interface StatusBadgeProps {
  status: string;
  isMini?: boolean;
}

const MatchStatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isMini = false,
}) => {
  let color = '';
  let Icon: React.ElementType | null = null;
  let text = '';

  switch (status) {
    case 'finished':
      color = 'bg-gray-100 text-gray-700 border border-gray-300';
      Icon = FaCheck;
      text = 'FT';
      break;

    case 'in_progress':
      color =
        'bg-green-100 text-green-700 border border-green-300 animate-pulse';
      Icon = FaPlay;
      text = 'LIVE';
      break;

    case 'postponed':
      color = 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      Icon = FaExclamationTriangle;
      text = 'PP';
      break;

    case 'scheduled':
      break;

    default:
      // fallback to time if status isn't recognized
      color = 'bg-blue-100 text-blue-700 border border-blue-300';
      Icon = FaClock;
      text = formatTournamentsTime(new Date(), true);
  }

  return (
    <div
      className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${color} ${
        isMini ? 'w-10 h-6' : 'min-w-[60px] py-1.5'
      }`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {text && <span className={isMini ? 'hidden' : 'block'}>{text}</span>}
    </div>
  );
};

export default MatchStatusBadge;
