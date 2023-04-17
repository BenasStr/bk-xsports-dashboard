import { API_XSPORTS_PREFIX } from "../api";
import axios, { AxiosResponse } from "axios";
import { SportEditPayload } from "../apipayloads";

export const getSports = async (token: string, search: string) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/sports?search=${search}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        }
    );
    return response.data.data;
}

export const getSport = async (token: string, id: number) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/sports/${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const createSport = async (token: string, payload: SportEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/sports`,
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

export const updateSport = async (token: string, sportId: number, payload: SportEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.put(
        `${API_XSPORTS_PREFIX}/sports/${sportId}`,
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

export const deleteSport = async (token: string, sportId: number) => {
    const response: AxiosResponse<any, any> = await axios.delete(
        `${API_XSPORTS_PREFIX}/sports/${sportId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export const uploadSportImage = async (token: string, sportId: number, image: any) => {
    console.log(image)
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/sports/${sportId}/image`,
        image,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        }
    )
}