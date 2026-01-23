/**
 * Admin Service
 * Handles admin user management API calls
 */

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../../constants';
import { ApiResponse, PaginatedResponse } from '../api/types';
import { User } from '../../types';

// Request Types
export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'user' | 'admin';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  phoneNumber?: string;
  role?: 'user' | 'admin';
  birthDate?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  avatarUrl?: string;
}

export interface UpdateUserRolePayload {
  role: 'user' | 'admin';
}

export interface ResetPasswordPayload {
  newPassword: string;
}

/**
 * Get all users with pagination
 */
export const getAllUsers = async (
  params?: GetAllUsersParams
): Promise<ApiResponse<PaginatedResponse<User>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
    API_ENDPOINTS.ADMIN.USERS,
    { params }
  );
  return response.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  const response = await apiClient.get<ApiResponse<User>>(
    `${API_ENDPOINTS.ADMIN.USERS}/${id}`
  );
  return response.data;
};

/**
 * Update user
 */
export const updateUser = async (
  id: string,
  data: UpdateUserPayload
): Promise<ApiResponse<User>> => {
  const response = await apiClient.put<ApiResponse<User>>(
    `${API_ENDPOINTS.ADMIN.USERS}/${id}`,
    data
  );
  return response.data;
};

/**
 * Delete user
 */
export const deleteUser = async (id: string): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(
    `${API_ENDPOINTS.ADMIN.USERS}/${id}`
  );
  return response.data;
};

/**
 * Update user role
 */
export const updateUserRole = async (
  id: string,
  data: UpdateUserRolePayload
): Promise<ApiResponse<User>> => {
  const response = await apiClient.patch<ApiResponse<User>>(
    `${API_ENDPOINTS.ADMIN.USERS}/${id}/role`,
    data
  );
  return response.data;
};

/**
 * Reset user password
 */
export const resetUserPassword = async (
  id: string,
  data: ResetPasswordPayload
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    `${API_ENDPOINTS.ADMIN.USERS}/${id}/reset-password`,
    data
  );
  return response.data;
};
