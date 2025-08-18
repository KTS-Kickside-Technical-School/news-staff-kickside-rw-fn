import axiosInstance from "../../axios/axiosInstance";
import { ITournament, ITrSeason, ITrYear } from "../../types/Tournaments";
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