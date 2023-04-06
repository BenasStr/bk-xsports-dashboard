import { API_XSPORTS_PREFIX } from "../api";
import axios, { AxiosResponse } from "axios";


// DIFFICULTIES
export const getDifficulties = async (token: string) => {
    const response: AxiosResponse<any, any> = await axios.get(
        `${API_XSPORTS_PREFIX}/difficulties`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data.data
}