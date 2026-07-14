import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FooterTrustIcons, footerTrustIcons, footerTrustIconsLabel } from "@/components/footer";
import { SiteFooter } from "@/components/layout/site-footer";

vi.mock("next/image", () => ({
  default: ({
    alt,
    className,
    height,
    src,
    width,
  }: {
    alt: string;
    className?: string;
    height: number;
    src: string;
    width: number;
  }) => (
    <span
      aria-label={alt}
      className={className}
      data-height={height}
      data-src={src}
      data-width={width}
      role="img"
    />
  ),
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

describe("footer trust icon strip", () => {
  it("renders all required icons in the exact approved order", () => {
    render(<FooterTrustIcons />);

    const region = screen.getByRole("region", { name: footerTrustIconsLabel });
    const icons = within(region).getAllByRole("img");

    expect(icons).toHaveLength(10);
    expect(
      icons.map((icon) => icon.getAttribute("aria-label") ?? icon.getAttribute("alt")),
    ).toEqual([...expectedOrder]);
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
      const viewBox = getSvgAttribute(asset, "viewBox");
      const viewBoxValues = viewBox.split(/\s+/).map(Number);

      expect(asset).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(asset).toContain(`width="${icon.intrinsicWidth}"`);
      expect(asset).toContain(`height="${icon.intrinsicHeight}"`);
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

  it("renders full-color assets without placeholder filter styling", () => {
    render(<FooterTrustIcons />);

    const region = screen.getByRole("region", { name: footerTrustIconsLabel });
    const icons = within(region).getAllByRole("img");

    icons.forEach((icon, index) => {
      const data = footerTrustIcons[index];

      expect(icon).toHaveAttribute("data-src", data.assetPath);
      expect(icon).toHaveAttribute("data-width", String(data.intrinsicWidth));
      expect(icon).toHaveAttribute("data-height", String(data.intrinsicHeight));
      expect(icon).toHaveClass("object-contain");
      expect(icon.className).not.toMatch(/brightness|invert|grayscale|filter|opacity/i);
    });
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
