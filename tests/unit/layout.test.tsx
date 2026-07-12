import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MainContent } from "@/components/layout/main-content";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { navigationGroups } from "@/lib/navigation";
import { routes } from "@/lib/site-config";

let pathname: string = routes.home;

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: ({ alt, className, src }: { alt: string; className?: string; src: string }) => (
    <span aria-label={alt} className={className} data-src={src} />
  ),
}));

describe("global layout foundation", () => {
  afterEach(() => {
    pathname = routes.home;
  });

  it("keeps the documented primary navigation labels", () => {
    expect(navigationGroups.map((item) => item.label)).toEqual([
      "Custom Patches",
      "Custom Apparel",
      "Martial Arts Uniforms & Gear",
      "Accessories",
      "Industries",
      "Resources",
    ]);
  });

  it("renders an accessible header shell with main navigation and quote CTA", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("banner")).toHaveAttribute("data-variant", "marketing");
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("link").some((link) => link.getAttribute("href") === routes.quote),
    ).toBe(true);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("uses the minimized quote header on the quote route", () => {
    pathname = routes.quote;

    render(<SiteHeader />);

    expect(screen.getByRole("banner")).toHaveAttribute("data-variant", "quote");
    expect(screen.queryByRole("navigation", { name: "Main navigation" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open search" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to site/i })).toHaveAttribute(
      "href",
      routes.home,
    );
  });

  it("keeps homepage content flush behind the transparent header and offsets other routes", () => {
    const { rerender } = render(
      <MainContent>
        <span>Homepage content</span>
      </MainContent>,
    );

    expect(screen.getByRole("main")).not.toHaveClass("pt-16");

    pathname = routes.quote;
    rerender(
      <MainContent>
        <span>Quote content</span>
      </MainContent>,
    );

    expect(screen.getByRole("main")).toHaveClass("pt-16", "lg:pt-20");
  });

  it("keeps dialog and sheet layers above the fixed header with z-index tokens", () => {
    const { unmount } = render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Search layer</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    const modalLayers = Array.from(document.body.querySelectorAll("[data-state='open']")).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node.className.includes("z-[var(--z-modal)]"),
    );

    expect(modalLayers.length).toBeGreaterThanOrEqual(2);
    unmount();

    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Menu layer</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    const drawerLayers = Array.from(document.body.querySelectorAll("[data-state='open']")).filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node.className.includes("z-[var(--z-drawer)]"),
    );

    expect(drawerLayers.length).toBeGreaterThanOrEqual(2);
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
