import { API_XSPORTS_PREFIX } from "../api";
import axios, { AxiosResponse } from "axios";
import { UserEditPayload } from "../apipayloads";

export const getUsers = async (token: string) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/users`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const getUser = async (token: string, userId: number) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/users/${userId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const createUser = async (token: string, userPayload: UserEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/users`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const updateUser = async (token: string, userId: number, userPayload: UserEditPayload) => {
    const response: AxiosResponse<any, any> = await axios.put(
        `${API_XSPORTS_PREFIX}/users/${userId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}

export const deleteUser = async (token: string, userId: number) => {
    const response: AxiosResponse<any, any> = await axios.delete(
        `${API_XSPORTS_PREFIX}/users/${userId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
}
