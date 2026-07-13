import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  TrustedLogoMarquee,
  trustedLogoHeading,
  trustedLogoItems,
  trustedLogoSegments,
} from "@/features/homepage/trust-logos";

const globalsCss = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");

describe("trusted logo marquee", () => {
  it("renders the exact approved heading and accessible placeholder logos", () => {
    render(<TrustedLogoMarquee />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: trustedLogoHeading,
      }),
    ).toBeInTheDocument();

    for (const logo of trustedLogoItems) {
      expect(screen.getByRole("link", { name: logo.accessibleLabel })).toHaveAttribute(
        "href",
        logo.href,
      );
    }

    expect(screen.getAllByRole("link")).toHaveLength(trustedLogoItems.length);
  });

  it("represents every approved customer segment with original placeholders only", () => {
    expect(trustedLogoItems.map((item) => item.segment)).toEqual([...trustedLogoSegments]);
    expect(trustedLogoItems.every((item) => item.source === "original-placeholder")).toBe(true);
    expect(trustedLogoItems.every((item) => item.generatedMark.height === 48)).toBe(true);
  });

  it("keeps duplicated marquee content hidden from assistive technology", () => {
    const { container } = render(<TrustedLogoMarquee />);
    const duplicateTrack = container.querySelector("[data-track='duplicate']");

    expect(duplicateTrack).not.toBeNull();
    expect(duplicateTrack).toHaveAttribute("aria-hidden", "true");
    expect(duplicateTrack?.querySelectorAll("a")).toHaveLength(trustedLogoItems.length);

    for (const duplicateLink of duplicateTrack?.querySelectorAll("a") ?? []) {
      expect(duplicateLink).toHaveAttribute("tabindex", "-1");
    }
  });

  it("uses overflow containment and reduced-motion CSS to avoid horizontal page overflow", () => {
    const { container } = render(<TrustedLogoMarquee />);

    expect(container.querySelector(".trusted-logo-scroll")).toHaveClass("overflow-hidden");
    expect(globalsCss).toContain("@media (prefers-reduced-motion: reduce)");
    expect(globalsCss).toContain(".trusted-logo-track");
    expect(globalsCss).toContain("animation: none;");
    expect(globalsCss).toContain(".trusted-logo-duplicate");
    expect(globalsCss).toContain("display: none;");
  });

  it("defines a CSS-only seamless marquee that pauses on hover or focus", () => {
    expect(globalsCss).toContain("@keyframes trusted-logo-marquee");
    expect(globalsCss).toContain("translate3d(-50%, 0, 0)");
    expect(globalsCss).toContain("var(--duration-marquee)");
    expect(globalsCss).toContain("var(--ease-linear)");
    expect(globalsCss).toContain(".trusted-logo-marquee:is(:hover, :focus-within)");
    expect(globalsCss).toContain("animation-play-state: paused;");
  });
});
