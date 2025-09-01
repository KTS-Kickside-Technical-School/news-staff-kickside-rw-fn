export interface ICountry {
    _id?: string;
    name: string;
    code: string;
    flagUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ITeam {
    _id?: string;
    name: string;
    country: any;
    logo: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ITrYear {
    _id?: string
    name?: string
    startYear: string;
    endYear: string;
    isLatest?: boolean;
}

export interface ITournament {
    _id?: string;
    name: string;
    description: string;
    foundedYear?: string;
    country: any;
    type: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ITrSeason {
    _id?: string;
    name: string;
    tournament: any;
    startDate: string;
    endDate: string;
    teams: string[];
    createdAt?: string;
    updatedAt?: string;
    year?: any;
    status?: string;
    isLatest: boolean;
}

export interface ITrMatch {
    _id?: string;
    tournamentSeason: any;
    homeTeam: any;
    awayTeam: any;
    homeScore?: number;
    awayScore?: number;
    matchDuration?: number;
    matchTime: string;
    status?: string;
}

export interface IPlayer {
    _id?: string;
    firstname: string;
    lastname?: string;
    nationality: string;
    birthdate: string;
}