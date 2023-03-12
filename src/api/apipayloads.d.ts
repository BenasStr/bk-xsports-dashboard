// Authentication
export interface LoginPayload {
  email: string;
  password: string;
}

export interface Token {
  token: string
}

// SPORTS
export interface GetSportPayload {
  name: string;
  photo_url: string;
}

export interface PostSportPayload {
  name: string;
}

// CATEGORIES
export interface GetCategoryPayload {
  name: string;
  photo_url: string;
}
