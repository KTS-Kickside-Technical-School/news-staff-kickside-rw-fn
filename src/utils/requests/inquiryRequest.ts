import axiosInstance from "../axios/axiosInstance";
import { handleError } from "./articlesRequest";



export const sendInquiry = async (data: any) => {
    try {
        const response = await axiosInstance.post("/api/inquiry/create-inquiry", {
            topic: data.inquiry,
            message: data.message,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName
        });
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const adminViewInquiries = async () => {
    try {
        const response = await axiosInstance.get("/api/inquiry/get-all-inquiries");
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const adminViewSingleInquiry = async (id: any) => {
    try {
        const response = await axiosInstance.get(`/api/inquiry/get-single-inquiry/${id}`);
        return response.data
    } catch (error) {
        return handleError(error)
    }
}

export const markInquiryAsRead = async (id: any) => {
    try {
        const response = await axiosInstance.patch(`/api/inquiry/update-status/${id}`, { status: "solved" });
        return response.data
    } catch (error) {
        return handleError(error)
    }
}