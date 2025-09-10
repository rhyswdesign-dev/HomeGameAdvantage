import { colors, spacing, radii, fonts, textStyles, buttons, layouts, components } from '../theme/tokens';

/**
 * Global theme hook for easy access to design system
 * Use this instead of importing tokens directly for better consistency
 */
export const useTheme = () => {
  return {
    colors,
    spacing,
    radii,
    fonts,
    textStyles,
    buttons,
    layouts,
    components,
  };
};