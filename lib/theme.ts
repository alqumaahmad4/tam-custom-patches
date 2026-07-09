import { v3ColorCustomProperties, type V3ColorCustomProperty } from "@/lib/design-tokens";

export type CSSCustomProperty = `--${string}`;
export type CSSVarExpression<T extends CSSCustomProperty = CSSCustomProperty> = `var(${T})`;

export function cssVar<T extends CSSCustomProperty>(token: T): CSSVarExpression<T> {
  return `var(${token})`;
}

export function tokenValue(token: V3ColorCustomProperty) {
  return v3ColorCustomProperties[token];
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace("#", "");

  if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) {
    throw new Error(`Invalid 6-digit hex color: ${hex}`);
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function channelToLinear(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b);
}

export function contrastRatio(foreground: string, background: string) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lightest = Math.max(foregroundLuminance, backgroundLuminance);
  const darkest = Math.min(foregroundLuminance, backgroundLuminance);

  return (lightest + 0.05) / (darkest + 0.05);
}

export function meetsWcagAA(foreground: string, background: string, largeText = false) {
  return contrastRatio(foreground, background) >= (largeText ? 3 : 4.5);
}
