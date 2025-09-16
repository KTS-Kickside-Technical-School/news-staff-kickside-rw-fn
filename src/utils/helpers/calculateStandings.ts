export interface StandingsTeam {
    team: string;
    teamId?: string; // Added team ID for reference
    logo?: string;   // Added logo URL
    P: number; // Played
    W: number; // Wins
    D: number; // Draws
    L: number; // Losses
    GF: number; // Goals For
    GA: number; // Goals Against
    GD: number; // Goal Difference
    Pts: number; // Points
}

export const calculateStandings = (matches: any[]): StandingsTeam[] => {
    const standings: Record<string, StandingsTeam> = {};
    matches?.forEach((m) => {
        if (m.status !== 'finished' && m.status !== 'in_progress') return;

        const homeScore = Number(m.homeScore) || 0;
        const awayScore = Number(m.awayScore) || 0;

        if (!m.homeTeam?._id || !m.awayTeam?._id ||
            isNaN(homeScore) || isNaN(awayScore)) {
            return;
        }

        const homeId = m.homeTeam._id;
        const awayId = m.awayTeam._id;
        const homeName = m.homeTeam.name;
        const awayName = m.awayTeam.name;
        const homeLogo = m.homeTeam.logo;
        const awayLogo = m.awayTeam.logo;

        if (!standings[homeId]) {
            standings[homeId] = {
                team: homeName,
                teamId: homeId,
                logo: homeLogo,
                P: 0, W: 0, D: 0, L: 0,
                GF: 0, GA: 0, GD: 0, Pts: 0
            };
        }
        if (!standings[awayId]) {
            standings[awayId] = {
                team: awayName,
                teamId: awayId,
                logo: awayLogo,
                P: 0, W: 0, D: 0, L: 0,
                GF: 0, GA: 0, GD: 0, Pts: 0
            };
        }

        standings[homeId].P += 1;
        standings[awayId].P += 1;

        standings[homeId].GF += homeScore;
        standings[homeId].GA += awayScore;
        standings[awayId].GF += awayScore;
        standings[awayId].GA += homeScore;

        standings[homeId].GD = standings[homeId].GF - standings[homeId].GA;
        standings[awayId].GD = standings[awayId].GF - standings[awayId].GA;

        if (homeScore > awayScore) {
            standings[homeId].W += 1;
            standings[awayId].L += 1;
            standings[homeId].Pts += 3;
        } else if (homeScore < awayScore) {
            standings[awayId].W += 1;
            standings[homeId].L += 1;
            standings[awayId].Pts += 3;
        } else {
            standings[homeId].D += 1;
            standings[awayId].D += 1;
            standings[homeId].Pts += 1;
            standings[awayId].Pts += 1;
        }
    });

    return Object.values(standings).sort(
        (a, b) => b.Pts - a.Pts || b.GD - a.GD || b.GF - a.GF
    );
};