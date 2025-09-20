import axiosInstance from '../../axios/axiosInstance';
import { ITeam } from '../../types/Tournaments';
import { handleError } from '../articlesRequest';

export const saveTeam = async (data: ITeam) => {
  try {
    const response = await axiosInstance.post('/api/tr/new-team', {
      name: data.name,
      country: data.country,
      logo: data.logo,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getTeams = async () => {
  try {
    const response = await axiosInstance.get('/api/tr/teams');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getSingleTeam = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/api/tr/teams/single-team/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export const getTeamPlayers = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/api/tr/teams/get-team-players/${id}`)
    return response.data
  } catch (error) {
    return handleError(error);
  }
}

export const createNewTeamPlayer = async (data: any) => {
  try {
    const response = await axiosInstance.post('/api/tr/teams/save-new-team-player-info', data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}