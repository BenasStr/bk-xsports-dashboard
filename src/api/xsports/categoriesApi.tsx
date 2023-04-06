import { API_XSPORTS_PREFIX } from "../api";
import axios, { AxiosResponse } from "axios";
import { CategoryEditPayload } from "../apipayloads";

export const getCategories = async (token: string, sportId: number) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data;
}

export const getCategory = async (token: string, sportId: number, categoryId: number) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data;
}

export const createCategory = async (token: string, sportId: number, payload: CategoryEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories`,
        payload,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const updateCategory = async (token: string, sportId: number, categoryId: number, payload: CategoryEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.put(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}`,
        payload,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const deleteCategory = async (token: string, sportId: number, categoryId: number) => {
    const response: AxiosResponse<any, any> = await axios.delete(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export const uploadCategoryImage = async (token: string, sportId: number, categoryId: number, image: any) => {
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}/image`,
        image,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
    )
}