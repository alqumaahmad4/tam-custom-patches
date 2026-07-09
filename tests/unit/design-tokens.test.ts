import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  blur,
  brandColors,
  designTokens,
  motionTokens,
  neutralColors,
  opacity,
  radius,
  semanticColors,
  shadows,
  spacing,
  typography,
  v3ColorCustomProperties,
  zIndex,
} from "@/lib/design-tokens";
import { contrastRatio, cssVar, meetsWcagAA, tokenValue } from "@/lib/theme";

const designTokenCss = readFileSync(join(process.cwd(), "styles", "design-tokens.css"), "utf8");

describe("design tokens", () => {
  it("exports all 22 V3 color custom properties with exact hex values", () => {
    expect(Object.keys(v3ColorCustomProperties)).toHaveLength(22);

    for (const [token, value] of Object.entries(v3ColorCustomProperties)) {
      expect(designTokenCss.toLowerCase()).toContain(`${token}: ${value.toLowerCase()};`);
      expect(tokenValue(token as keyof typeof v3ColorCustomProperties)).toBe(value);
    }
  });

  it("keeps documented WCAG AA foreground and background pairs above threshold", () => {
    expect(meetsWcagAA(brandColors.ink, brandColors.surface)).toBe(true);
    expect(contrastRatio(brandColors.ink, brandColors.surfaceAlt)).toBeGreaterThanOrEqual(4.5);
    expect(meetsWcagAA(brandColors.surface, brandColors.darkBg)).toBe(true);
    expect(meetsWcagAA(brandColors.surface, brandColors.accent)).toBe(true);
    expect(meetsWcagAA(semanticColors.mutedForeground, brandColors.surface)).toBe(true);
  });

  it("exports the complete reusable foundation token groups", () => {
    expect(Object.keys(brandColors)).toHaveLength(7);
    expect(Object.keys(neutralColors)).toHaveLength(9);
    expect(Object.keys(semanticColors)).toEqual([
      "background",
      "foreground",
      "card",
      "cardForeground",
      "primary",
      "primaryHover",
      "primaryActive",
      "primaryForeground",
      "secondary",
      "secondaryForeground",
      "muted",
      "mutedForeground",
      "destructive",
      "destructiveForeground",
      "border",
      "input",
      "ring",
      "success",
      "warning",
      "error",
      "info",
    ]);
    expect(Object.keys(typography.scale)).toHaveLength(12);
    expect(Object.keys(spacing)).toHaveLength(15);
    expect(Object.keys(radius)).toHaveLength(8);
    expect(Object.keys(shadows)).toHaveLength(9);
    expect(Object.keys(zIndex)).toHaveLength(9);
    expect(Object.keys(opacity)).toHaveLength(5);
    expect(Object.keys(blur)).toHaveLength(3);
    expect(Object.keys(motionTokens.duration)).toHaveLength(13);
    expect(designTokens.colors.v3).toBe(v3ColorCustomProperties);
  });

  it("creates typed CSS variable references for token helpers", () => {
    expect(cssVar("--color-accent")).toBe("var(--color-accent)");
    expect(cssVar("--radius-lg")).toBe("var(--radius-lg)");
  });
});
