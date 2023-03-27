import { ExceptionMap } from "antd/es/result";

// Authentication
export interface LoginPayload {
  email: string;
  password: string;
}

export interface Token {
  token: string;
}

// USERS
export interface UsersPage {
  items_per_page: number;
  page_index: number;
  items: UserPayload[];
  total_items: number;
}

export interface UserPayload {
  id: number;
  name: string;
  surname: string;
  nickname: string;
  email: string;
  photoUrl: string;
  role: string;
  blocked: boolean;
}

export interface UserEditPayload {
  name: string
  surname: string
  nickname: string
  email: string
  password: string
}

// SPORTS
export interface SportPayload {
  id: number
  name: string;
  photo: string;
  variants: VariantPayload[];
}

export interface SportEditPayload {
  name: string;
  variantsIds: number[]
}

// VARIANTS
export interface VariantPayload {
  id: number;
  name: string;
}

export interface VariantEditPayload {
  name: string;
}

// CATEGORIES
export interface CategoryPayload {
  id: number;
  name: string;
  photo: string;
}

export interface CategoryEditPayload {
  name: string;
}

// TRICKS
export interface TrickPayload {
  id: number;
  name: string;
  shortDescription: string;
  description: string
  difficulty: string;
  video: string;
  trickParents: TrickBasicPayload[];
  trickChildren: TrickBasicPayload[];
  trickVariants: TrickBasicPayload[];
}

export interface TrickBasicPayload {
  id: number;
  name: string;
  shortDescription: string
}

export interface TrickEditPayload {
  name: string;
  difficultyId: number;
  trickParentsIds: number[];
  description: string
  shortDescription: string
}

export interface TrickVariantEditPayload {
  description: string
  shortDescription: string
  variantId: number
}

// Difficulties
export interface DifficultyPayload {
  id: number,
  name: string
}