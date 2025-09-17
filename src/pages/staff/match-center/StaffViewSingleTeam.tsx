import { FaPlus, FaSearch } from 'react-icons/fa';
import { FiRefreshCw, FiFilter } from 'react-icons/fi';
import SEO from '../../../utils/SEO';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ICountry, ITeam } from '../../../utils/types/Tournaments';
import {
  createNewTeamPlayer,
  getSingleTeam,
  getTeamPlayers,
} from '../../../utils/requests/tournaments/teamsRequests';
import { useParams } from 'react-router-dom';
import { getCountries } from '../../../utils/requests/tournaments/countriesRequest';
import NewTeamPlayer from '../../../component/staff/match-center/team/NewTeamPlayer';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../component/ui';
import TeamPlayerInfo from '../../../component/staff/match-center/team/TeamPlayerInfo';
import { playerPositions } from '../../../utils/helpers/teamHelpers';

const StaffViewSingleTeam = () => {
  const [team, setTeam] = useState<ITeam | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<any[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState('currentPlayers');
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const { id } = useParams<{ id: string }>();

  const [newPlayer, setNewPlayer] = useState({
    firstName: '',
    lastName: '',
    nationality: null,
    dateOfBirth: null,
    height: null,
    weight: null,
    preferredFoot: '',
    image: '',
    jerseyNumber: null,
    position: null,
    playerValue: null,
    contractStatus: '',
    contractStartDate: null,
    contractEndDate: null,
    isStillPlaying: true,
  });

  const fetchTeam = useCallback(
    async (isRefresh = false) => {
      try {
        isRefresh ? setRefreshing(true) : setLoadingTeam(true);
        const response = await getSingleTeam(id || '');
        if (response.status === 200) {
          setTeam(response.data.team);
        } else {
          toast.error('Failed to fetch team details');
        }
      } catch (error: any) {
        toast.error(error.message || 'Error fetching team details');
      } finally {
        isRefresh ? setRefreshing(false) : setLoadingTeam(false);
      }
    },
    [id]
  );

  const fetchPlayers = useCallback(async () => {
    try {
      setLoadingPlayers(true);
      const response = await getTeamPlayers(id || '');

      if (response.status === 200) {
        const playersData = response.data.players || [];
        setPlayers(playersData);
        setFilteredPlayers(playersData);
      } else {
        toast.error('Failed to fetch players');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error fetching players');
    } finally {
      setLoadingPlayers(false);
    }
  }, [id]);

  const handleCreatePlayer = async () => {
    if (!newPlayer.firstName) {
      toast.error('Please fill in required fields');
      return;
    }
    try {
      const response = await createNewTeamPlayer({
        ...newPlayer,
        team: id,
      });

      if (response.status === 201) {
        toast.success('Player added successfully');
        setNewPlayer({
          firstName: '',
          lastName: '',
          nationality: null,
          dateOfBirth: null,
          height: null,
          weight: null,
          preferredFoot: '',
          image: '',
          jerseyNumber: null,
          position: null,
          playerValue: null,
          contractStatus: '',
          contractStartDate: null,
          contractEndDate: null,
          isStillPlaying: true,
        });
        setShowModal(false);
        fetchPlayers();
      } else {
        toast.error(response.message || 'Error adding player');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error adding player');
    }
  };

  const [countries, setCountries] = useState<ICountry[]>([]);
  const fetchCountries = async () => {
    try {
      const response = await getCountries();
      if (response.status === 200) {
        setCountries(response.data);
      } else {
        toast.error('Failed to fetch countries');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error fetching countries');
    }
  };

  useEffect(() => {
    let result = players;

    if (tab === 'currentPlayers') {
      result = result.filter((player) =>
        player.stints.some((stint: any) => stint.isStillPlaying)
      );
    } else if (tab === 'formerPlayers') {
      result = result.filter(
        (player) => !player.stints.some((stint: any) => stint.isStillPlaying)
      );
    }

    if (searchTerm) {
      result = result.filter((player) =>
        `${player.player.firstname} ${player.player.lastname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (positionFilter !== 'all') {
      result = result.filter((player) =>
        player.stints?.some((stint: any) => stint.position === positionFilter)
      );
    }

    setFilteredPlayers(result);
  }, [players, searchTerm, positionFilter, tab]);

  useEffect(() => {
    if (!id) return;
    fetchTeam();
    fetchPlayers();
    fetchCountries();
  }, [id, fetchTeam, fetchPlayers]);

  const positions = playerPositions;

  if (loadingTeam) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <>
      <SEO
        mainData={{
          title: `${team?.name || 'Team'} - Kickside Rwanda`,
          description: 'View and manage teams in the Kickside News system.',
        }}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            {team?.logo && (
              <img
                src={team.logo}
                alt={team.name}
                className="w-16 h-16 object-contain rounded-lg border border-gray-200"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {team?.name || 'Loading team...'}
              </h1>
              {team?.country && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-600">{team.country.name}</span>
                  {team.country.flagUrl && (
                    <img
                      src={team.country.flagUrl}
                      alt={team.country.name}
                      className="w-5 h-4 object-cover rounded-sm"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                fetchTeam(true);
                fetchPlayers();
              }}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="text-sm" />
              Add Player
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Total Players
            </h3>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">{players.length}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">All registered players</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Current Squad
            </h3>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">
                {
                  players.filter((p) =>
                    p.stints.some((s: any) => s.isStillPlaying)
                  ).length
                }
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">Active players</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Player Roster</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Positions</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="currentPlayers">Current Squad</TabsTrigger>
            <TabsTrigger value="formerPlayers">Former Players</TabsTrigger>
          </TabsList>

          <TabsContent value={tab}>
            {loadingPlayers ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredPlayers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🏃‍♂️</div>
                <p className="text-lg">No players found</p>
                <p className="text-sm">
                  Try adjusting your search or add new players
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlayers.map((player) => (
                  <TeamPlayerInfo player={player} key={player._id} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {showModal && (
        <NewTeamPlayer
          countries={countries}
          team={team!}
          newPlayer={newPlayer}
          setNewPlayer={setNewPlayer}
          setShowModal={setShowModal}
          handleCreatePlayer={handleCreatePlayer}
        />
      )}
    </>
  );
};

export default StaffViewSingleTeam;
