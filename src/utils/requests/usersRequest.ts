import axiosInstance from "../axios/axiosInstance"
import { handleError } from "./articlesRequest"

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get("/api/workers/get-all-users");
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const getSingleUser = async (id: any) => {
    try {
        const response = await axiosInstance.get(`/api/workers/get-single-user/${id}`)
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const updateUser = async (id: any, user: any) => {
    try {
        const response = await axiosInstance.put("/api/workers/update-user", {
            _id: id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            bio: user.bio,
            profile: user.profile,
            rank: user.rank,
            phone: user.phone,
            role: user.role
        })
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const disableUser = async (id: any, disableReason: any) => {
    try {
        const response = await axiosInstance.put("/api/workers/disable-user", {
            _id: id,
            disableReason
        })
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const enableUser = async (id: any) => {
    try {
        const response = await axiosInstance.put(`/api/workers/enable-user/${id}`);
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const createNewUser = async (data: any) => {
    try {
        const response = await axiosInstance.post(`/api/workers/create-user`, data);
        return response.data
    } catch (error) {
        return handleError(error)
    }
}