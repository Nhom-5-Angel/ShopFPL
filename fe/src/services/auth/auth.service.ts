/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../../constants';
import { ApiResponse } from '../api/types';

// Request Payload Types
export interface RegisterPayload {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

// Response Types
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    phoneNumber?: string;
  };
  accessToken: string;
  refreshToken?: string;
}

/**
 * Register a new user
 */
export const register = async (
  data: RegisterPayload
): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    API_ENDPOINTS.AUTH.SIGNUP,
    data
  );
  return response.data;
};

/**
 * Login user
 */
export const login = async (
  data: LoginPayload
): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    API_ENDPOINTS.AUTH.SIGNIN,
    data
  );
  return response.data;
};

/**
 * Request password reset (send OTP)
 */
export const forgotPassword = async (
  data: ForgotPasswordPayload
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    data
  );
  return response.data;
};

/**
 * Verify OTP for password reset
 */
export const verifyOtp = async (
  data: VerifyOtpPayload
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    API_ENDPOINTS.AUTH.VERIFY_OTP,
    data
  );
  return response.data;
};

/**
 * Reset password after OTP verification
 */
export const resetPassword = async (
  data: ResetPasswordPayload
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    data
  );
  return response.data;
};
