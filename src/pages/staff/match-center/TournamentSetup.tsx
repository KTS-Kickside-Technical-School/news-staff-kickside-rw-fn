import { useState } from 'react';
import ViewTournamentsSeasons from './ViewTournamentsSeasons';
import SetupTournament from '../../../component/staff/SetupTournament';
import SetupTournamentPerYear from '../../../component/staff/SetupTournamentPerYear';
import SetupTournamentYear from '../../../component/staff/SetupTournamentYear';
import SEO from '../../../utils/SEO';
import NewPlayer from '../../../component/staff/match-center/NewPlayer';
import PlayersList from '../../../component/staff/match-center/PlayersList';

const tabs = [
  { key: '0', label: 'Year Setup', component: <SetupTournamentYear /> },
  { key: '1', label: 'Setup Tournaments', component: <SetupTournament /> },
  {
    key: '2',
    label: 'Setup Seasons',
    component: <SetupTournamentPerYear />,
  },
  {
    key: '3',
    label: 'View Seasons',
    component: <ViewTournamentsSeasons />,
  },
  {
    key: '4',
    label: 'New Player',
    component: <NewPlayer />,
  },
  {
    key: '5',
    label: 'Players',
    component: <PlayersList />,
  },
];

const TournamentSetup = () => {
  const [activeTab, setActiveTab] = useState<string>('year');

  return (
    <>
      <SEO mainData={{ title: 'Tournament Setup - Kickside News' }} />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tournaments Setup</h1>
        </div>

        <div className="flex space-x-2 border-b pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-medium transition ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="space-y-6 mt-4">
          {tabs.map(
            (tab) =>
              tab.key === activeTab && (
                <div key={tab.key} className="bg-white shadow rounded-lg p-6">
                  {tab.component}
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
};

export default TournamentSetup;
