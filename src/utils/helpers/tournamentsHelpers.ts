export const formatTournamentsTime = (time: string | Date) => {
    if (!time) return '-';
    const date = new Date(time);
    const now = new Date();

    const isSameDay =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate();

    if (isSameDay) return 'Today';
    if (isYesterday) return 'Yesterday';

    const weekDay = date.toLocaleDateString('en-US', { weekday: 'long' });
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    if (date >= weekStart && date <= weekEnd) return weekDay;

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };

    return date.toLocaleString('en-US', options);
};

export const formatTimeOnly = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const calculateAge = (birthdate: string) => {
    if (!birthdate) return "-";
    const birth = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
};


export function formatEventType(eventType: string | undefined): string {
  if (!eventType) return "";

  const map: Record<string, string> = {
    goal: "Goal",
    own_goal: "Own Goal",
    penalty_goal: "Penalty Goal",
    assist: "Assist",
    shot_on_target: "Shot on Target",
    shot_off_target: "Shot off Target",
    penalty_missed: "Penalty Missed",
    yellow_card: "Yellow Card",
    red_card: "Red Card",
    second_yellow_card: "Second Yellow Card",
    substitution_in: "Substitution In",
    substitution_out: "Substitution Out",
    foul_committed: "Foul Committed",
    foul_suffered: "Foul Suffered",
    free_kick_awarded: "Free Kick Awarded",
    penalty_awarded: "Penalty Awarded",
    kickoff: "Kickoff",
    half_time: "Half Time",
    full_time: "Full Time",
    extra_time_start: "Extra Time Start",
    extra_time_end: "Extra Time End",
    penalty_shootout_start: "Penalty Shootout Start",
    penalty_shootout_end: "Penalty Shootout End",
    corner_kick: "Corner Kick",
    throw_in: "Throw In",
    injury: "Injury",
    VAR_check: "VAR Check",
    goal_cancelled: "Goal Cancelled",
  };

  return map[eventType] || eventType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
