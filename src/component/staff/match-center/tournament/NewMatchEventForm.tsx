import React, { useState } from 'react';
import { ITeam } from '../../../../utils/types/Tournaments';
import { saveMatchEvent } from '../../../../utils/requests/tournaments/tournamentsRequests';
import { toast } from 'react-toastify';
import GoalForm from './GoalForm';

const eventTypes = [
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

const remakeEventOptions = (events: string[]) => {
  return events.map((event) => ({
    value: event,
    label: event.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  }));
};

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
  isLoading?: boolean;
}

const NewMatchEventForm: React.FC<AddGoalFormProps> = ({
  players,
  teams,
  match,
  onUpdate,
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allPlayers = [...players.home, ...players.away];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear error when field is updated
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name as keyof typeof errors];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: any = {};
    if (!formData.team) newErrors.team = 'Team is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (!formData.minute) newErrors.minute = 'Minute is required';
    if (!formData.description)
      newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

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
        onUpdate('success');
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'goal', label: 'Goal', events: ['goal', 'own_goal', 'penalty_goal'] },
    {
      id: 'substitution',
      label: 'Substitution',
      events: ['substitution_in', 'substitution_out'],
    },
    {
      id: 'card',
      label: 'Card',
      events: ['yellow_card', 'red_card', 'second_yellow_card'],
    },
    { id: 'injury', label: 'Injury', events: ['injury'] },
    {
      id: 'other',
      label: 'Other',
      events: eventTypes.filter(
        (e) =>
          ![
            'goal',
            'own_goal',
            'penalty_goal',
            'substitution_in',
            'substitution_out',
            'yellow_card',
            'red_card',
            'second_yellow_card',
            'injury',
          ].includes(e)
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Match Event</h2>

      {/* Tab Navigation with improved styling */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-3 font-medium text-sm transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'goal' && (
          <GoalForm
            teams={teams}
            allPlayers={allPlayers}
            eventOptions={remakeEventOptions(
              tabs.find((t) => t.id === 'goal')!.events
            )}
            isLoading={isLoading || isSubmitting}
            match={match}
            onSubmit={handleSubmit}
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        )}

        {/* You'll need to create similar forms for other tabs */}
        {activeTab !== 'goal' && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg font-medium">
              Form for {tabs.find((t) => t.id === activeTab)?.label} events
            </p>
            <p className="text-sm mt-2">
              This form is currently under development
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewMatchEventForm;
