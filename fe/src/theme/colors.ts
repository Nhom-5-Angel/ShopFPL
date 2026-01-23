/**
 * Color Palette
 * Centralized color definitions for the application
 */

export const colors = {
  // Primary Colors
  primary: '#1e2939',
  primaryLight: '#4A90E2',
  primaryDark: '#0f1419',

  // Secondary Colors
  secondary: '#FF6B9D',
  secondaryLight: '#FFB6C1',
  secondaryDark: '#E63950',

  // Accent Colors
  accent: '#4ECDC4',
  accentLight: '#A8E6CF',
  accentDark: '#2A9D8F',

  // Status Colors
  success: '#10B981',
  error: '#FF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Text Colors
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
    disabled: '#CCCCCC',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F3F3F5',
    dark: '#1A1A1A',
  },

  // Border Colors
  border: {
    light: '#E0E0E0',
    medium: '#CCCCCC',
    dark: '#999999',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

export type ColorName = keyof typeof colors;
