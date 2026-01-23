/**
 * Spacing System
 * Consistent spacing values throughout the application
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

// Common spacing combinations
export const layout = {
  padding: {
    screen: spacing.base,
    card: spacing.base,
    input: spacing.md,
  },
  margin: {
    section: spacing['2xl'],
    element: spacing.base,
    small: spacing.sm,
  },
  gap: {
    small: spacing.sm,
    medium: spacing.base,
    large: spacing.xl,
  },
  borderRadius: {
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
    '2xl': 20,
    full: 9999,
  },
} as const;
