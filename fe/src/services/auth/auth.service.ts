import api from '../apiClient';

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const register = (data: RegisterPayload) => {
  return api.post('/auth/signup', data);
};

export const login = (data: LoginPayload) => {
  return api.post('/auth/signin', data);
};
