import axiosInstance from "../../axios/axiosInstance";
import { ITournament, ITrMatch, ITrSeason, ITrYear } from "../../types/Tournaments";
import { handleError } from "../articlesRequest";

export const saveTournamentYear = async (data: ITrYear) => {
    try {
        const response = await axiosInstance.post("/api/tr/new-year", data);
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const saveTournament = async (data: ITournament) => {
    try {
        const response = await axiosInstance.post("/api/tr/new-tr", data);
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const getTournaments = async () => {
    try {
        const response = await axiosInstance.get("/api/tr/tr");
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const getYears = async () => {
    try {
        const response = await axiosInstance.get("/api/tr/years");
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const saveTournamentSeason = async (data: ITrSeason) => {
    try {
        const response = await axiosInstance.post("/api/tr/new-tr-season", data);
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const getAllTournamentsSeasons = async () => {
    try {
        const response = await axiosInstance.get("/api/tr/tr-seasons");
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const getSingleTournamentSeason = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/api/tr/tr-season/${id}`);
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const saveMatch = async (data: ITrMatch) => {
    try {
        const response = await axiosInstance.post("/api/tr/new-match", data);
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const getMatches = async () => {
    try {
        const response = await axiosInstance.get("/api/tr/matches");
        return response.data
    } catch (error) {
        return handleError(error);
    }
}

export const getSingleMatchInfo = async (matchId: string) => {
    try {
        const response = await axiosInstance.get(`/api/tr/match-info/${matchId}`);
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const updateMatch = async (_id: string, data: any) => {
    try {

        const response = await axiosInstance.put(`/api/tr/match-update/${_id}`, data);
        return response.data

    } catch (error) {
        return handleError(error)
    }
}