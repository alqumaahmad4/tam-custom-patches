export const v3ColorCustomProperties = {
  "--color-ink": "#0A0A0A",
  "--color-surface": "#FFFFFF",
  "--color-surface-alt": "#F8FAFC",
  "--color-accent": "#1A56DB",
  "--color-accent-dark": "#1E429F",
  "--color-gold": "#B8860B",
  "--color-dark-bg": "#1A1A2E",
  "--color-success": "#16A34A",
  "--color-success-light": "#DCFCE7",
  "--color-error": "#DC2626",
  "--color-error-light": "#FEE2E2",
  "--color-warning": "#D97706",
  "--color-warning-light": "#FEF3C7",
  "--color-info": "#0284C7",
  "--color-info-light": "#E0F2FE",
  "--color-border": "#E2E8F0",
  "--color-border-focus": "#1A56DB",
  "--color-muted": "#64748B",
  "--color-muted-light": "#94A3B8",
  "--color-tag-bg": "#DBEAFE",
  "--color-section-bg": "#F1F5F9",
  "--color-warm": "#F5F0EB",
} as const;

export const brandColors = {
  ink: v3ColorCustomProperties["--color-ink"],
  surface: v3ColorCustomProperties["--color-surface"],
  surfaceAlt: v3ColorCustomProperties["--color-surface-alt"],
  accent: v3ColorCustomProperties["--color-accent"],
  accentDark: v3ColorCustomProperties["--color-accent-dark"],
  gold: v3ColorCustomProperties["--color-gold"],
  darkBg: v3ColorCustomProperties["--color-dark-bg"],
} as const;

export const neutralColors = {
  0: v3ColorCustomProperties["--color-surface"],
  50: v3ColorCustomProperties["--color-surface-alt"],
  100: v3ColorCustomProperties["--color-section-bg"],
  200: v3ColorCustomProperties["--color-border"],
  300: "#CBD5E1",
  400: v3ColorCustomProperties["--color-muted-light"],
  600: v3ColorCustomProperties["--color-muted"],
  900: v3ColorCustomProperties["--color-dark-bg"],
  950: v3ColorCustomProperties["--color-ink"],
} as const;

export const semanticColors = {
  background: brandColors.surfaceAlt,
  foreground: brandColors.ink,
  card: brandColors.surface,
  cardForeground: brandColors.ink,
  primary: brandColors.accent,
  primaryHover: brandColors.accentDark,
  primaryActive: "#1E3A8A",
  primaryForeground: brandColors.surface,
  secondary: v3ColorCustomProperties["--color-section-bg"],
  secondaryForeground: brandColors.ink,
  muted: v3ColorCustomProperties["--color-section-bg"],
  mutedForeground: v3ColorCustomProperties["--color-muted"],
  destructive: v3ColorCustomProperties["--color-error"],
  destructiveForeground: brandColors.surface,
  border: v3ColorCustomProperties["--color-border"],
  input: v3ColorCustomProperties["--color-border"],
  ring: v3ColorCustomProperties["--color-border-focus"],
  success: v3ColorCustomProperties["--color-success"],
  warning: v3ColorCustomProperties["--color-warning"],
  error: v3ColorCustomProperties["--color-error"],
  info: v3ColorCustomProperties["--color-info"],
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  scale: {
    "2xs": { size: "11px", lineHeight: "1.4", weight: "400", tracking: "0.04em" },
    xs: { size: "12px", lineHeight: "1.4", weight: "400/500", tracking: "0.03em" },
    sm: { size: "14px", lineHeight: "1.5", weight: "400/500", tracking: "0.01em" },
    base: { size: "16px", lineHeight: "1.625", weight: "400", tracking: "0" },
    lg: { size: "18px", lineHeight: "1.6", weight: "400/500", tracking: "-0.01em" },
    xl: { size: "20px", lineHeight: "1.5", weight: "500/600", tracking: "-0.01em" },
    "2xl": { size: "24px", lineHeight: "1.4", weight: "600/700", tracking: "-0.02em" },
    "3xl": { size: "30px", lineHeight: "1.3", weight: "700", tracking: "-0.02em" },
    "4xl": { size: "36px", lineHeight: "1.2", weight: "700", tracking: "-0.03em" },
    "5xl": { size: "48px", lineHeight: "1.1", weight: "700/800", tracking: "-0.04em" },
    "6xl": { size: "60px", lineHeight: "1.05", weight: "800", tracking: "-0.05em" },
    "7xl": { size: "72px", lineHeight: "1.0", weight: "800", tracking: "-0.06em" },
  },
  fluid: {
    hero: "clamp(2.5rem, 5vw + 1rem, 4.5rem)",
    h1: "clamp(2rem, 3vw + 1rem, 2.75rem)",
    h2: "clamp(1.5rem, 2vw + 0.75rem, 2rem)",
  },
  uppercaseTracking: "0.06em",
  maxMeasure: "70ch",
} as const;

