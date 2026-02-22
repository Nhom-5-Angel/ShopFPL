import { API_CONFIG, API_ENDPOINTS } from '../constants';
import { Product, Category, User, CartItem, Order } from '../types';
import { tokenStorage } from '../utils';

// Simple API client using fetch
class ApiService {
  private baseUrl: string;
  private userId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Get base URL from API_CONFIG
  static getBaseUrl(): string {
    return API_CONFIG.BASE_URL;
  }

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    let headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Get token from storage if available
    const token = await this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (this.userId) {
      headers['x-user-id'] = this.userId;
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Nếu access token hết hạn, thử refresh một lần rồi retry
    if (response.status === 401) {
      const newToken = await this.refreshAccessToken();

      if (newToken) {
        headers = {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        };

        response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers,
        });
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || error.error || 'Request failed');
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  /**
   * Refresh access token using refresh token stored in storage
   */
  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) return null;

      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return null;

      const data = await response.json().catch(() => null);
      if (!data || !data.accessToken) return null;

      // Lưu accessToken mới cho cả tokenStorage và AsyncStorage raw key
      await tokenStorage.setAccessToken(data.accessToken);
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem('accessToken', data.accessToken);
      } catch {
        // ignore
      }

      return data.accessToken as string;
    } catch {
      return null;
    }
  }

  private async getToken(): Promise<string | null> {
    try {
      return await tokenStorage.getAccessToken();
    } catch {
      return null;
    }
  }

  // Auth
  async register(email: string, password: string, name: string, phoneNumber: string): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify({ email, password, username: name, phoneNumber }),
    });
    return response;
  }

  async login(email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const response = await this.request<{ message: string; accessToken: string; refreshToken: string }>(API_ENDPOINTS.AUTH.SIGNIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token for subsequent requests
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('accessToken', response.accessToken);
    } catch (e) {
      console.error('Failed to store token:', e);
    }
    
    // Get user profile after login
    const profileResponse = await this.request<{ success: boolean; data: User }>(API_ENDPOINTS.USER.PROFILE);
    
    if (profileResponse.success && profileResponse.data) {
      const user = profileResponse.data;
      this.setUserId(user._id || (user as any).id || '');
      return {
        user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };
    }
    throw new Error('Login failed');
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const response = await this.request<{ success: boolean; data: Product[] }>(API_ENDPOINTS.PRODUCTS.LIST);
    return response.data || [];
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.request<{ success: boolean; data: Product }>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    return response.data;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.request<{ success: boolean; data: Category[] }>(API_ENDPOINTS.CATEGORIES.LIST);
    return response.data || [];
  }

  // Cart
  async getCart(): Promise<CartItem[]> {
    const response = await this.request<{ success: boolean; data: CartItem[] }>(API_ENDPOINTS.CART.GET);
    return response.data || [];
  }

  async addToCart(productId: string, quantity: number): Promise<CartItem[]> {
    const response = await this.request<{ success: boolean; data: CartItem[] }>(API_ENDPOINTS.CART.ITEMS, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    return response.data || [];
  }

  async updateCartItem(productId: string, quantity: number): Promise<CartItem[]> {
    const response = await this.request<{ success: boolean; data: CartItem[] }>(
      `/cart/items/${productId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }
    );
    return response.data || [];
  }

  async removeFromCart(productId: string): Promise<CartItem[]> {
    const response = await this.request<{ success: boolean; data: CartItem[] }>(API_ENDPOINTS.CART.DELETE_ITEM(productId), {
      method: 'DELETE',
    });
    return response.data || [];
  }

  // Orders
  async createOrder(shippingAddress: any, paymentMethod: string = 'cod', notes?: string): Promise<Order> {
    const response = await this.request<{ success: boolean; data: Order }>(API_ENDPOINTS.ORDERS.CREATE, {
      method: 'POST',
      body: JSON.stringify({ shippingAddress, paymentMethod, notes }),
    });
    return response.data;
  }

  async getOrders(status?: string, paymentStatus?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (paymentStatus) params.append('paymentStatus', paymentStatus);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await this.request<{ success: boolean; data: Order[] }>(`${API_ENDPOINTS.ORDERS.LIST}${query}`);
    return response.data || [];
  }

  async getOrderById(orderId: string): Promise<Order> {
    const response = await this.request<{ success: boolean; data: Order }>(API_ENDPOINTS.ORDERS.DETAIL(orderId));
    return response.data;
  }

  async updateOrderStatus(orderId: string, status?: string, paymentStatus?: string): Promise<Order> {
    const response = await this.request<{ success: boolean; data: Order }>(
      API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId),
      {
        method: 'PUT',
        body: JSON.stringify({ status, paymentStatus }),
      }
    );
    return response.data;
  }

  async cancelOrder(id: string): Promise<Order> {
    const response = await this.request<{ success: boolean; data: Order }>(API_ENDPOINTS.ORDERS.CANCEL(id), {
      method: 'PUT',
    });
    return response.data;
  }

  // User
  async getUserProfile(): Promise<User> {
    const response = await this.request<{ success: boolean; data: User }>(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  }
}

export const apiService = new ApiService(API_CONFIG.BASE_URL);
