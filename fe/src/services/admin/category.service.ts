/**
 * Admin Category Service
 * Handles admin category management API calls
 */

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../../constants';
import { ApiResponse } from '../api/types';
import { Category } from '../../types';

// Request Types
export interface CreateCategoryPayload {
  name: string;
  description?: string;
  image?: {
    url: string;
    publicId?: string;
  };
  isActive?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  image?: {
    url: string;
    publicId?: string;
  };
  isActive?: boolean;
}

/**
 * Get all categories (admin - includes inactive)
 */
export const getAllCategories = async (): Promise<ApiResponse<Category[]>> => {
  const response = await apiClient.get<ApiResponse<Category[]>>(
    API_ENDPOINTS.ADMIN.CATEGORIES.LIST
  );
  return response.data;
};

/**
 * Get category by ID (admin)
 */
export const getCategoryById = async (id: string): Promise<ApiResponse<Category>> => {
  const response = await apiClient.get<ApiResponse<Category>>(
    API_ENDPOINTS.ADMIN.CATEGORIES.DETAIL(id)
  );
  return response.data;
};

/**
 * Create category
 */
export const createCategory = async (
  data: CreateCategoryPayload
): Promise<ApiResponse<Category>> => {
  const response = await apiClient.post<ApiResponse<Category>>(
    API_ENDPOINTS.ADMIN.CATEGORIES.CREATE,
    data
  );
  return response.data;
};

/**
 * Update category
 */
export const updateCategory = async (
  id: string,
  data: UpdateCategoryPayload
): Promise<ApiResponse<Category>> => {
  const response = await apiClient.put<ApiResponse<Category>>(
    API_ENDPOINTS.ADMIN.CATEGORIES.UPDATE(id),
    data
  );
  return response.data;
};

/**
 * Delete category
 */
export const deleteCategory = async (id: string): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(
    API_ENDPOINTS.ADMIN.CATEGORIES.DELETE(id)
  );
  return response.data;
};
