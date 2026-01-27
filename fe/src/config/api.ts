/**
 * Cấu hình API
 * 
 * Lưu ý về Base URL:
 * - Android emulator: sử dụng 10.0.2.2 thay vì localhost
 * - iOS simulator: sử dụng localhost
 * - Thiết bị thật: sử dụng IP máy tính của bạn (ví dụ: http://192.168.1.x:3000/api)
 */
export const API_BASE_URL = 'http://10.0.2.2:3000/api';

/**
 * Danh sách các API endpoints
 */
export const API_ENDPOINTS = {
  // Xác thực người dùng
  REGISTER: '/auth/signup',        // Đăng ký tài khoản
  LOGIN: '/auth/signin',           // Đăng nhập
  
  // Sản phẩm
  PRODUCTS: '/products',          // Lấy danh sách sản phẩm
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,  // Lấy chi tiết sản phẩm theo ID
  
  // Danh mục
  CATEGORIES: '/categories',       // Lấy danh sách danh mục
  
  // Giỏ hàng
  CART: '/cart',                   // Lấy giỏ hàng của user
  CART_ITEMS: '/cart/items',       // Thêm/sửa item trong giỏ hàng
  CART_ITEM_DELETE: (productId: string) => `/cart/items/${productId}`,  // Xóa item khỏi giỏ hàng
  
  // Đơn hàng
  ORDERS: '/orders',               // Lấy danh sách đơn hàng
  ORDER_CANCEL: (id: string) => `/orders/${id}/cancel`,  // Huỷ đơn hàng
  
  // Thông tin người dùng
  USER_PROFILE: '/users/profile',   // Lấy thông tin profile của user
};
