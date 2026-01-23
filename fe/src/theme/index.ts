/**
 * Theme Export
 * Centralized theme configuration
 */

import { colors } from './colors';
import { typography, textStyles } from './typography';
import { spacing, layout } from './spacing';

// Export individual theme modules
export { colors };
export { typography, textStyles };
export { spacing, layout };

// Theme object combining all theme values
export const theme = {
  colors,
  typography,
  textStyles,
  spacing,
  layout,
} as const;

export type Theme = typeof theme;
