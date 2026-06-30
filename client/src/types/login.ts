export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;       // adjust depending on your backend
  access?: string;      // JWT case
  refresh?: string;
  user?: {
    id: number;
    username: string;
    role: string;
  };
}