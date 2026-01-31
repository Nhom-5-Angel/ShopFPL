/**
 * Admin Product Service
 * Handles admin product management API calls
 */

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../../constants';
import { ApiResponse, PaginatedResponse } from '../api/types';
import { Product } from '../../types';

// Request Types
export interface GetAllProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  images?: Array<{ url: string; publicId?: string }>;
  stock?: number;
  discount?: number;
  isActive?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  images?: Array<{ url: string; publicId?: string }>;
  stock?: number;
  discount?: number;
  isActive?: boolean;
}

/**
 * Get all products with pagination (admin - includes inactive)
 */
export const getAllProducts = async (
  params?: GetAllProductsParams
): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
    API_ENDPOINTS.ADMIN.PRODUCTS.LIST,
    { params }
  );
  return response.data;
};

/**
 * Get product by ID (admin)
 */
export const getProductById = async (id: string): Promise<ApiResponse<Product>> => {
  const response = await apiClient.get<ApiResponse<Product>>(
    API_ENDPOINTS.ADMIN.PRODUCTS.DETAIL(id)
  );
  return response.data;
};

/**
 * Create product
 */
export const createProduct = async (
  data: CreateProductPayload
): Promise<ApiResponse<Product>> => {
  const response = await apiClient.post<ApiResponse<Product>>(
    API_ENDPOINTS.ADMIN.PRODUCTS.CREATE,
    data
  );
  return response.data;
};

/**
 * Update product
 */
export const updateProduct = async (
  id: string,
  data: UpdateProductPayload
): Promise<ApiResponse<Product>> => {
  const response = await apiClient.put<ApiResponse<Product>>(
    API_ENDPOINTS.ADMIN.PRODUCTS.UPDATE(id),
    data
  );
  return response.data;
};

/**
 * Delete product
 */
export const deleteProduct = async (id: string): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(
    API_ENDPOINTS.ADMIN.PRODUCTS.DELETE(id)
  );
  return response.data;
};
