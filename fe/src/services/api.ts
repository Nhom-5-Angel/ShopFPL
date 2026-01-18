import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { Product, Category, User, CartItem, Order } from '../types';

// Simple API client using fetch
class ApiService {
  private baseUrl: string;
  private userId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.userId) {
      headers['x-user-id'] = this.userId;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  // Auth
  async register(email: string, password: string, name: string): Promise<User> {
    return this.request<User>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.request<User>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setUserId(user.id);
    return user;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const response = await this.request<{ success: boolean; data: Product[] }>(API_ENDPOINTS.PRODUCTS);
    return response.data || [];
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.request<{ success: boolean; data: Product }>(API_ENDPOINTS.PRODUCT_DETAIL(id));
    return response.data;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.request<{ success: boolean; data: Category[] }>(API_ENDPOINTS.CATEGORIES);
    return response.data || [];
  }

  // Cart
  async getCart(): Promise<CartItem[]> {
    return this.request<CartItem[]>(API_ENDPOINTS.CART);
  }

  async addToCart(productId: string, quantity: number): Promise<CartItem[]> {
    return this.request<CartItem[]>(API_ENDPOINTS.CART_ITEMS, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: string): Promise<CartItem[]> {
    return this.request<CartItem[]>(API_ENDPOINTS.CART_ITEM_DELETE(productId), {
      method: 'DELETE',
    });
  }

  // Orders
  async createOrder(): Promise<Order> {
    return this.request<Order>(API_ENDPOINTS.ORDERS, {
      method: 'POST',
    });
  }

  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>(API_ENDPOINTS.ORDERS);
  }

  async cancelOrder(id: string): Promise<Order> {
    return this.request<Order>(API_ENDPOINTS.ORDER_CANCEL(id), {
      method: 'POST',
    });
  }

  // User
  async getUserProfile(): Promise<User> {
    return this.request<User>(API_ENDPOINTS.USER_PROFILE);
  }
}

export const apiService = new ApiService(API_BASE_URL);
