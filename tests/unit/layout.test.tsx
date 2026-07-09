import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { primaryNavigation, routes } from "@/lib/site-config";

vi.mock("next/navigation", () => ({
  usePathname: () => routes.home,
}));

vi.mock("next/image", () => ({
  default: ({ alt, className, src }: { alt: string; className?: string; src: string }) => (
    <span aria-label={alt} className={className} data-src={src} />
  ),
}));

describe("global layout foundation", () => {
  it("keeps the documented primary navigation labels", () => {
    expect(primaryNavigation.map((item) => item.label)).toEqual([
      "Custom Patches",
      "Apparel",
      "Martial Arts",
      "Accessories",
      "Gallery",
      "About",
    ]);
  });

  it("renders an accessible header shell with main navigation and quote CTA", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("link").some((link) => link.getAttribute("href") === routes.quote),
    ).toBe(true);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("renders a skip link targeting the main content landmark", () => {
    render(<SkipLink />);

    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main-content",
    );
  });

  it("renders breadcrumb HTML and BreadcrumbList JSON-LD", () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: "Home", href: routes.home },
          { label: "Industries", href: "/industries" },
          { label: "Clubs" },
        ]}
      />,
    );
    const schema = container.querySelector('script[type="application/ld+json"]');

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Clubs")).toHaveAttribute("aria-current", "page");
    expect(schema?.textContent).toContain('"@type":"BreadcrumbList"');
    expect(schema?.textContent).toContain('"name":"Industries"');
  });
});
