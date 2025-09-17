// pages/staff/match-center/ViewSingleSeasonDetails.tsx
import { useEffect, useState } from 'react';
import { getSingleTournamentSeason } from '../../../utils/requests/tournaments/tournamentsRequests';
import { ITrSeason } from '../../../utils/types/Tournaments';
import { toast } from 'react-toastify';
import NewTournamentMatchModal from '../../../component/staff/match-center/NewTournamentMatchModal';
import { useParams } from 'react-router-dom';
import SEO from '../../../utils/SEO';
import MatchCard from '../../../component/staff/match-center/MatchCard';
import { formatTournamentsTime } from '../../../utils/helpers/tournamentsHelpers';
import LeagueStandingsTable from '../../../component/staff/match-center/season/LeagueStandingsTable';
import { FaPlus } from 'react-icons/fa';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../../component/ui';

const ViewSingleSeasonDetails = () => {
  const [season, setSeason] = useState<ITrSeason | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('summary');

  const [isNewMatchOpen, setIsNewMatchOpen] = useState<ITrSeason | null>(null);

  const { slug } = useParams();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getSingleTournamentSeason(slug || '');
      if (response.status === 200) {
        setSeason(response.data.season);
        setMatches(response.data.matches);
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching season details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const today = new Date().toDateString();
  const todayResults = matches.filter(
    (m) => m.status === 'finished' && new Date(m.date).toDateString() === today
  );
  const nextMatches = matches
    .filter((m) => m.status === 'scheduled' && new Date(m.date) > new Date())
    .slice(0, 5);
  const calculateTotalMatches = (teams: number) =>
    (teams * (teams - 1)) / 2 || 0;
  const calculateProgress = (matches: any, teams: number) => {
    const total = calculateTotalMatches(teams);
    const completed =
      matches?.filter((m: any) => m.status === 'finished').length || 0;
    return `${
      total > 0 ? Math.round((completed / total) * 100) : 0
    }% • ${total} matches`;
  };

  const progress = season ? calculateProgress(matches, season.teams.length) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6">
      <SEO mainData={{ title: `${season?.name}` }} />

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{season?.name}</h2>
          <p className="text-gray-600 mt-1">
            {season?.tournament?.description}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Founded: {season?.tournament?.foundedYear} • Type:{' '}
            {season?.tournament?.type}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <img
            src={season?.tournament?.country?.flagUrl}
            alt="flag"
            className="w-10 h-7 object-cover rounded"
          />
          <span className="font-medium text-gray-700">
            {season?.tournament?.country?.name}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{progress}</p>
      </div>

      <div className="mb-8">
        <button
          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm"
          onClick={() => setIsNewMatchOpen(season!)}
        >
          <FaPlus size={14} /> New Match
        </button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>

        <TabsContent className={'mt-3'} value="summary">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Today’s Results
                </h3>
                {todayResults.length > 0 ? (
                  <div className="grid gap-4">
                    {todayResults.map((match) => (
                      <MatchCard
                        key={match._id}
                        match={match}
                        formatTime={formatTournamentsTime}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No results today.</p>
                )}
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Upcoming Matches
                </h3>
                {nextMatches.length > 0 ? (
                  <div className="grid gap-4">
                    {nextMatches.map((match) => (
                      <MatchCard
                        key={match._id}
                        match={match}
                        formatTime={formatTournamentsTime}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No upcoming matches.</p>
                )}
              </section>
            </div>
          </div>
        </TabsContent>

        <TabsContent className={'mt-3'} value="fixtures">
          <div className="grid gap-4">
            {matches
              .filter((m) => m.status === 'scheduled')
              .map((match) => (
                <MatchCard
                  key={match._id}
                  match={match}
                  formatTime={formatTournamentsTime}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent className={'mt-3'} value="results">
          <div className="grid gap-4">
            {matches
              .filter((m) => m.status === 'finished')
              .map((match) => (
                <MatchCard
                  key={match._id}
                  match={match}
                  formatTime={formatTournamentsTime}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent className={'mt-3'} value="table">
          <LeagueStandingsTable
            matches={matches}
            allTeams={season?.teams}
            season={season}
          />
        </TabsContent>
      </Tabs>

      {isNewMatchOpen && (
        <NewTournamentMatchModal
          tournament={isNewMatchOpen}
          onClose={() => setIsNewMatchOpen(null)}
        />
      )}
    </div>
  );
};

export default ViewSingleSeasonDetails;
