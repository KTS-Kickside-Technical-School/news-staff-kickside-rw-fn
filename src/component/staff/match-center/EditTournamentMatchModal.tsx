import { ITrMatch, ITrSeason } from '../../../utils/types/Tournaments';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import {
  updateMatch,
  saveMatch,
} from '../../../utils/requests/tournaments/tournamentsRequests';
import { toast } from 'react-toastify';

interface EditTournamentMatchModalProps {
  tournament: ITrSeason;
  match: ITrMatch;
  onClose: any;
  onMatchUpdated?: () => void;
}

const EditTournamentMatchModal = ({
  tournament,
  match,
  onClose,
  onMatchUpdated,
}: EditTournamentMatchModalProps) => {
  const [homeTeam, setHomeTeam] = useState(match.homeTeam?._id || '');
  const [awayTeam, setAwayTeam] = useState(match.awayTeam?._id || '');
  const [matchTime, setMatchTime] = useState(
    match.matchTime ? new Date(match.matchTime).toISOString().slice(0, 16) : ''
  );
  const [matchDuration, setMatchDuration] = useState<any>(
    match.matchDuration || 90
  );
  const [status, setStatus] = useState(match.status || 'scheduled');
  const [homeScore, setHomeScore] = useState(
    match.homeScore?.toString() || '0'
  );
  const [awayScore, setAwayScore] = useState(
    match.awayScore?.toString() || '0'
  );
  const [venue, setVenue] = useState(match.venue || '');
  const [referee, setReferee] = useState(match.referee || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isNewMatch] = useState(!match._id);

  useEffect(() => {
    if (match) {
      setHomeTeam(match.homeTeam?._id || '');
      setAwayTeam(match.awayTeam?._id || '');
      setMatchTime(
        match.matchTime
          ? new Date(match.matchTime).toISOString().slice(0, 16)
          : ''
      );
      setMatchDuration(match.matchDuration || 90);
      setStatus(match.status || 'scheduled');
      setHomeScore(match.homeScore?.toString() || '0');
      setAwayScore(match.awayScore?.toString() || '0');
      setVenue(match.venue || '');
      setReferee(match.referee || '');
    }
  }, [match]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (homeTeam === awayTeam) {
      toast.error('Home and Away teams cannot be the same!');
      return;
    }

    if (!matchTime) {
      toast.error('Match time is required!');
      return;
    }

    setIsLoading(true);
    try {
      const matchData = {
        homeTeam,
        awayTeam,
        matchTime: new Date(matchTime).toISOString(),
        matchDuration: matchDuration || 90,
        status,
        homeScore: parseInt(homeScore) || 0,
        awayScore: parseInt(awayScore) || 0,
        venue,
        referee,
        tournamentSeason: tournament._id,
      };

      let response;
      if (isNewMatch) {
        response = await saveMatch(matchData);
      } else {
        response = await updateMatch(match?._id, matchData);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          isNewMatch
            ? 'Match created successfully!'
            : 'Match updated successfully!'
        );
        onMatchUpdated?.();
        onClose();
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      toast.error(
        error.message || `Error ${isNewMatch ? 'creating' : 'updating'} match!`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'Live' },
    { value: 'finished', label: 'Finished' },
    { value: 'postponed', label: 'Postponed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-lg max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          {isNewMatch ? 'New Match' : 'Edit Match'} - {tournament.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Home Team */}
          <div>
            <label className="block text-gray-700 mb-1">Home Team</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              required
            >
              <option value="">Select home team</option>
              {tournament.teams.map((team: any) => (
                <option
                  key={team._id}
                  value={team._id}
                  disabled={team._id === awayTeam}
                >
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Away Team */}
          <div>
            <label className="block text-gray-700 mb-1">Away Team</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              required
            >
              <option value="">Select away team</option>
              {tournament.teams.map((team: any) => (
                <option
                  key={team?._id}
                  value={team?._id}
                  disabled={team?._id === homeTeam}
                >
                  {team?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Match Time</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={matchTime}
              onChange={(e) => setMatchTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Match Duration (minutes)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={matchDuration}
              onChange={(e) => setMatchDuration(e.target.value)}
              min="1"
              max="120"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Home Score</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Away Score</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Venue</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Enter match venue"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Referee</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={referee}
              onChange={(e) => setReferee(e.target.value)}
              placeholder="Enter referee name"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? 'Saving...'
              : isNewMatch
              ? 'Create Match'
              : 'Update Match'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTournamentMatchModal;
