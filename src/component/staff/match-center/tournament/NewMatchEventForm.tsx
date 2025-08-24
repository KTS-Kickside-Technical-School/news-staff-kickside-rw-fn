import React, { useState } from 'react';
import { ITeam } from '../../../../utils/types/Tournaments';
import { saveMatchEvent } from '../../../../utils/requests/tournaments/tournamentsRequests';
import { toast } from 'react-toastify';

const eventTypes = [
  'goal',
  'own_goal',
  'penalty_goal',
  'assist',
  'shot_on_target',
  'shot_off_target',
  'penalty_missed',
  'yellow_card',
  'red_card',
  'second_yellow_card',
  'substitution_in',
  'substitution_out',
  'foul_committed',
  'foul_suffered',
  'free_kick_awarded',
  'penalty_awarded',
  'kickoff',
  'half_time',
  'full_time',
  'extra_time_start',
  'extra_time_end',
  'penalty_shootout_start',
  'penalty_shootout_end',
  'corner_kick',
  'throw_in',
  'injury',
  'VAR_check',
  'goal_cancelled',
];

const eventOptions = eventTypes
  .map((event) => ({
    value: event,
    label: event.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

interface AddGoalFormProps {
  players: { home: any[]; away: any[] };
  teams: ITeam[];
  match: any;
  onUpdate: any;
  onCancel: () => void;
  isLoading?: boolean;
}

const NewMatchEventForm: React.FC<AddGoalFormProps> = ({
  players,
  teams,
  match,
  onUpdate,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    match: match?._id || '',
    team: '',
    player: '',
    relatedPlayer: '',
    minute: '',
    eventType: '',
    outcome: '',
    description: '',
  });
  const [search, setSearch] = useState({
    player: '',
    relatedPlayer: '',
  });

  const allPlayers = [...players.home, ...players.away];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.match ||
      !formData.team ||
      !formData.eventType ||
      !formData.minute ||
      !formData.description
    ) {
      toast.error(
        'Match, Team, Event Type, Minute, and Description are required'
      );
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        player: formData.player || undefined,
        relatedPlayer: formData.relatedPlayer || undefined,
        outcome: formData.outcome || undefined,
      };
      const response = await saveMatchEvent(dataToSave);
      if (response.status === 201) {
        toast.success('Event saved successfully');
        onUpdate('success');
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 space-y-4">
      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section */}
        <div className="space-y-4">
          {/* TEAM */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">Team *</label>
            <select
              name="team"
              value={formData.team}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* PLAYER with search */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">
              Player *
            </label>
            <input
              type="text"
              placeholder="Search player..."
              value={search.player}
              onChange={(e) => setSearch({ ...search, player: e.target.value })}
              className="border rounded-lg p-2 mb-2 focus:ring-2 focus:ring-blue-400"
            />
            <select
              name="player"
              value={formData.player}
              onChange={handleChange}
              className="border rounded-lg p-2"
            >
              <option value="">Select player</option>
              {allPlayers
                .filter((p) =>
                  `${p?.player?.firstname} ${p?.player?.lastname}`
                    .toLowerCase()
                    .includes(search.player.toLowerCase())
                )
                .map((item) => (
                  <option key={item?.player?._id} value={item?.player?._id}>
                    {item?.player?.firstname} {item?.player?.lastname}
                  </option>
                ))}
            </select>
          </div>

          {/* RELATED PLAYER with search */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">
              Related Player
            </label>
            <input
              type="text"
              placeholder="Search related player..."
              value={search.relatedPlayer}
              onChange={(e) =>
                setSearch({ ...search, relatedPlayer: e.target.value })
              }
              className="border rounded-lg p-2 mb-2 focus:ring-2 focus:ring-blue-400"
            />
            <select
              name="relatedPlayer"
              value={formData.relatedPlayer}
              onChange={handleChange}
              className="border rounded-lg p-2"
            >
              <option value="">Select related player</option>
              {allPlayers
                .filter((p) =>
                  `${p?.player?.firstname} ${p?.player?.lastname}`
                    .toLowerCase()
                    .includes(search.relatedPlayer.toLowerCase())
                )
                .map((item) => (
                  <option key={item?.player?._id} value={item?.player?._id}>
                    {item?.player?.firstname} {item?.player?.lastname}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          {/* MINUTE */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">
              Minute *
            </label>
            <input
              type="number"
              name="minute"
              value={formData.minute}
              onChange={handleChange}
              placeholder="Enter time"
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">
              Event Type *
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="border rounded-lg p-2"
            >
              <option value="">Select event</option>
              {eventOptions.map((event) => (
                <option key={event.value} value={event.value}>
                  {event.label}
                </option>
              ))}
            </select>
          </div>

          {/* OUTCOME */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">Outcome</label>
            <input
              type="text"
              name="outcome"
              value={formData.outcome}
              onChange={handleChange}
              placeholder="e.g., goal confirmed, goal cancelled"
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm font-medium">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </form>
  );
};

export default NewMatchEventForm;
