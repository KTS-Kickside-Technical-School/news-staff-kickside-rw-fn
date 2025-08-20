import { ITrSeason } from '../../../utils/types/Tournaments';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { saveMatch } from '../../../utils/requests/tournaments/tournamentsRequests';
import { toast } from 'react-toastify';

interface NewTournamentMatchModalProps {
  tournament: ITrSeason;
  onClose: any;
}

const NewTournamentMatchModal = ({
  tournament,
  onClose,
}: NewTournamentMatchModalProps) => {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [matchTime, setMatchTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (homeTeam === awayTeam) {
      alert('Home and Away teams cannot be the same!');
      return;
    }
    try {
      console.log({
        homeTeam,
        awayTeam,
        matchTime,
        tournament: tournament.name,
      });
      const response = await saveMatch({
        homeTeam,
        awayTeam,
        matchTime,
        tournamentSeason: tournament._id,
      });
      if (response.status === 201) {
        toast.success('Match created successfully!');
        onClose();
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message || 'Error creating match!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          New Match - {tournament.name}
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
              <option value="">Select team</option>
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

          <div>
            <label className="block text-gray-700 mb-1">Away Team</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              required
            >
              <option value="">Select team</option>
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Match
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTournamentMatchModal;
