export interface LoginPayload {
  email: string;
  password: string;
}

export interface Token {
  token: string
}

export interface GetSportPayload {
  name: string;
  photo_url: string;
}

export interface PostSportPayload {
  name: string;
}

export interface GetCategoryPayload {
  name: string;
  photo_url: string;
}
