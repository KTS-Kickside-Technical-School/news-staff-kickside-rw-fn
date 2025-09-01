import React, { useState } from 'react';
import { ITeam } from '../../../../utils/types/Tournaments';
import GoalForm from './GoalForm';
import FaulForm from './FaulForm';

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
  isLoading = false,
}) => {


  const allPlayers = [...players.home, ...players.away];

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
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Match Event</h2>

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

      <div className="space-y-4">
        {activeTab === 'goal' && (
          <GoalForm
            teams={teams}
            allPlayers={allPlayers}
            eventOptions={remakeEventOptions(
              tabs.find((t) => t.id === 'goal')!.events
            )}
            isLoading={isLoading}
            match={match}
          />
        )}
        {activeTab === 'card' && (
          <FaulForm
            teams={teams}
            allPlayers={allPlayers}
            eventOptions={remakeEventOptions(
              tabs.find((t) => t.id === 'card')!.events
            )}
            isLoading={isLoading}
            match={match}
          />
        )}
        {activeTab !== 'goal' && activeTab !== 'card' && (
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
