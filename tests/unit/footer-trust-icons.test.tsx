import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  FooterTrustIcons,
  footerTrustIconAmericanExpressImageClassName,
  footerTrustIconImageClassName,
  footerTrustIcons,
  footerTrustIconsLabel,
  footerTrustIconSlotClassName,
  footerTrustMarqueeDuration,
} from "@/components/footer";
import { SiteFooter } from "@/components/layout/site-footer";

vi.mock("next/image", () => ({
  default: ({
    alt,
    "aria-hidden": ariaHidden,
    className,
    height,
    src,
    width,
  }: {
    alt: string;
    "aria-hidden"?: boolean | "true";
    className?: string;
    height: number;
    src: string;
    width: number;
  }) => {
    const isHidden = ariaHidden === true || ariaHidden === "true";

    return (
      <span
        aria-hidden={isHidden ? true : undefined}
        aria-label={isHidden ? undefined : alt}
        className={className}
        data-height={height}
        data-src={src}
        data-width={width}
        role={isHidden ? undefined : "img"}
      />
    );
  },
}));

const expectedOrder = [
  "Visa",
  "Mastercard",
  "American Express",
  "PayPal",
  "Stripe",
  "SSL secured connection",
  "DHL",
  "FedEx",
  "UPS",
  "USPS",
] as const;

