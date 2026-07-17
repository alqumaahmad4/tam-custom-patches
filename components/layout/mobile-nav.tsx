"use client";

import Link from "next/link";
import { ArrowRight, Menu, Search, Sparkles } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationGroups, productNavigationGroups } from "@/lib/navigation";
import { getLinkPrefetch, routes } from "@/lib/site-config";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: () => void;
};

const quoteDescriptionId = "mobile-quote-description";

export function MobileNav({ open, onOpenChange, onSearch }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          className="min-h-11 min-w-11 xl:hidden"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        id="mobile-navigation"
        side="right"
        className="flex h-dvh w-full max-w-none flex-col overflow-hidden p-0 sm:max-w-[400px]"
      >
        <SheetHeader className="border-border border-b px-5 pt-5 pb-4 text-left">
          <BrandLogo sizes="300px" imageClassName="h-8 w-auto object-contain sm:h-8 lg:h-8" />
          <SheetTitle className="sr-only">Site menu</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation links for Tam Custom Patches.
          </SheetDescription>
        </SheetHeader>

        <nav aria-label="Mobile navigation" className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <Accordion type="multiple" className="space-y-1">
            {navigationGroups.map((group) => (
              <AccordionItem key={group.id} value={group.id} className="border-border">
                <AccordionTrigger className="hover:bg-secondary min-h-[52px] rounded-md px-3 text-base font-semibold hover:no-underline">
                  {group.label}
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  {group.id === "products" ? (
                    <ProductsMobileAccordion />
                  ) : (
                    <ul className="space-y-1 px-2">
                      {group.href ? (
                        <li>
                          <SheetClose asChild>
                            <Link
                              href={group.href}
                              prefetch={getLinkPrefetch(group.href)}
                              className="text-primary flex min-h-11 items-center rounded-md px-3 text-sm font-semibold focus-visible:outline-none"
                            >
                              {group.label} overview
                            </Link>
                          </SheetClose>
                        </li>
                      ) : null}
                      {group.links.map((link) => {
                        const Icon = link.icon;

                        return (
                          <li key={`${group.id}-${link.href}-${link.label}`}>
                            <SheetClose asChild>
                              <Link
                                href={link.href}
                                prefetch={getLinkPrefetch(link.href)}
                                className="hover:bg-secondary flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none"
                              >
                                {Icon ? (
                                  <Icon aria-hidden="true" className="text-primary size-4" />
                                ) : null}
                                {link.label}
                              </Link>
                            </SheetClose>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="border-border mt-5 border-t pt-5">
            <p className="text-muted-foreground px-3 text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
              Actions
            </p>
            <ul className="mt-2 space-y-1">
              <li>
                <button
                  type="button"
                  className="hover:bg-secondary focus-visible:ring-ring flex min-h-[52px] w-full items-center rounded-md px-3 text-left text-base font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  onClick={() => {
                    onOpenChange(false);
                    window.setTimeout(onSearch, 0);
                  }}
                >
                  <Search aria-hidden="true" className="text-primary mr-3 size-4" />
                  Search
                </button>
              </li>
              <li>
                <SheetClose asChild>
                  <Button asChild variant="premiumOutline" className="w-full justify-start">
                    <Link
                      href={routes.aiDesigner}
                      prefetch={getLinkPrefetch(routes.aiDesigner)}
                      aria-label="Open AI Design Studio"
                    >
                      <Sparkles aria-hidden="true" className="size-4" />
                      AI Design Studio
                    </Link>
                  </Button>
                </SheetClose>
              </li>
            </ul>
          </div>
        </nav>

        <SheetFooter className="border-border gap-3 border-t px-5 pt-4 pb-[max(var(--space-5),env(safe-area-inset-bottom))] sm:flex-col sm:space-x-0">
          <p id={quoteDescriptionId} className="sr-only">
            Request custom manufacturing pricing.
          </p>
          <SheetClose asChild>
            <Button
              asChild
              variant="premiumPrimary"
              className="w-full"
              aria-describedby={quoteDescriptionId}
            >
              <Link href={routes.quote}>
                Get a Quote
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </SheetClose>
          <p className="text-muted-foreground text-center text-xs">Worldwide shipping available</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ProductsMobileAccordion() {
  return (
    <div className="px-2">
      <Accordion type="multiple" className="space-y-1">
        {productNavigationGroups.map((productGroup) => (
          <AccordionItem
            key={productGroup.id}
            value={productGroup.id}
            className="border-border rounded-md border"
          >
            <AccordionTrigger className="hover:bg-secondary min-h-11 rounded-md px-3 text-left text-sm font-semibold hover:no-underline">
              {productGroup.label}
            </AccordionTrigger>
            <AccordionContent className="px-2 pb-3">
              <ul className="space-y-1">
                {productGroup.links.map((link) => (
                  <li key={`${productGroup.id}-${link.href}-${link.label}`}>
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        prefetch={getLinkPrefetch(link.href)}
                        className="hover:bg-secondary flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  </li>
                ))}
                <li className="border-border mt-2 border-t pt-2">
                  <SheetClose asChild>
                    <Link
                      href={productGroup.href}
                      prefetch={getLinkPrefetch(productGroup.href)}
                      className="text-primary hover:bg-secondary flex min-h-11 items-center rounded-md px-3 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none"
                    >
                      {productGroup.viewAllLabel}
                    </Link>
                  </SheetClose>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
