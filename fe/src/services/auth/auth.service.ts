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

export interface ForgotPayload {
  email: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string
}

export interface ChangePassword {
  email: string
  newPassword: string
}


//Gọi Route
export const register = (data: RegisterPayload) => {
  return api.post('/auth/signup', data);
};

export const login = (data: LoginPayload) => {
  return api.post('/auth/signin', data);
};

export const forgotPasword = (data: ForgotPayload) => {
  return api.post('/auth/forgotpassword', data)
}

export const verifyOtp = (data: VerifyOtpPayload) => {
  return api.post('/auth/verifyotp', data)
}

export const changePassword = (data: ChangePassword) => {
  return api.post('/auth/resetpassword', data)
}