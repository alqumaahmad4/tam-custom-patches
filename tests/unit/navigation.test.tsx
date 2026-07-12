import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SiteHeader } from "@/components/layout/site-header";
import {
  industriesNavigationLinks,
  navigationGroups,
  productNavigationGroups,
  productsMegaMenuActions,
  searchIndex,
} from "@/lib/navigation";
import { routes } from "@/lib/site-config";

let pathname: string = routes.home;
const routerPush = vi.fn();

const searchboxName =
  "Search products, industries, design and pricing, guides and support, about pages, and blog";

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

  it("defines the approved header hierarchy", () => {
    expect(navigationGroups.map((item) => item.label)).toEqual([
      "Products",
      "Industries",
      "Design & Pricing",
      "Guides & Support",
      "About",
    ]);
  });

  it("defines exactly five primary product groups without duplicate primary products", () => {
    expect(productNavigationGroups.map((group) => group.label)).toEqual([
      "Custom Patches",
      "Custom Apparel",
      "Custom Activewear",
      "Martial Arts Uniforms & Gear",
      "Accessories & Specialty Products",
    ]);

    const productLabels = productNavigationGroups.flatMap((group) =>
      group.links.map((link) => link.label),
    );

    expect(new Set(productLabels).size).toBe(productLabels.length);
  });

  it("keeps martial arts products and martial arts industries in separate groups", () => {
    const martialArtsProducts = productNavigationGroups.find(
      (group) => group.id === "martial-arts",
    );
    const patchProducts = productNavigationGroups.find((group) => group.id === "patches");

    expect(martialArtsProducts?.links.map((link) => link.label)).toContain("Martial Arts Patches");
    expect(patchProducts?.links.map((link) => link.label)).not.toContain("Martial Arts Patches");
    expect(industriesNavigationLinks.map((link) => link.label)).toContain(
      "Martial Arts Schools and Academies",
    );
  });

  it("removes the public country selector from header and mobile navigation", () => {
    render(<SiteHeader />);

    expect(screen.queryByText(/country selector/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /select country/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const drawer = screen.getByRole("dialog");
    expect(within(drawer).queryByText(/country selector/i)).not.toBeInTheDocument();
    expect(
      within(drawer).queryByRole("button", { name: /select country/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the revised desktop header labels and actions", () => {
    render(<SiteHeader />);

    for (const label of [
      "Products",
      "Industries",
      "Design & Pricing",
      "Guides & Support",
      "About",
    ]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }

    expect(screen.getByRole("button", { name: "Open search" })).toBeInTheDocument();
    expect(screen.getByText("AI Design Studio")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open AI Design Studio" })).toHaveAttribute(
      "href",
      routes.aiDesigner,
    );
    expect(screen.getByRole("link", { name: "Get a Quote" })).toHaveAttribute("href", routes.quote);
  });

  it("opens the products mega menu with approved groups and footer actions", () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Products" }));

    const submenu = screen.getByRole("region", { name: "Products submenu" });

    for (const group of productNavigationGroups) {
      const heading = within(submenu).getByRole("heading", { name: group.label });
      const section = heading.closest("section");

      expect(section).not.toBeNull();
      expect(
        within(section as HTMLElement).getByRole("link", { name: group.viewAllLabel }),
      ).toHaveAttribute("href", group.href);
    }

    const patchesSection = within(submenu)
      .getByRole("heading", { name: "Custom Patches" })
      .closest("section") as HTMLElement;
    expect(
      within(patchesSection).getByRole("link", { name: "Embroidered Patches" }),
    ).toHaveAttribute("href", routes.embroideredPatches);

    expect(within(submenu).getByRole("link", { name: "Explore All Products" })).toHaveAttribute(
      "href",
      routes.products,
    );
    expect(within(submenu).getByRole("link", { name: "Design Your Own Patch" })).toHaveAttribute(
      "href",
      routes.designYourOwnPatch,
    );
    expect(within(submenu).getByRole("link", { name: "Get a Quote" })).toHaveAttribute(
      "href",
      routes.quote,
    );

    expect(productsMegaMenuActions.map((action) => action.label)).toEqual([
      "Explore All Products",
      "Design Your Own Patch",
      "Get a Quote",
    ]);
  });

  it("supports keyboard access to the mega menu", async () => {
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "Products" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });

    expect(screen.getByRole("region", { name: "Products submenu" })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Embroidered Patches" })).toHaveFocus();
    });

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("region", { name: "Products submenu" })).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("uses tablet and mobile fallback before the full desktop breakpoint", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("navigation", { name: "Main navigation" }).parentElement).toHaveClass(
      "xl:flex",
    );
    expect(screen.getByRole("navigation", { name: "Tablet navigation" })).toHaveClass(
      "md:flex",
      "xl:hidden",
    );
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveClass("xl:hidden");
  });

  it("opens the mobile drawer with the revised hierarchy and product groups", () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    const drawer = screen.getByRole("dialog");

    for (const label of [
      "Products",
      "Industries",
      "Design & Pricing",
      "Guides & Support",
      "About",
    ]) {
      expect(within(drawer).getByRole("button", { name: label })).toBeInTheDocument();
    }

    fireEvent.click(within(drawer).getByRole("button", { name: "Products" }));
    fireEvent.click(within(drawer).getByRole("button", { name: "Martial Arts Uniforms & Gear" }));

    expect(within(drawer).getByRole("link", { name: "Brazilian Jiu-Jitsu Gis" })).toHaveAttribute(
      "href",
      routes.bjjGis,
    );
    expect(
      within(drawer).getByRole("link", { name: "View All Martial Arts Products" }),
    ).toHaveAttribute("href", routes.martialArts);
    expect(within(drawer).getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(within(drawer).getByRole("link", { name: "Open AI Design Studio" })).toHaveAttribute(
      "href",
      routes.aiDesigner,
    );
    expect(within(drawer).getByRole("link", { name: "Get a Quote" })).toHaveAttribute(
      "href",
      routes.quote,
    );
  });

  it("opens search from the mobile drawer quick action", async () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Search" }));

    expect(
      await screen.findByRole("searchbox", {
        name: searchboxName,
      }),
    ).toBeInTheDocument();
  });

  it("opens search from the header button and keyboard shortcut", async () => {
    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: "Open search" }));

    expect(
      await screen.findByRole("searchbox", {
        name: searchboxName,
      }),
    ).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByRole("searchbox", {
          name: searchboxName,
        }),
      ).not.toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });

    expect(
      await screen.findByRole("searchbox", {
        name: searchboxName,
      }),
    ).toBeInTheDocument();
  });

  it("shows grouped search results, empty state, and no-results state", async () => {
    render(<SiteHeader />);

    fireEvent.keyDown(document, { key: "k", metaKey: true });

    const searchbox = await screen.findByRole("searchbox", {
      name: searchboxName,
    });
    expect(screen.getByText("Popular searches")).toBeInTheDocument();

    fireEvent.change(searchbox, { target: { value: "AI Design Studio" } });

    expect(await screen.findByRole("heading", { name: "Design & Pricing" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /AI Design Studio/i })).toBeInTheDocument();

    fireEvent.change(searchbox, { target: { value: "Martial Arts Schools" } });

    expect(await screen.findByRole("heading", { name: "Industries" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Martial Arts Schools and Academies/i }),
    ).toBeInTheDocument();

    fireEvent.change(searchbox, { target: { value: "zzzz-not-found" } });

    expect(await screen.findByText('No results for "zzzz-not-found"')).toBeInTheDocument();
  });

  it("opens the selected search result with keyboard navigation", async () => {
    render(<SiteHeader />);

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });

    const searchbox = await screen.findByRole("searchbox", {
      name: searchboxName,
    });

    fireEvent.change(searchbox, { target: { value: "Team Jerseys" } });
    expect(await screen.findByRole("button", { name: /Team Jerseys/i })).toBeInTheDocument();

    fireEvent.keyDown(searchbox, { key: "Enter" });

    expect(routerPush).toHaveBeenCalledWith(routes.jerseys);
  });

  it("keeps the static search index aligned with Phase 1B.1 labels", () => {
    expect(searchIndex.some((item) => item.label === "AI Design Studio")).toBe(true);
    expect(searchIndex.some((item) => item.label === ["AI", "Designer"].join(" "))).toBe(false);
    expect(searchIndex.some((item) => /country/i.test(item.label))).toBe(false);
    expect(searchIndex.some((item) => item.label === "Custom Activewear")).toBe(true);
    expect(searchIndex.some((item) => item.label === "Martial Arts Schools and Academies")).toBe(
      true,
    );
  });

  it("marks the active navigation item", () => {
    pathname = routes.apparel;

    render(<SiteHeader />);

    expect(screen.getByRole("button", { name: "Products" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
