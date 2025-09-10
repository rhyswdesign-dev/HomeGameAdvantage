/**
 * Global Design System - All colors centralized here
 * Change these values to instantly update your entire app
 */
export const colors = {
  // App Structure
  bg:            '#20150F', // app background
  card:          '#2B1B12', // section / card background
  modalOverlay:  'rgba(0,0,0,0.53)', // modal backgrounds
  
  // Navigation
  headerBg:      '#2A211C', // navigation header
  headerText:    '#F4E6D0', // header title/back button
  
  // Chips & Pills
  chipBg:        '#3A2A1F',
  chipActive:    '#5A3F2A',
  chipBorder:    'rgba(255,255,255,0.08)',
  
  // Text Hierarchy
  text:          '#F5ECDF', // primary text
  textLight:     '#F4ECE4', // light variant
  textMuted:     '#EDE6DE', // secondary text  
  subtext:       '#D6C2A8', // tertiary text
  subtle:        '#C9BEB3', // very subtle text
  muted:         'rgba(245,236,223,0.6)', // semi-transparent
  
  // Accents & Highlights
  gold:          '#D7A15E', // primary accent
  goldText:      '#0D0906', // text on gold
  accent:        '#E4933E', // secondary accent
  accentText:    '#E4933E', // accent text color
  accentLight:   '#F2D59A', // light accent for icons
  
  // System Colors
  white:         '#FFFFFF',
  line:          'rgba(255,255,255,0.08)', // borders/dividers
  border:        'rgba(255,255,255,0.08)', // border color alias
  shadow:        'rgba(0,0,0,0.35)',
  
  // Avatar/Profile
  avatar:        '#2A241F', // avatar background
  
  // Tier Colors
  tierGold: '#FFD700',
  tierSilver: '#C0C0C0',
  tierBronze: '#CD7F32',
  tierTextOnGold: '#000000',
  tierTextOnSilver: '#000000',
  tierTextOnBronze: '#FFFFFF',
  
  // Component-specific (legacy names for compatibility)
  pillButtonColor: '#E4933E',
  pillTextOnLight: '#000000',
  pillTextOnDark: '#FFFFFF',
};

export const spacing = (n: number) => 8 * n;

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
};

export const fonts = {
  h1: 28,
  h2: 22,
  h3: 18,
  body: 16,
  small: 13,
  caption: 12,
};

// Global Text Styles
export const textStyles = {
  h1: {
    fontSize: fonts.h1,
    fontWeight: '900' as const,
    color: colors.text,
    lineHeight: fonts.h1 * 1.2,
  },
  h2: {
    fontSize: fonts.h2,
    fontWeight: '700' as const,
    color: colors.text,
    lineHeight: fonts.h2 * 1.2,
  },
  h3: {
    fontSize: fonts.h3,
    fontWeight: '600' as const,
    color: colors.text,
    lineHeight: fonts.h3 * 1.3,
  },
  body: {
    fontSize: fonts.body,
    fontWeight: '400' as const,
    color: colors.text,
    lineHeight: fonts.body * 1.5,
  },
  bodyMedium: {
    fontSize: fonts.body,
    fontWeight: '600' as const,
    color: colors.text,
    lineHeight: fonts.body * 1.5,
  },
  small: {
    fontSize: fonts.small,
    fontWeight: '400' as const,
    color: colors.subtext,
    lineHeight: fonts.small * 1.4,
  },
  caption: {
    fontSize: fonts.small,
    fontWeight: '400' as const,
    color: colors.subtle,
    lineHeight: fonts.small * 1.3,
  },
};

// Standardized Text Styles for Cards/CTAs
export const standardText = {
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.textLight,
    marginBottom: 0, // No margin, controlled by body text
  },
  body: {
    fontSize: 15,
    color: colors.subtle,
    lineHeight: 20,
    marginTop: 6, // Consistent gap under title
  },
};

// Global Button Styles
export const buttons = {
  primary: {
    backgroundColor: colors.accent,
    color: colors.pillTextOnLight,
    fontSize: 16,
    fontWeight: '600' as const,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    borderRadius: radii.xl,
    height: 44,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
  },
  secondary: {
    backgroundColor: 'transparent',
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600' as const,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.accent,
    height: 44,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600' as const,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    borderRadius: radii.xl,
    height: 44,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
  },
  pill: {
    backgroundColor: colors.pillButtonColor,
    color: colors.pillTextOnLight,
    fontSize: 16,
    fontWeight: '600' as const,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.5),
    borderRadius: 9999,
    height: 44,
    minWidth: 44,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
  },
  // Standardized CTA button for cards
  cta: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    paddingVertical: spacing(1.5),
    marginTop: spacing(2),
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.white,
  },
};

// Global Layout Styles
export const layouts = {
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing(2),
  },
  section: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(3),
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing(2),
    borderWidth: 1,
    borderColor: colors.line,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  spaceBetween: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  center: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
};

// Global Component Styles
export const components = {
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.avatar,
  },
  modal: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'flex-end' as const,
  },
  header: {
    backgroundColor: colors.headerBg,
  },
  headerText: {
    color: colors.headerText,
    fontWeight: '800' as const,
  },
  icon: {
    color: colors.accentLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
};
