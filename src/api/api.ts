import axios, { AxiosResponse } from "axios";
import { CategoryEditPayload, LoginPayload, SportEditPayload, TrickEditPayload, TrickVariantEditPayload, UserEditPayload, VariantPayload } from "./apipayloads";

const API_PREFIX = "https://app-benasstr.cloud.okteto.net/api";

// AUTHENTICATION
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

// USERS
export const getUsers = async (token: string) => {
  const response: AxiosResponse<any, any> = await axios.get(
    `${API_PREFIX}/users`,
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
    `${API_PREFIX}/users/${userId}`,
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
    `${API_PREFIX}/users`,
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
    `${API_PREFIX}/users/${userId}`,
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
    `${API_PREFIX}/users/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
}

// SPORTS
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

export const getSport = async (token: string, id: number) => {
  const response: AxiosResponse<any, any> = await axios.get(
    `${API_PREFIX}/sports/${id}`,
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
  console.log(payload)
  const response: AxiosResponse<any, any> = await axios.post(
    `${API_PREFIX}/sports`,
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
    `${API_PREFIX}/sports/${sportId}`,
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
    `${API_PREFIX}/sports/${sportId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
}

// VARIANTS
export const getVariants = async (token: string) => {
  const response: AxiosResponse<any, any> = await axios.get(
    `${API_PREFIX}/variants`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.data
}

export const createVariant = async (token: string, payload: VariantPayload) => {
  const response: AxiosResponse<any, any> = await axios.post(
    `${API_PREFIX}/variants`,
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

export const updateVariant = async (token: string, variantId: number, payload: VariantPayload) => {
  const response: AxiosResponse<any, any> = await axios.post(
    `${API_PREFIX}/variants/${variantId}`,
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
  const response: AxiosResponse<any, any> = await axios.post(
    `${API_PREFIX}/variants/${variantId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
}

// CATEGORIES
export const getCategories = async (token: string, sportId: number) => {
  const response: AxiosResponse<any, any> = await axios.get(
    `${API_PREFIX}/sports/${sportId}/categories`,
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
    `${API_PREFIX}/sports/${sportId}/categories/${categoryId}`,
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
    `${API_PREFIX}/sports/${sportId}/categories`,
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
    `${API_PREFIX}/sports/${sportId}/categories/${categoryId}`,
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
    `${API_PREFIX}/sports/${sportId}/categories/${categoryId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
}

// TRICKS
export const getTricks = async (token: string, sportId: string, categoryId: string) => {
  const response: AxiosResponse<any, any> = await axios.get(
    `${API_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.data
}

export const getTrick = async (token: string, sportId: string, categoryId: string, trickId: number) => {
  const response: AxiosResponse<any, any> = await axios.get(
    `${API_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.data
}

export const createTrick = async (token: string, sportId: string, categoryId: string, trick: TrickEditPayload) => {
  const response: AxiosResponse<any, any> = await axios.post(
    `${API_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.data
}

export const updateTrick = async (token: string, sportId: string, categoryId: string, trickId: number, trick: TrickEditPayload) => {
  const response: AxiosResponse<any, any> = await axios.put(
    `${API_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.data
}

export const deleteTrick = async (token: string, sportId: string, categoryId: string, trickId: number) => {
  const response: AxiosResponse<any, any> = await axios.delete(
    `${API_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.data
}

export const createTrickVariant = async (token: string, sportId: string, categoryId: string, trickId: number, variant: TrickVariantEditPayload) => {
  const response: AxiosResponse<any, any> = await axios.post(
    `${API_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}/variants`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.data
}

export const updateTrickVariant = async (token: string, sportId: string, categoryId: string, trickId: number, variantId: number, variant: TrickVariantEditPayload) => {
  const response: AxiosResponse<any, any> = await axios.post(
    `${API_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}/variants/${variantId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.data
}

export const deleteTrickVariant = async (token: string, sportId: string, categoryId: string, trickId: number, variantId: number) => {
  const response: AxiosResponse<any, any> = await axios.delete(
    `${API_PREFIX}/sports/${sportId}/categories/${categoryId}/tricks/${trickId}/variants/${variantId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data.data
}

// IMAGE

// VIDEO