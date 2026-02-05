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
  _id?: string; // MongoDB _id
  id: string; // Alias for _id or explicit id
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
  productId: string | Product; // Có thể là string hoặc Product object (khi populate)
  quantity: number;
  _id?: string;
}

export interface OrderItem {
  productId: string | Product;
  quantity: number;
  price: number;
  discount?: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city?: string;
  district?: string;
  ward?: string;
}

export interface Order {
  _id?: string;
  id?: string; // Alias for _id
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'paid' | 'shipping' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cod' | 'bank_transfer' | 'credit_card' | 'e_wallet';
  shippingAddress: ShippingAddress;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
