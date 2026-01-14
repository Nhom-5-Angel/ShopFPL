// API Configuration
export const API_BASE_URL = 'http://localhost:3001/api/v1';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  
  // Categories
  CATEGORIES: '/categories',
  
  // Cart
  CART: '/cart',
  CART_ITEMS: '/cart/items',
  CART_ITEM_DELETE: (productId: string) => `/cart/items/${productId}`,
  
  // Orders
  ORDERS: '/orders',
  ORDER_CANCEL: (id: string) => `/orders/${id}/cancel`,
  
  // User
  USER_PROFILE: '/users/me',
};
