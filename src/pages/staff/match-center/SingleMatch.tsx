import { useParams } from 'react-router-dom';
import SEO from '../../../utils/SEO';
import { toast } from 'react-toastify';
import {
  getSingleMatchInfo,
  updateMatch,
} from '../../../utils/requests/tournaments/tournamentsRequests';
import { useEffect, useState } from 'react';
import { ITrMatch } from '../../../utils/types/Tournaments';
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
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [players, setPlayers] = useState<any>();

  const getMatch = async () => {
    try {
      setIsLoading(true);
      const response = await getSingleMatchInfo(matchId);
      console.log(response);
      if (response.status === 200) {
        setMatch(response.data.match);
        setMatchActivities(response.data.matchActivities);
        setHomeScore(response.data.match.homeScore?.toString() || '0');
        setAwayScore(response.data.match.awayScore?.toString() || '0');
        setPlayers(response.data.players);
        return;
      }
      throw new Error(response.message);
    } catch (error: any) {
      toast.error(error.message || 'Error getting match details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      const response = await updateMatch(matchId, { status: newStatus });
      console.log(response);
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
        homeScore: parseInt(homeScore),
        awayScore: parseInt(awayScore),
      });

      if (response.status === 200) {
        toast.success('Match score updated successfully');
        setMatch((prev) =>
          prev
            ? {
                ...prev,
                homeScore: parseInt(homeScore),
                awayScore: parseInt(awayScore),
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
  }, []);

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
      <Modal
        isOpen={isAddingGoal}
        onClose={() => setIsAddingGoal(false)}
        title="Add Match Event"
      >
        <NewMatchEventForm
          match={match}
          teams={[match.homeTeam, match.awayTeam]}
          players={players}
          onUpdate={() => {
            setIsSavingGoal(true);
            getMatch();
            setIsAddingGoal(false);
            setIsSavingGoal(false);
          }}
          onCancel={() => setIsAddingGoal(false)}
          isLoading={isSavingGoal}
        />
      </Modal>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Match Details</h1>
          <p className="text-muted-foreground">
            {match.tournamentSeason?.name} •{' '}
            {new Date(match.matchTime).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            Edit Match Info
          </Button>
          <Button onClick={() => {}}>Add Activity</Button>
          <Button
            variant="secondary"
            onClick={() => {
              /* Add lineup functionality */
            }}
          >
            Manage Lineup
          </Button>
        </div>
      </div>
      {/* Main Content Tabs */}
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
                  <div className="space-y-4">
                    <img
                      src={match.homeTeam?.logo}
                      alt={match.homeTeam?.name}
                      className="w-20 h-20 mx-auto object-contain"
                    />
                    <h3 className="text-xl font-semibold">
                      {match.homeTeam?.name}
                    </h3>
                    {isEditingScore ? (
                      <input
                        type="number"
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        className="text-3xl font-bold text-center w-20 mx-auto"
                        min="0"
                      />
                    ) : (
                      <div className="text-3xl font-bold">
                        {match.homeScore}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-2xl font-bold">VS</div>
                    <div className="text-lg text-muted-foreground">
                      {formatTournamentsTime(match.matchTime)}{' '}
                      {formatTimeOnly(match.matchTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {match.matchDuration} minutes
                    </div>
                    {isEditingScore && (
                      <div className="flex justify-center gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={handleSaveScore}
                          disabled={isUpdatingStatus}
                        >
                          {isUpdatingStatus ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={isUpdatingStatus}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <img
                      src={match.awayTeam?.logo}
                      alt={match.awayTeam?.name}
                      className="w-20 h-20 mx-auto object-contain"
                    />
                    <h3 className="text-xl font-semibold">
                      {match.awayTeam?.name}
                    </h3>
                    {isEditingScore ? (
                      <input
                        type="number"
                        value={awayScore}
                        onChange={(e: any) => setAwayScore(e.target.value)}
                        className="text-3xl font-bold text-center w-20 mx-auto"
                        min="0"
                      />
                    ) : (
                      <div className="text-3xl font-bold">
                        {match.awayScore}
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Tournament:</span>{' '}
                    {match.tournamentSeason?.name}
                  </div>
                  <div>
                    <span className="font-semibold">Season:</span>{' '}
                    {match.tournamentSeason?.year?.name}
                  </div>
                  <div>
                    <span className="font-semibold">Match Time:</span>{' '}
                    {new Date(match.matchTime).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{' '}
                    {match.status}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setIsStatusModalOpen(true);
                  }}
                >
                  Change Match Status
                </Button>
                {/* <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setIsEditingScore(true);
                  }}
                  disabled={isEditingScore}
                >
                  Update Score
                </Button> */}

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setIsAddingGoal(true);
                  }}
                >
                  New Event
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {matchActivities?.slice(0, 3).map((activity: any) => (
                  <div
                    key={activity?._id}
                    className="py-2 border-b last:border-b-0"
                  >
                    <div className="font-medium">
                      {activity.minute}' {formatEventType(activity?.eventType)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity?.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity?.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
                {matchActivities?.length === 0 && (
                  <div className="text-muted-foreground text-center py-4">
                    No activities yet
                  </div>
                )}
                {matchActivities?.length > 3 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => setActiveTab('activities')}
                  >
                    View All Activities
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Activities Tab */}
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Match Activities</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingGoal(true);
                  }}
                >
                  Add New Activity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matchActivities?.map((activity: any) => (
                  <div key={activity?._id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">
                          {activity.minute}'{' '}
                          {formatEventType(activity?.eventType)}
                        </h4>
                        <p className="text-muted-foreground">
                          [{activity?.outcome}]{activity?.description}
                        </p>
                      </div>
                      <div>
                        {activity?.player?.firstname}{' '}
                        {activity?.player?.lastname}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {new Date(activity?.createdAt).toLocaleString()}
                        </div>
                        <Button variant="ghost" size="sm" className="mt-2">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {matchActivities?.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No activities recorded for this match
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Placeholder Tabs for Future Features */}
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
    </>
  );
};

export default SingleMatch;
