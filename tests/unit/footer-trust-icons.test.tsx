import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FooterTrustIcons, footerTrustIcons, footerTrustIconsLabel } from "@/components/footer";
import { SiteFooter } from "@/components/layout/site-footer";

vi.mock("next/image", () => ({
  default: ({ alt, className, src }: { alt: string; className?: string; src: string }) => (
    <span aria-label={alt} className={className} data-src={src} role="img" />
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

  it("keeps typed data complete, categorized, local, and placeholder-only", () => {
    expect(footerTrustIcons.map((icon) => icon.name)).toEqual([...expectedOrder]);
    expect(new Set(footerTrustIcons.map((icon) => icon.id)).size).toBe(10);
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
      expect(icon.status).toBe("placeholder");
      expect(icon.assetPath).toMatch(/^\/trust-icons\/.+\.svg$/);
      expect(icon.intrinsicWidth).toBeGreaterThan(0);
      expect(icon.intrinsicHeight).toBe(32);
    }
  });

  it("uses local SVG files with the required namespace and intrinsic dimensions", () => {
    for (const icon of footerTrustIcons) {
      const asset = readFileSync(
        join(process.cwd(), "public", icon.assetPath.replace(/^\//, "")),
        "utf8",
      );

      expect(asset).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(asset).toContain(`width="${icon.intrinsicWidth}"`);
      expect(asset).toContain(`height="${icon.intrinsicHeight}"`);
      expect(asset).toContain("viewBox=");
      expect(asset).not.toMatch(/<image\b|base64/i);
      expect(asset).not.toMatch(/\b(?:href|src)=["']https?:\/\//i);
    }
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
