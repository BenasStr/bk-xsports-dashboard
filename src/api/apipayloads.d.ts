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
  photo_url: string;
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

// CATEGORIES
export interface CategoryPayload {
  id: number;
  name: string;
  photo_url: string;
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
  difficulty_id: number;
  trick_parents_ids: number[];
  description: string
  short_description: string
}

export interface TrickVariantEditPayload {
  description: string
  short_description: string
  variant_id: number
}