/**
 * Application Constants
 * Centralized configuration and constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:3000/api',
  TIMEOUT: 15000,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    FORGOT_PASSWORD: '/auth/forgotpassword',
    VERIFY_OTP: '/auth/verifyotp',
    RESET_PASSWORD: '/auth/resetpassword',
  },
  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
  },
  // Categories
  CATEGORIES: {
    LIST: '/categories',
  },
  // Cart
  CART: {
    GET: '/cart',
    ITEMS: '/cart/items',
    DELETE_ITEM: (productId: string) => `/cart/items/${productId}`,
  },
  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
  // User
  USER: {
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },
  // Admin
  ADMIN: {
    USERS: '/admin/users',
    USER_DETAIL: (id: string) => `/admin/users/${id}`,
    USER_ROLE: (id: string) => `/admin/users/${id}/role`,
    USER_RESET_PASSWORD: (id: string) => `/admin/users/${id}/reset-password`,
    PRODUCTS: {
      LIST: '/admin/products',
      DETAIL: (id: string) => `/admin/products/${id}`,
      CREATE: '/admin/products',
      UPDATE: (id: string) => `/admin/products/${id}`,
      DELETE: (id: string) => `/admin/products/${id}`,
    },
    CATEGORIES: {
      LIST: '/admin/categories',
      DETAIL: (id: string) => `/admin/categories/${id}`,
      CREATE: '/admin/categories',
      UPDATE: (id: string) => `/admin/categories/${id}`,
      DELETE: (id: string) => `/admin/categories/${id}`,
    },
  },
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 50,
  },
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PHONE: {
    REGEX: /^[0-9]{10,11}$/,
  },
  OTP: {
    LENGTH: 6,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'Vui lòng điền đầy đủ thông tin',
  INVALID_EMAIL: 'Email không hợp lệ',
  INVALID_PHONE: 'Số điện thoại không hợp lệ',
  PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 8 ký tự',
  PASSWORD_MISMATCH: 'Mật khẩu không khớp',
  OTP_INVALID: 'Mã OTP không hợp lệ',
  OTP_LENGTH: 'Mã OTP phải có 6 số',
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  SERVER_ERROR: 'Lỗi hệ thống',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: 'Đăng ký thành công',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  FORGOT_PASSWORD_SUCCESS: 'Mã xác nhận đã được gửi về email của bạn',
  VERIFY_OTP_SUCCESS: 'Mã xác nhận chính xác',
  CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công',
} as const;
