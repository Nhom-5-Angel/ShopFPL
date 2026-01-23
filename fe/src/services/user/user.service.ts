/**
 * User Service
 * Handles user profile-related API calls
 */

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../../constants';
import { ApiResponse } from '../api/types';
import { User } from '../../types';

// Request Types
export interface UpdateProfilePayload {
  username?: string;
  phoneNumber?: string;
  birthDate?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

/**
 * Get user profile
 */
export const getProfile = async (): Promise<ApiResponse<User>> => {
  const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.USER.PROFILE);
  return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (
  data: UpdateProfilePayload
): Promise<ApiResponse<User>> => {
  const response = await apiClient.put<ApiResponse<User>>(
    API_ENDPOINTS.USER.PROFILE,
    data
  );
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (
  data: ChangePasswordPayload
): Promise<ApiResponse> => {
  const response = await apiClient.put<ApiResponse>(
    API_ENDPOINTS.USER.CHANGE_PASSWORD,
    data
  );
  return response.data;
};
