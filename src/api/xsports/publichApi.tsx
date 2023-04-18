import { API_XSPORTS_PREFIX } from "../api";
import axios, { AxiosResponse } from "axios";
import { PublishEditPayload } from "../apipayloads";

export const getPublishes = async (token: string) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/publish`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );
    return response.data.data;
}

export const getPublishCategories = async (token: string) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/publish/categories`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );
    return response.data.data
}

export const createPublish = async (token: string, values: PublishEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/publish`,
        values,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );
    return response.data.data;
}

export const updatePublish = async (token: string, id: number, values: PublishEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/publish/${id}`,
        values,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );
    return response.data.data;
}

export const deletePublish = async (token: string, id: number) => {
    const response: AxiosResponse<any, any> = await axios.delete(
        `${API_XSPORTS_PREFIX}/publish/${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );
}

export const publish = async (token:string, sportId: number, categoryId: number) => {
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/publish/now/sport/${sportId}/category/${categoryId}`,
        {},
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );
}