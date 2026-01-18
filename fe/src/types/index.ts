// Types for the application

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
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
