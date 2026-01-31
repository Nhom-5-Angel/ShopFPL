/**
 * Navigation Types
 * Centralized type definitions for navigation
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyOTP: {
    email: string;
  };
  ChangePassword: {
    email: string;
  };
};

// Main Stack (after authentication)
export type MainStackParamList = {
  Home: undefined;
  ProductDetail: {
    productId: string;
  };
  Search: undefined;
  Cart: undefined;
  Account: undefined;
  AdminUsers: undefined;
  AdminProducts: undefined;
  AdminCategories: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// Bottom Tab Navigator
export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Account: undefined;
};
