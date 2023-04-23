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

export interface UserBasicPayload {
  id: number;
  name: string;
  surname: string;
  nickname: string;
  photoUrl: string;
  isBlocked: boolean;
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
  publishStatus: string;
  contentStatus: string;
  lastUpdated: string;
  categoriesCount: number;
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
  publishStatus: string;
  contentStatus: string;
  tricksCount: number;
  lastUpdated: string;
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
  videoUrl: string;
  publishStatus: string;
  variantsCreated: string;
  lastUpdated: string;
  trickParents: TrickBasicPayload[];
  trickChildren: TrickBasicPayload[];
  trickVariants: TrickBasicPayload[];
}

export interface TrickBasicPayload {
  id: number;
  name: string;
  shortDescription: string;
}

export interface TrickEditPayload {
  name: string;
  difficultyId: number;
  trickParentsIds: number[];
  description: string;
  shortDescription: string;
}

export interface TrickVariantEditPayload {
  description: string
  shortDescription: string;
}

// Difficulties
export interface DifficultyPayload {
  id: number;
  name: string;
}

// Publish
export interface PublishPayload {
  id: number;
  name: string;
  releaseDate: string;
  sport: {
    id: number;
    name: string
    category: {
      id: number;
      name: string;
    }
  }
}

export interface PublishEditPayload {
  releaseDate: string;
  categoryId: number;
}

export interface PublishPublishPayload {
  sportId: number;
  categotyId: number;
}

export interface PublishAvailableCategoriesPayload {
  id: number;
  name: string;
  category: PublishSportCategories[]
}

interface PublishSportCategories {
  id: number;
  name: string;
}