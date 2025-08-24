import axiosInstance from "../../axios/axiosInstance";
import { ICountry } from "../../types/Tournaments";
import { handleError } from "../articlesRequest";

export const saveCountry = async (countryData: ICountry) => {
    try {
        const response = await axiosInstance.post('/api/tr/new-country', {
            name: countryData.name,
            code: countryData.code,
            flagUrl: countryData.flagUrl
        })
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export const getCountries = async () => {
    try {
        const response = await axiosInstance.get('/api/tr/countries');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}