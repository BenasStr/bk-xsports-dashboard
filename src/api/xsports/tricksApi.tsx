import { API_XSPORTS_PREFIX } from "../api";
import axios, { AxiosResponse } from "axios";
import { TrickEditPayload, TrickVariantEditPayload } from "../apipayloads";

export const getTricks = async (token: string, sportId: number, categoryId: number) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks?extended=true`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const getTricksByVariants = async (token: string, sportId: number, categoryId: number, variant: string) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks?variant=${variant}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const getTrick = async (token: string, sportId: number, categoryId: number, trickId: number) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const createTrick = async (token: string, sportId: number, categoryId: number, trick: TrickEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks`,
        trick,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const updateTrick = async (token: string, sportId: number, categoryId: number, trickId: number, trick: TrickEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.put(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}`,
        trick,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const deleteTrick = async (token: string, sportId: number, categoryId: number, trickId: number) => {
    const response: AxiosResponse<any, any> = await axios.delete(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const createTrickVariant = async (token: string, sportId: number, categoryId: number, trickId: number, variant: TrickVariantEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}/variant`,
        variant,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const updateTrickVariant = async (token: string, sportId: number, categoryId: number, trickId: number, variantId: number, variant: TrickVariantEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.put(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}/variant/${variantId}`,
        variant,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const deleteTrickVariant = async (token: string, sportId: number, categoryId: number, trickId: number, variantId: number) => {
    const response: AxiosResponse<any, any> = await axios.delete(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}/variant/${variantId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const uploadVideo = async (token: string, sportId: number, categoryId: number, trickId: number, variantId: number, video: any) => {
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}/variants/${variantId}/video`,
        video,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
    )
}