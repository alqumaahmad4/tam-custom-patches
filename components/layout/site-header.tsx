"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/layout/brand-logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { primaryNavigation, routes, tabletNavigation } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const quoteDescriptionId = "header-quote-description";

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === routes.home;
  const isSolid = !isHome || isScrolled || mobileOpen;

  useEffect(() => {
    const updateScrolled = () => setIsScrolled(window.scrollY > 80);

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <header
      role="banner"
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
          <BrandLogo priority imageClassName="h-7 max-w-[180px] sm:h-8 sm:max-w-[220px] lg:h-10" />
        </div>

        <nav aria-label="Main navigation" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-8">
            {primaryNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "hover:text-primary rounded-sm text-[15px] font-medium transition-colors duration-150 focus-visible:outline-none",
                      isActive
                        ? "text-foreground underline underline-offset-8"
                        : "text-foreground/85",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav
          aria-label="Tablet navigation"
          className="hidden flex-1 justify-center gap-5 md:flex lg:hidden"
        >
          {tabletNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/85 hover:text-primary rounded-sm text-[15px] font-medium transition-colors duration-150 focus-visible:outline-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 lg:flex-[0_0_auto]">
          <span id={quoteDescriptionId} className="sr-only">
            Get a free custom patch quote.
          </span>
          <Button asChild className="h-9 rounded-full px-4" aria-describedby={quoteDescriptionId}>
            <Link href={routes.quote}>
              <span className="sm:hidden">Quote</span>
              <span className="hidden sm:inline">Get Free Quote</span>
            </Link>
          </Button>
          <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
        </div>
      </div>
    </header>
  );
}