export const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  32: "128px",
  40: "160px",
  48: "192px",
} as const;

export const layout = {
  containers: {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1440px",
    full: "100%",
  },
  breakpoints: {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1440px",
  },
  grid: {
    mobile: { columns: 4, gutter: "16px", margin: "16px" },
    tablet: { columns: 8, gutter: "24px", margin: "24px" },
    desktop: { columns: 12, gutter: "24px", margin: "32px" },
    wide: { columns: 12, gutter: "32px", margin: "40px" },
    xl: { columns: 12, gutter: "40px", margin: "48px" },
  },
} as const;

export const radius = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  "3xl": "24px",
  full: "9999px",
} as const;

export const shadows = {
  xs: "0 1px 2px rgba(0,0,0,0.04)",
  sm: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  md: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)",
  lg: "0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.04)",
  xl: "0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.04)",
  "2xl": "0 25px 50px rgba(0,0,0,0.16)",
  premium: "0 32px 64px rgba(0,0,0,0.22)",
  focus: "0 0 0 3px rgba(26,86,219,0.3)",
  inset: "inset 0 2px 4px rgba(0,0,0,0.06)",
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 1000,
  sticky: 1100,
  drawer: 1150,
  modal: 1200,
  popover: 1300,
  toast: 1350,
  tooltip: 1400,
} as const;

export const opacity = {
  disabled: 0.5,
  placeholder: 0.4,
  overlaySubtle: 0.08,
  glass: 0.12,
  mutedDark: 0.75,
} as const;

export const blur = {
  none: "0",
  glass: "12px",
  backdrop: "12px",
} as const;

export const motionTokens = {
  duration: {
    instant: 0,
    tap: 0.1,
    fast: 0.15,
    base: 0.2,
    medium: 0.25,
    page: 0.3,
    step: 0.35,
    slow: 0.4,
    reveal: 0.5,
    hero: 0.6,
    shimmer: 1.5,
    autoDrift: 6,
    marquee: 30,
  },
  durationMs: {
    instant: "0ms",
    tap: "100ms",
    fast: "150ms",
    base: "200ms",
    medium: "250ms",
    page: "300ms",
    step: "350ms",
    slow: "400ms",
    reveal: "500ms",
    hero: "600ms",
    shimmer: "1500ms",
    autoDrift: "6000ms",
    marquee: "30000ms",
  },
  easing: {
    out: [0, 0, 0.2, 1],
    in: [0.4, 0, 1, 1],
    inOut: [0.4, 0, 0.2, 1],
    linear: "linear",
  },
  easingCss: {
    out: "cubic-bezier(0, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
  },
} as const;

export const designTokens = {
  colors: {
    v3: v3ColorCustomProperties,
    brand: brandColors,
    neutral: neutralColors,
    semantic: semanticColors,
  },
  typography,
  spacing,
  layout,
  radius,
  shadows,
  zIndex,
  opacity,
  blur,
  motion: motionTokens,
} as const;

export type DesignTokens = typeof designTokens;
export type V3ColorCustomProperty = keyof typeof v3ColorCustomProperties;
export type BrandColor = keyof typeof brandColors;
export type SemanticColor = keyof typeof semanticColors;
export type TextScale = keyof typeof typography.scale;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type ShadowToken = keyof typeof shadows;
export type BreakpointToken = keyof typeof layout.breakpoints;
