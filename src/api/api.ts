import axios, { AxiosResponse } from "axios";
import { LoginPayload } from "./apipayloads";

const API_PREFIX = "https://app-benasstr.cloud.okteto.net/api";

export const login = async (payload: LoginPayload) => {
  const response: AxiosResponse<any, any> = await axios.post(
    `${API_PREFIX}/auth/login`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

export const getSports = async (token: string) => {
  const response: AxiosResponse<any, any> = await axios.get(
    `${API_PREFIX}/sports`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    }
  );
  return response.data.data;
}