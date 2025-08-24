import { IPlayer, ITeam } from '../../../utils/types/Tournaments';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { saveTeamPlayer } from '../../../utils/requests/tournaments/tournamentsRequests';
import { getTeams } from '../../../utils/requests/tournaments/teamsRequests';
import { toast } from 'react-toastify';

interface NewTournamentMatchModalProps {
  player: IPlayer;
  onClose: () => void;
}

const PlayerAddTeam = ({ player, onClose }: NewTournamentMatchModalProps) => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [query, setQuery] = useState('');
  const [filteredTeams, setFilteredTeams] = useState<ITeam[]>([]);
  const [formData, setFormData] = useState({
    team: '', // stores ID
    startDate: '',
    endDate: '',
    stillPlaying: false,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getTeams();
        if (response.status === 200) {
          setTeams(response.data);
          setFilteredTeams(response.data);
          return;
        }
        throw new Error(response.message || 'Error getting teams');
      } catch (error: any) {
        toast.error(error.message || 'Error getting teams');
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredTeams(teams);
      return;
    }
    const q = query.toLowerCase();
    setFilteredTeams(teams.filter((t) => t.name.toLowerCase().includes(q)));
  }, [query, teams]);

  const handleSelectTeam = (team: ITeam) => {
    setFormData((prev: any) => ({ ...prev, team: team._id }));
    setQuery(team.name);
    setDropdownOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.team) {
        toast.error('Please select a team!');
        return;
      }
      const response = await saveTeamPlayer({
        team: formData.team,
        player: player._id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        stillPlaying: formData.stillPlaying,
      });

      if (response.status === 201) {
        toast.success('Player assigned to team successfully!');
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
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Assign Team for {player.firstname} {player.lastname}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Searchable Team Selector */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Team</label>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Search team..."
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {dropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow max-h-48 overflow-y-auto">
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <li
                      key={team._id}
                      onClick={() => handleSelectTeam(team)}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {team.name}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-gray-500">No teams found</li>
                )}
              </ul>
            )}
          </div>

          {/* Dates */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Start date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              End date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">
              Still playing in the team?
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="stillPlaying"
                checked={formData.stillPlaying}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerAddTeam;
