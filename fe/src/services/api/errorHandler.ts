/**
 * Error Handler
 * Centralized error handling for API requests
 */

import { AxiosError } from 'axios';
import { ERROR_MESSAGES } from '../../constants';
import { getErrorMessage } from '../../utils';

export class ApiError extends Error {
  statusCode?: number;
  originalError?: any;

  constructor(message: string, statusCode?: number, originalError?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

/**
 * Handle API errors and return user-friendly messages
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const errorMessage = getErrorMessage(error);

    // Handle specific status codes
    switch (statusCode) {
      case 400:
        return errorMessage || 'Yêu cầu không hợp lệ';
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return 'Bạn không có quyền thực hiện hành động này';
      case 404:
        return 'Không tìm thấy dữ liệu';
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return errorMessage || ERROR_MESSAGES.NETWORK_ERROR;
    }
  }

  return getErrorMessage(error) || ERROR_MESSAGES.NETWORK_ERROR;
};

/**
 * Create ApiError from axios error
 */
export const createApiError = (error: AxiosError): ApiError => {
  const message = getErrorMessage(error);
  const statusCode = error.response?.status;

  return new ApiError(message, statusCode, error);
};
