import axios, { AxiosResponse } from "axios";
import { LoginPayload } from "../apipayloads";
import { API_XSPORTS_PREFIX } from "../api";

// AUTHENTICATION
export const login = async (payload: LoginPayload) => {
    const response: AxiosResponse<any, any> = await axios.post(
        `${API_XSPORTS_PREFIX}/auth/login`,
        payload,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data.data;
};