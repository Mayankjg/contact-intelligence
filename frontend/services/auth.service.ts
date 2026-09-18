import { apiRequest } from '@/lib/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  data: { accessToken: string; user: AuthUser };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: { id: string; name: string; email: string };
}

export const authService = {
  register(data: { name: string; email: string; password: string }) {
    return apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login(data: { name: string; password: string }) {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
