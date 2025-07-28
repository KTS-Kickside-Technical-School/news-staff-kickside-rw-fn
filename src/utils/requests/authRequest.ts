import axiosInstance from "../axios/axiosInstance";
import { iUser, iUserChangePassword, User } from "../types/User";
import { handleError } from "./articlesRequest";

export const userLogin = async (user: User) => {
    try {
        const response = await axiosInstance.post('/api/auth/login', user);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export const userForgotPassword = async (email: string) => {
    try {
        const response = await axiosInstance.post('/api/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}

export const userResetPassword = async (
    token: string,
    password: string
) => {
    try {
        const response = await axiosInstance.post('/api/auth/reset-password', { token, password });
        return response.data;
    } catch (error) {
        return handleError(error)
    }
}

export const userLogout = async (token: string) => {
    try {
        const response = await axiosInstance.post('/api/auth/logout', { token });
        return response.data;
    } catch (error) {
        return handleError(error)
    }
}

export const userViewProfile = async () => {
    try {
        const response = await axiosInstance.get('/api/auth/get-profile');
        return response.data;
    } catch (error) {
        return handleError(error)
    }
}

export const userUpdateProfile = async (data: iUser) => {
    try {
        const response = await axiosInstance.put("/api/auth/update-profile", data)
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const userChangePassword = async (data: iUserChangePassword) => {
    try {
        const response = await axiosInstance.put("/api/auth/change-password", data)
        return response.data
    } catch (error) {
        return handleError(error)
    }
}