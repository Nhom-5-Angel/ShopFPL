// Types for the application

export interface User {
  _id: string;
  id?: string; // Alias for _id
  username: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  avatarId?: string;
  birthDate?: string;
  address?: string;
  gender?: 'male' | 'female' | 'other';
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
  // Helper getter
  name?: string; // Alias for username
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface ProductImage {
  url: string;
  publicId?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string | { _id: string; name: string };
  isActive: boolean;
  images?: ProductImage[];
  stock?: number;
  discount?: number;
  sold?: number;
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
