import axios, { AxiosResponse } from "axios";
import { VariantEditPayload } from "../apipayloads";
import { API_XSPORTS_PREFIX } from "../api";

export const getVariants = async (token: string) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/variants`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const createVariant = async (token: string, payload: VariantEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/variants`,
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

export const updateVariant = async (token: string, variantId: number, payload: VariantEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.put(
        `${API_XSPORTS_PREFIX}/variants/${variantId}`,
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

export const deleteVariant = async (token: string, variantId: number) => {
    const response: AxiosResponse<any, any> = await axios.delete(
        `${API_XSPORTS_PREFIX}/variants/${variantId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
}