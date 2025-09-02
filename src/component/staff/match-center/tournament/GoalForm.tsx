import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { saveMatchEvent } from '../../../../utils/requests/tournaments/tournamentsRequests';

interface Player {
  _id: string;
  firstname: string;
  lastname: string;
}

interface Team {
  _id: string;
  name: string;
}

interface EventOption {
  value: string;
  label: string;
}

interface Match {
  _id: string;
  homeTeam: Team;
  awayTeam: Team;
}

interface SquadPlayer {
  player: Player;
  team: Team;
}

interface GoalFormProps {
  teams: any[];
  allPlayers: SquadPlayer[];
  eventOptions: EventOption[];
  isLoading: boolean;
  match: Match;
}

const GoalForm = ({
  teams,
  allPlayers,
  eventOptions,
  isLoading,
  match,
}: GoalFormProps) => {
  const [search, setSearch] = useState({
    player: '',
    relatedPlayer: '',
  });

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDescriptionEdited, setIsDescriptionEdited] = useState(false);

  const isOwnGoal = formData.eventType === 'own_goal';

  const getBenefitingTeam = () => {
    if (!isOwnGoal || !match || !formData.team) return null;

    return match.homeTeam._id === formData.team
      ? match.awayTeam
      : match.homeTeam;
  };

  useEffect(() => {
    if (match?._id) {
      setFormData((prev) => ({ ...prev, match: match._id }));
    }
  }, [match]);

  useEffect(() => {
    if (
      !isDescriptionEdited &&
      formData.team &&
      formData.player &&
      formData.minute &&
      formData.eventType
    ) {
      const newDescription = generateDescription();
      setFormData((prev) => ({ ...prev, description: newDescription }));
    }
  }, [
    formData.team,
    formData.player,
    formData.relatedPlayer,
    formData.minute,
    formData.eventType,
    isDescriptionEdited,
    isOwnGoal,
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'description') {
      setIsDescriptionEdited(true);
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRegenerateDescription = () => {
    const newDescription = generateDescription();
    setFormData((prev) => ({ ...prev, description: newDescription }));
    setIsDescriptionEdited(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.minute) {
      newErrors.minute = 'Minute is required';
    } else if (
      parseInt(formData.minute) < 1 ||
      parseInt(formData.minute) > 120
    ) {
      newErrors.minute = 'Minute must be between 1 and 120';
    }

    if (!formData.team) {
      newErrors.team = 'Team is required';
    }

    if (!formData.eventType) {
      newErrors.eventType = 'Goal type is required';
    }

    if (!formData.player) {
      newErrors.player = 'Goal scorer is required';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    if (!formData.outcome) {
      newErrors.outcome = 'Outcome is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateDescription = () => {
    const scoringTeam = teams.find((t) => t._id === formData.team);
    const scoringTeamName = scoringTeam?.name || 'Unknown Team';

    let benefitingTeam = scoringTeam;
    let benefitingTeamName = scoringTeamName;

    if (isOwnGoal && match) {
      benefitingTeam =
        match.homeTeam._id === formData.team ? match.awayTeam : match.homeTeam;
      benefitingTeamName = benefitingTeam?.name || 'Opponent';
    }

    const player = allPlayers.find(
      (p) => p.player._id === formData.player
    )?.player;
    const playerName = player
      ? `${player.firstname} ${player.lastname}`
      : 'Unknown Player';

    let relatedPlayerName = '';
    if (formData.relatedPlayer) {
      const relatedPlayer = allPlayers.find(
        (p) => p.player._id === formData.relatedPlayer
      )?.player;
      relatedPlayerName = relatedPlayer
        ? `${relatedPlayer.firstname} ${relatedPlayer.lastname}`
        : 'Unknown Player';
    }

    const goalType =
      eventOptions.find((e) => e.value === formData.eventType)?.label || 'Goal';

    let description = '';

    if (isOwnGoal) {
      description = `Own goal scored by ${playerName} (${scoringTeamName}) for ${benefitingTeamName} in the ${formData.minute} minute`;
    } else {
      description = `${goalType} scored by ${playerName} for ${scoringTeamName} in the ${formData.minute} minute`;
    }

    if (relatedPlayerName && !isOwnGoal) {
      description += `, assisted by ${relatedPlayerName}`;
    }

    return description + '.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      let teamToCredit = formData.team;

      if (isOwnGoal && match) {
        teamToCredit =
          match.homeTeam._id === formData.team
            ? match.awayTeam._id
            : match.homeTeam._id;
      }

      const dataToSave = {
        ...formData,
        team: teamToCredit,
        player: formData.player || undefined,
        relatedPlayer: formData.relatedPlayer || undefined,
        outcome: formData.outcome || undefined,
        metadata: isOwnGoal
          ? {
              ownGoalScoredByTeam: formData.team,
              ownGoalScoredByPlayer: formData.player,
            }
          : undefined,
      };

      const response = await saveMatchEvent(dataToSave);

      if (response.status === 201) {
        toast.success('Goal event saved successfully');

        setFormData({
          match: match._id,
          team: '',
          player: '',
          relatedPlayer: '',
          minute: '',
          eventType: '',
          outcome: '',
          description: '',
        });

        setSearch({
          player: '',
          relatedPlayer: '',
        });

        setIsDescriptionEdited(false);

        return;
      }

      throw new Error(response.message || 'Failed to save event');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save goal event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPlayers = formData.team
    ? allPlayers.filter((player) => player.team._id === formData.team)
    : allPlayers;

  const benefitingTeam = getBenefitingTeam();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            New Goal Event Details
          </h2>
          <p className="text-gray-600 mt-1">
            {match?.homeTeam?.name || 'Home'} vs{' '}
            {match?.awayTeam?.name || 'Away'}
          </p>
          {isOwnGoal && (
            <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
              <p className="text-yellow-800 text-sm font-medium">
                ⚠️ Own Goal Selected: The goal will be credited to{' '}
                {benefitingTeam?.name || 'the opposing team'}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
                Minute <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="minute"
                min="1"
                max="120"
                value={formData.minute}
                onChange={handleChange}
                placeholder="Enter minute"
                className={`border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  errors.minute ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.minute && (
                <p className="text-red-500 text-xs mt-1">{errors.minute}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
                {isOwnGoal ? 'Team Scoring Own Goal' : 'Scoring Team'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <select
                name="team"
                value={formData.team}
                onChange={handleChange}
                className={`border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  errors.team ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.team && (
                <p className="text-red-500 text-xs mt-1">{errors.team}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
                Goal Type <span className="text-red-500">*</span>
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className={`border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  errors.eventType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select goal type</option>
                {eventOptions.map((event: EventOption) => (
                  <option key={event.value} value={event.value}>
                    {event.label}
                  </option>
                ))}
              </select>
              {errors.eventType && (
                <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm font-medium mb-1">
                Outcome
              </label>
              <input
                name="outcome"
                value={formData.outcome}
                onChange={handleChange}
                className={`border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent  ${
                  errors.outcome ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter outcome"
              />
              {errors.outcome && (
                <p className="text-red-500 text-xs mt-1">{errors.outcome}</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Player Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm font-medium mb-1">
                  {isOwnGoal ? 'Player Scoring Own Goal' : 'Goal Scorer'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Search player..."
                  value={search.player}
                  onChange={(e) =>
                    setSearch({ ...search, player: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-3 mb-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <select
                  name="player"
                  value={formData.player}
                  onChange={handleChange}
                  className={`border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                    errors.player ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={!formData.team}
                >
                  <option value="">Select player</option>
                  {filteredPlayers
                    .filter((p) =>
                      `${p.player.firstname} ${p.player.lastname}`
                        .toLowerCase()
                        .includes(search.player.toLowerCase())
                    )
                    .map((item) => (
                      <option key={item.player._id} value={item.player._id}>
                        {item.player.firstname} {item.player.lastname} (
                        {item.team.name})
                      </option>
                    ))}
                </select>
                {!formData.team && (
                  <p className="text-gray-500 text-xs mt-1">
                    Please select a team first
                  </p>
                )}
                {errors.player && (
                  <p className="text-red-500 text-xs mt-1">{errors.player}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 text-sm font-medium mb-1">
                  Assisting Player
                </label>
                {isOwnGoal ? (
                  <p className="text-gray-500 text-sm italic">
                    No assist for own goals
                  </p>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Search assisting player..."
                      value={search.relatedPlayer}
                      onChange={(e) =>
                        setSearch({ ...search, relatedPlayer: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg p-3 mb-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    <select
                      name="relatedPlayer"
                      value={formData.relatedPlayer}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      disabled={!formData.team}
                    >
                      <option value="">Select player</option>
                      {filteredPlayers
                        .filter((p) =>
                          `${p.player.firstname} ${p.player.lastname}`
                            .toLowerCase()
                            .includes(search.relatedPlayer.toLowerCase())
                        )
                        .map((item) => (
                          <option key={item.player._id} value={item.player._id}>
                            {item.player.firstname} {item.player.lastname} (
                            {item.team.name})
                          </option>
                        ))}
                    </select>
                  </>
                )}
                {!formData.team && !isOwnGoal && (
                  <p className="text-gray-500 text-xs mt-1">
                    Please select a team first
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 text-sm font-medium">
                Event Description <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleRegenerateDescription}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                disabled={
                  !formData.team ||
                  !formData.player ||
                  !formData.minute ||
                  !formData.eventType
                }
              >
                Regenerate from fields
              </button>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Event description will be auto-generated based on form fields"
              className={`border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
            {isDescriptionEdited && (
              <p className="text-gray-500 text-xs mt-1">
                Description has been manually edited
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              {isLoading || isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Goal Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default GoalForm;
