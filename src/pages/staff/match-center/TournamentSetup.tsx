import SetupTournament from '../../../component/staff/SetupTournament';
import SetupTournamentPerYear from '../../../component/staff/SetupTournamentPerYear';
import SetupTournamentYear from '../../../component/staff/SetupTournamentYear';
import SEO from '../../../utils/SEO';

const TournamentSetup = () => {
  return (
    <>
      <SEO mainData={{ title: 'Tournament Setup - Kickside News' }} />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tournament Setup</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Save All Changes
          </button>
        </div>

        <div className="flex space-x-2 border-b pb-2">
          <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium">
            Year Setup
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
            Teams
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
            Matches
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
            Venues
          </button>
        </div>

        <SetupTournamentYear />
        <SetupTournament />
        <SetupTournamentPerYear />

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Manage Venues</h2>
          <p className="text-gray-500">
            Add tournament venues with location and capacity details here.
          </p>
        </div>
      </div>
    </>
  );
};

export default TournamentSetup;
