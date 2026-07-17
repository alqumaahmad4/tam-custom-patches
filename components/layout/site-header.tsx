"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Search, ShieldCheck } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { DesktopMegaMenu } from "@/components/navigation/desktop-mega-menu";
import { SearchOverlay } from "@/components/navigation/search-overlay";
import { Button } from "@/components/ui/button";
import { navigationGroups, tabletNavigation } from "@/lib/navigation";
import { getLinkPrefetch, routes } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const quoteDescriptionId = "header-quote-description";

type HeaderVariant = "marketing" | "quote";

function getIsActive(pathname: string, href: string, activeHrefs: readonly string[] = []) {
  return [href, ...activeHrefs].some((activeHref) =>
    activeHref === "/"
      ? pathname === activeHref
      : pathname === activeHref || pathname.startsWith(`${activeHref}/`),
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isHome = pathname === routes.home;
  const isQuoteRoute = pathname.startsWith(routes.quote);
  const variant: HeaderVariant = isQuoteRoute ? "quote" : "marketing";
  const isSolid = !isHome || isScrolled || mobileOpen || searchOpen || variant === "quote";

  useEffect(() => {
    const updateScrolled = () => setIsScrolled(window.scrollY > 80);

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  if (variant === "quote") {
    return (
      <header
        role="banner"
        data-variant="quote"
        data-scrolled="true"
        className="border-border bg-background/95 fixed inset-x-0 top-0 z-[var(--z-sticky)] border-b shadow-sm backdrop-blur-[var(--blur-backdrop)]"
      >
        <div className="mx-auto flex h-16 max-w-[var(--container-xl)] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <BrandLogo
            priority
            sizes="(max-width: 639px) 150px, 220px"
            imageClassName="h-auto w-[150px] object-contain sm:h-auto sm:w-[220px] lg:h-auto"
          />
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground hidden items-center gap-2 text-sm font-medium sm:inline-flex">
              <ShieldCheck aria-hidden="true" className="text-primary size-4" />
              Secure quote
            </span>
            <Button asChild variant="premiumGhost">
              <Link href={routes.home}>
                <ArrowLeft aria-hidden="true" className="size-4" />
                <span className="hidden sm:inline">Back to site</span>
                <span className="sm:hidden">Exit</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      role="banner"
      data-variant="marketing"
      data-scrolled={isSolid ? "true" : "false"}
      className={cn(
        "fixed inset-x-0 top-0 z-[var(--z-sticky)] transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out",
        isSolid
          ? "border-border bg-background/95 shadow-sm backdrop-blur-[var(--blur-backdrop)]"
          : "border-transparent bg-transparent",
        "border-b",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[var(--container-xl)] items-center gap-4 px-4 sm:px-6 lg:h-20 lg:px-10">
        <div className="flex min-w-0 flex-1 items-center lg:flex-[0_0_240px]">
          <BrandLogo
            priority
            sizes="(max-width: 639px) 150px, 220px"
            imageClassName="h-auto w-[150px] object-contain sm:h-auto sm:w-[220px] lg:h-auto"
          />
        </div>

        <DesktopMegaMenu pathname={pathname} isSolid={isSolid} />

        <nav
          aria-label="Tablet navigation"
          className="hidden flex-1 justify-center gap-5 md:flex xl:hidden"
        >
          {tabletNavigation.map((item) => {
            const matchingGroup = navigationGroups.find((group) => group.label === item.label);
            const isActive = getIsActive(pathname, item.href, matchingGroup?.activeHrefs);

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={getLinkPrefetch(item.href)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "hover:text-primary rounded-sm text-[15px] font-medium transition-colors duration-150 focus-visible:outline-none",
                  isActive ? "font-semibold underline underline-offset-8" : "text-foreground/85",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 lg:flex-[0_0_auto]">
          <button
            type="button"
            aria-label="Open search"
            className={cn(
              "hidden size-10 place-items-center rounded-full transition-colors duration-150 focus-visible:outline-none md:grid",
              isSolid
                ? "text-foreground/80 hover:bg-secondary hover:text-primary"
                : "text-surface/90 hover:bg-surface/10 hover:text-surface",
            )}
            onClick={() => setSearchOpen(true)}
          >
            <Search aria-hidden="true" className="size-5" />
          </button>
          <Button
            asChild
            variant="premiumOutline"
            className={cn("hidden xl:inline-flex", isSolid ? null : "premium-button-on-dark")}
          >
            <Link
              href={routes.aiDesigner}
              prefetch={getLinkPrefetch(routes.aiDesigner)}
              aria-label="Open AI Design Studio"
            >
              AI Design Studio
            </Link>
          </Button>
          <span id={quoteDescriptionId} className="sr-only">
            Request custom manufacturing pricing.
          </span>
          <Button asChild variant="premiumPrimary" aria-describedby={quoteDescriptionId}>
            <Link href={routes.quote}>
              Get a Quote
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
          <MobileNav
            open={mobileOpen}
            onOpenChange={setMobileOpen}
            onSearch={() => setSearchOpen(true)}
          />
        </div>
      </div>
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
