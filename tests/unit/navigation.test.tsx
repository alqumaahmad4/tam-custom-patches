import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SiteHeader } from "@/components/layout/site-header";
import { routes } from "@/lib/site-config";

let pathname: string = routes.home;
const routerPush = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({
    push: routerPush,
  }),
}));

vi.mock("next/image", () => ({
  default: ({ alt, className, src }: { alt: string; className?: string; src: string }) => (
    <span aria-label={alt} className={className} data-src={src} />
  ),
}));

describe("navigation system", () => {
  afterEach(() => {
    pathname = routes.home;
    routerPush.mockClear();
  });

  it("opens and closes the desktop mega menu", () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Custom Patches" }));

    const submenu = screen.getByRole("region", { name: "Custom Patches submenu" });
    const embroideredPatchLinks = within(submenu).getAllByRole("link", {
      name: /embroidered patches/i,
    });

    expect(submenu).toBeInTheDocument();
    expect(embroideredPatchLinks).toHaveLength(2);
    embroideredPatchLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", routes.embroideredPatches);
    });

    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.queryByRole("region", { name: "Custom Patches submenu" }),
    ).not.toBeInTheDocument();
  });

  it("supports keyboard access to the mega menu", () => {
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "Custom Apparel" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });

    expect(screen.getByRole("region", { name: "Custom Apparel submenu" })).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("opens and closes the mobile drawer and restores focus", async () => {
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(trigger);

    const drawer = screen.getByRole("dialog");
    expect(within(drawer).getByRole("button", { name: "Custom Patches" })).toBeInTheDocument();

    fireEvent.click(within(drawer).getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it("renders mobile accordion links", () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const drawer = screen.getByRole("dialog");
    fireEvent.click(within(drawer).getByRole("button", { name: "Accessories" }));

    expect(within(drawer).getByRole("link", { name: "PVC Keychains" })).toHaveAttribute(
      "href",
      routes.pvcKeychains,
    );
  });

  it("opens search from the header button and keyboard shortcut", async () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Open search" }));

    expect(
      await screen.findByRole("searchbox", {
        name: "Search products, categories, industries, and blog",
      }),
    ).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByRole("searchbox", {
          name: "Search products, categories, industries, and blog",
        }),
      ).not.toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });

    expect(
      await screen.findByRole("searchbox", {
        name: "Search products, categories, industries, and blog",
      }),
    ).toBeInTheDocument();
  });

  it("shows grouped search results, empty state, and no-results state", async () => {
    render(<SiteHeader />);

    fireEvent.keyDown(document, { key: "k", metaKey: true });

    const searchbox = await screen.findByRole("searchbox", {
      name: "Search products, categories, industries, and blog",
    });
    expect(screen.getByText("Popular searches")).toBeInTheDocument();

    fireEvent.change(searchbox, { target: { value: "BJJ" } });

    expect(await screen.findByRole("heading", { name: "Products" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /BJJ Gis/i })).toBeInTheDocument();

    fireEvent.change(searchbox, { target: { value: "zzzz-not-found" } });

    expect(await screen.findByText('No results for "zzzz-not-found"')).toBeInTheDocument();
  });

  it("opens the selected search result with keyboard navigation", async () => {
    render(<SiteHeader />);

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });

    const searchbox = await screen.findByRole("searchbox", {
      name: "Search products, categories, industries, and blog",
    });

    fireEvent.change(searchbox, { target: { value: "hoodies" } });
    expect(await screen.findByRole("button", { name: /Hoodies/i })).toBeInTheDocument();

    fireEvent.keyDown(searchbox, { key: "Enter" });

    expect(routerPush).toHaveBeenCalledWith(routes.hoodies);
  });

  it("marks the active navigation item", () => {
    pathname = routes.apparel;

    render(<SiteHeader />);

    expect(screen.getByRole("button", { name: "Custom Apparel" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