function getAssetPath(assetPath: string) {
  return join(process.cwd(), "public", assetPath.replace(/^\//, ""));
}

function getSvgAttribute(asset: string, attribute: string) {
  const match = asset.match(new RegExp(`${attribute}="([^"]+)"`));

  return match?.[1] ?? "";
}

function getViewBoxValues(asset: string) {
  return getSvgAttribute(asset, "viewBox").split(/\s+/).map(Number);
}

function getTrustStripCss() {
  return readFileSync(
    join(process.cwd(), "components", "footer", "footer-trust-icons.module.css"),
    "utf8",
  );
}

describe("footer trust icon strip", () => {
  it("renders all required icons in the exact approved order", () => {
    render(<FooterTrustIcons />);

    const region = screen.getByRole("region", { name: footerTrustIconsLabel });
    const icons = within(region).getAllByRole("img");

    expect(icons).toHaveLength(10);
    expect(
      icons.map((icon) => icon.getAttribute("aria-label") ?? icon.getAttribute("alt")),
    ).toEqual([...expectedOrder]);

    expect(region.querySelectorAll("[aria-hidden='true'] [data-src]")).toHaveLength(10);
  });

  it("renders no visible heading, wording, links, buttons, or focusable icon controls", () => {
    render(<FooterTrustIcons />);

    const region = screen.getByRole("region", { name: footerTrustIconsLabel });

    expect(within(region).queryByRole("heading")).not.toBeInTheDocument();
    expect(region.textContent?.trim()).toBe("");
    expect(within(region).queryByRole("link")).not.toBeInTheDocument();
    expect(within(region).queryByRole("button")).not.toBeInTheDocument();
    expect(region.querySelectorAll("a,button,input,select,textarea,[tabindex]")).toHaveLength(0);
  });

  it("keeps typed data complete, categorized, local, unique, and approved", () => {
    expect(footerTrustIcons.map((icon) => icon.name)).toEqual([...expectedOrder]);
    expect(new Set(footerTrustIcons.map((icon) => icon.id)).size).toBe(10);
    expect(new Set(footerTrustIcons.map((icon) => icon.name)).size).toBe(10);
    expect(new Set(footerTrustIcons.map((icon) => icon.assetPath)).size).toBe(10);
    expect(footerTrustIcons.map((icon) => icon.category)).toEqual([
      "payment",
      "payment",
      "payment",
      "payment",
      "processor",
      "security",
      "shipping",
      "shipping",
      "shipping",
      "shipping",
    ]);

    for (const icon of footerTrustIcons) {
      expect(icon.status).toBe("approved");
      expect(icon.assetPath).toMatch(/^\/trust-icons\/.+\.svg$/);
      expect(icon.intrinsicWidth).toBeGreaterThan(0);
      expect(icon.intrinsicHeight).toBeGreaterThan(0);
      expect(existsSync(getAssetPath(icon.assetPath))).toBe(true);
    }
  });

  it("uses local SVG files with valid metadata that matches typed dimensions", () => {
    for (const icon of footerTrustIcons) {
      const asset = readFileSync(getAssetPath(icon.assetPath), "utf8");
      const viewBoxValues = getViewBoxValues(asset);

      expect(asset).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(getSvgAttribute(asset, "width")).not.toBe("");
      expect(getSvgAttribute(asset, "height")).not.toBe("");
      expect(viewBoxValues).toHaveLength(4);
      expect(viewBoxValues.every(Number.isFinite)).toBe(true);
      expect(viewBoxValues[2]).toBe(icon.intrinsicWidth);
      expect(viewBoxValues[3]).toBe(icon.intrinsicHeight);
      expect(asset).toContain('preserveAspectRatio="xMidYMid meet"');
      expect(asset).not.toMatch(/<!DOCTYPE/i);
      expect(asset).not.toMatch(/<image\b|base64/i);
      expect(asset).not.toMatch(/\b(?:href|src)=["']https?:\/\//i);
      expect(asset).not.toMatch(/url\(["']?https?:\/\//i);
      expect(asset).not.toMatch(/@import[^;]+https?:\/\//i);
      expect(asset).not.toMatch(/@font-face|font-family\s*:/i);
      expect(asset).not.toMatch(/<script\b/i);
      expect(asset).not.toMatch(/<path\b(?:(?!>).)*\sd=["']["']/i);
    }
  });

  it("documents the supplied shared canvas groups", () => {
    const canvasGroups = new Map<string, string[]>();

    for (const icon of footerTrustIcons) {
      const asset = readFileSync(getAssetPath(icon.assetPath), "utf8");
      const [, , width, height] = getViewBoxValues(asset);
      const key = `${width}x${height}`;

      canvasGroups.set(key, [...(canvasGroups.get(key) ?? []), icon.name]);
    }

    expect(canvasGroups.get("11693x16535")).toEqual([
      "Visa",
      "Mastercard",
      "PayPal",
      "Stripe",
      "SSL secured connection",
      "DHL",
      "FedEx",
      "UPS",
      "USPS",
    ]);
    expect(canvasGroups.get("8500x11000")).toEqual(["American Express"]);
  });

  it("renders final assets in equal slots without placeholder filter styling", () => {
    render(<FooterTrustIcons />);

    const region = screen.getByRole("region", { name: footerTrustIconsLabel });
    const icons = within(region).getAllByRole("img");

    icons.forEach((icon, index) => {
      const data = footerTrustIcons[index];
      const slot = icon.closest("li");

      expect(icon).toHaveAttribute("data-src", data.assetPath);
      expect(icon).toHaveAttribute("data-width", String(data.intrinsicWidth));
      expect(icon).toHaveAttribute("data-height", String(data.intrinsicHeight));
      expect(slot).toHaveClass(...footerTrustIconSlotClassName.split(" "));
      expect(icon).toHaveClass(
        ...(data.id === "american-express"
          ? footerTrustIconAmericanExpressImageClassName
          : footerTrustIconImageClassName
        ).split(" "),
      );
      expect(icon.className).not.toMatch(/brightness|invert|grayscale|filter|opacity/i);
    });
  });

  it("uses desktop space-between layout and a CSS-only mobile marquee", () => {
    const css = getTrustStripCss();

    expect(footerTrustMarqueeDuration).toBe("32s");
    expect(css).toContain(
      `animation: footerTrustMarquee ${footerTrustMarqueeDuration} linear infinite`,
    );
    expect(css).toContain("transform: translate3d(-50%, 0, 0)");
    expect(css).toContain("animation-play-state: paused");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("@media (min-width: 1024px)");
    expect(css).toContain("justify-content: space-between");
    expect(css).toContain("animation: none");
    expect(css).not.toMatch(/filter|grayscale|brightness|opacity|box-shadow|border-radius/i);
  });

  it("places the strip above the legal and copyright row in the site footer", () => {
    render(<SiteFooter />);

    const trustStrip = screen.getByRole("region", { name: footerTrustIconsLabel });
    const legalLinks = screen.getByRole("navigation", { name: "Legal links" });

    expect(
      trustStrip.compareDocumentPosition(legalLinks) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
