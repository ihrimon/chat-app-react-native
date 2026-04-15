export interface User {
  id: string;
  name: string;
  email: string;
  // Add more fields as per your backend (avatar, createdAt, etc.)
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}
