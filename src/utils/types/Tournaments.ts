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