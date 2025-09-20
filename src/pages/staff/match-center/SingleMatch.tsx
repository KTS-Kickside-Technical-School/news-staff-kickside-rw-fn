import { useParams } from 'react-router-dom';
import SEO from '../../../utils/SEO';
import { toast, ToastContainer } from 'react-toastify';
import {
  getSingleMatchInfo,
  getSingleTournamentSeason,
  updateMatch,
} from '../../../utils/requests/tournaments/tournamentsRequests';
import { useEffect, useState } from 'react';
import { ITrMatch, ITrSeason } from '../../../utils/types/Tournaments';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Separator,
  Modal,
} from '../../../component/ui';
import {
  formatEventType,
  formatTimeOnly,
  formatTournamentsTime,
} from '../../../utils/helpers/tournamentsHelpers';
import UpdateMatchStatusForm from '../../../component/staff/match-center/tournament/UpdateMatchStatusForm';
import NewMatchEventForm from '../../../component/staff/match-center/tournament/NewMatchEventForm';
import EditTournamentMatchModal from '../../../component/staff/match-center/EditTournamentMatchModal';
import Skeleton from 'react-loading-skeleton';

const SingleMatch = () => {
  const params = useParams();
  const matchId = params.id || '';
  const [match, setMatch] = useState<ITrMatch | null>(null);
  const [matchActivities, setMatchActivities] = useState<any>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [players, setPlayers] = useState<any>([]);
  const [season, setSeason] = useState<ITrSeason | null>(null);
  const [isLoadingTournament, setIsLoadingTournament] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const getMatch = async () => {
    try {
      setIsLoading(true);
      const response = await getSingleMatchInfo(matchId);

      if (response.status === 200) {
        setMatch(response.data.match);
        setMatchActivities(response.data.matchActivities || []);
        setHomeScore(response.data.match.homeScore?.toString() || '0');
        setAwayScore(response.data.match.awayScore?.toString() || '0');
        setPlayers(response.data.players || []);
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message || 'Error getting match details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTournament = async () => {
    if (!match?.tournamentSeason?.slug) return;

    setIsLoadingTournament(true);
    try {
      const response = await getSingleTournamentSeason(
        match.tournamentSeason.slug
      );

      if (response.status === 200) {
        setSeason(response.data.season);
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching season details');
    } finally {
      setIsLoadingTournament(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      const response = await updateMatch(matchId, { status: newStatus });

      if (response.status === 200) {
        toast.success('Match status updated successfully');
        setMatch((prev) => (prev ? { ...prev, status: newStatus } : null));
        setIsStatusModalOpen(false);
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error updating match status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveScore = async () => {
    try {
      setIsUpdatingStatus(true);
      const response = await updateMatch(matchId, {
        homeScore: parseInt(homeScore) || 0,
        awayScore: parseInt(awayScore) || 0,
      });

      if (response.status === 200) {
        toast.success('Match score updated successfully');
        setMatch((prev) =>
          prev
            ? {
                ...prev,
                homeScore: parseInt(homeScore) || 0,
                awayScore: parseInt(awayScore) || 0,
              }
            : null
        );
        setIsEditingScore(false);
      } else {
        throw new Error(response.message || 'Failed to update score');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error updating match score');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCancelEdit = () => {
    setHomeScore(match?.homeScore?.toString() || '0');
    setAwayScore(match?.awayScore?.toString() || '0');
    setIsEditingScore(false);
  };

  useEffect(() => {
    getMatch();
  }, [matchId]);

  useEffect(() => {
    if (match?.tournamentSeason?.slug) {
      fetchTournament();
    }
  }, [match]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { variant: 'secondary', label: 'Scheduled' },
      in_progress: { variant: 'warning', label: 'Live' },
      finished: { variant: 'success', label: 'Finished' },
      postponed: { variant: 'destructive', label: 'Postponed' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: 'default',
      label: status,
    };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">
            Loading match details...
          </h2>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground">
            Match not found
          </h2>
          <p className="text-muted-foreground">
            The requested match could not be loaded.
          </p>
          <Button onClick={getMatch} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        mainData={{
          title: `${match.homeTeam?.name} vs ${match.awayTeam?.name} - Match Details`,
        }}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />

      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Match Status"
      >
        <UpdateMatchStatusForm
          currentStatus={match.status || ''}
          onUpdate={handleUpdateStatus}
          onCancel={() => setIsStatusModalOpen(false)}
          isLoading={isUpdatingStatus}
        />
      </Modal>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Match Details</h1>
          {isLoadingTournament ? (
            <Skeleton className="h-6 w-64 mt-2" />
          ) : (
            <p className="text-muted-foreground">
              {match.tournamentSeason?.name} •{' '}
              {match.matchTime
                ? new Date(match.matchTime).toLocaleDateString()
                : 'Date not available'}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setEditModalOpen(true)}
            disabled={isLoadingTournament}
          >
            {isLoadingTournament ? 'Loading...' : 'Edit Match Info'}
          </Button>
          <Button
            onClick={() => setActiveTab('activities')}
            disabled={isLoadingTournament}
          >
            Add Activity
          </Button>
          <Button
            variant="secondary"
            onClick={() => setActiveTab('lineup')}
            disabled={isLoadingTournament}
          >
            Manage Lineup
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="lineup">Lineup</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Match Information</CardTitle>
                  {getStatusBadge(match?.status || '')}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 items-center text-center py-6">
                  {/* Home Team */}
                  <div className="space-y-4">
                    {match.homeTeam?.logo ? (
                      <img
                        src={match.homeTeam.logo}
                        alt={match.homeTeam.name}
                        className="w-20 h-20 mx-auto object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-500">
                        {match.homeTeam?.name?.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="hidden w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-500">
                      {match.homeTeam?.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-semibold">
                      {match.homeTeam?.name}
                    </h3>
                    {isEditingScore ? (
                      <input
                        type="number"
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        className="text-3xl font-bold text-center w-20 mx-auto border rounded px-2 py-1"
                        min="0"
                      />
                    ) : (
                      <div className="text-3xl font-bold">
                        {match.homeScore ?? 0}
                      </div>
                    )}
                  </div>

                  {/* VS Section */}
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">VS</div>
                    <div className="text-lg text-muted-foreground">
                      {match.matchTime
                        ? formatTournamentsTime(match.matchTime)
                        : 'N/A'}{' '}
                      {match.matchTime ? formatTimeOnly(match.matchTime) : ''}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {match.matchDuration || 90} minutes
                    </div>
                    {isEditingScore && (
                      <div className="flex justify-center gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={handleSaveScore}
                          disabled={isUpdatingStatus}
                          className="min-w-16"
                        >
                          {isUpdatingStatus ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Saving...
                            </div>
                          ) : (
                            'Save'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={isUpdatingStatus}
                          className="min-w-16"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="space-y-4">
                    {match.awayTeam?.logo ? (
                      <img
                        src={match.awayTeam.logo}
                        alt={match.awayTeam.name}
                        className="w-20 h-20 mx-auto object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-500">
                        {match.awayTeam?.name?.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="hidden w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-500">
                      {match.awayTeam?.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-semibold">
                      {match.awayTeam?.name}
                    </h3>
                    {isEditingScore ? (
                      <input
                        type="number"
                        value={awayScore}
                        onChange={(e) => setAwayScore(e.target.value)}
                        className="text-3xl font-bold text-center w-20 mx-auto border rounded px-2 py-1"
                        min="0"
                      />
                    ) : (
                      <div className="text-3xl font-bold">
                        {match.awayScore ?? 0}
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Tournament:</span>{' '}
                    {match.tournamentSeason?.name || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold">Season:</span>{' '}
                    {match.tournamentSeason?.year?.name || 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold">Match Time:</span>{' '}
                    {match.matchTime
                      ? new Date(match.matchTime).toLocaleString()
                      : 'N/A'}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{' '}
                    {match.status || 'N/A'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsStatusModalOpen(true)}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                      Updating...
                    </div>
                  ) : (
                    'Change Match Status'
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsEditingScore(true)}
                  disabled={isEditingScore || isUpdatingStatus}
                >
                  Update Score
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activities Card */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {isSavingGoal ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Updating activities...
                    </p>
                  </div>
                ) : matchActivities?.length === 0 ? (
                  <div className="text-muted-foreground text-center py-4">
                    No activities yet
                  </div>
                ) : (
                  <>
                    {matchActivities.slice(0, 3).map((activity: any) => (
                      <div
                        key={activity?._id}
                        className="py-2 border-b last:border-b-0"
                      >
                        <div className="font-medium">
                          {activity.minute}'{' '}
                          {formatEventType(activity?.eventType)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {activity?.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity?.createdAt
                            ? new Date(activity.createdAt).toLocaleString()
                            : 'N/A'}
                        </div>
                      </div>
                    ))}
                    {matchActivities.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => setActiveTab('activities')}
                      >
                        View All Activities
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>New Match Event</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <NewMatchEventForm
                  match={match}
                  teams={[match.homeTeam, match.awayTeam]}
                  players={players}
                  onUpdate={() => {
                    setIsSavingGoal(true);
                    getMatch().then(() => {
                      setIsSavingGoal(false);
                    });
                  }}
                  isLoading={isSavingGoal}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lineup">
          <Card>
            <CardHeader>
              <CardTitle>Lineup Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Lineup management feature coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Match Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Statistics feature coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Media management feature coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {editModalOpen && season && (
        <EditTournamentMatchModal
          tournament={season}
          match={match}
          onClose={() => setEditModalOpen(false)}
          onMatchUpdated={getMatch}
        />
      )}
    </>
  );
};

export default SingleMatch;
