"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Globe2, Menu, Repeat2, Sparkles } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { countryOptions, navigationGroups } from "@/lib/navigation";
import { routes } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const quoteDescriptionId = "mobile-quote-description";

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const [countryCode, setCountryCode] = useState<(typeof countryOptions)[number]["code"]>("US");

  function selectCountry(code: typeof countryCode) {
    setCountryCode(code);
    document.cookie = `tam-country=${code}; path=/; max-age=31536000`;
  }

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
          className="min-h-11 min-w-11 lg:hidden"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        id="mobile-navigation"
        side="right"
        className="flex h-dvh w-full max-w-none flex-col overflow-hidden p-0 sm:max-w-[360px]"
      >
        <SheetHeader className="border-border border-b px-5 pt-5 pb-4 text-left">
          <BrandLogo imageClassName="h-8" />
          <SheetTitle className="sr-only">Site menu</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation links for Tam Custom Patches.
          </SheetDescription>
        </SheetHeader>

        <nav aria-label="Mobile navigation" className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <Accordion type="multiple" className="space-y-1">
            {navigationGroups.map((group) => (
              <AccordionItem key={group.id} value={group.id} className="border-border">
                <AccordionTrigger className="hover:bg-secondary min-h-[52px] rounded-lg px-3 text-base font-semibold hover:no-underline">
                  {group.label}
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <ul className="space-y-1 px-2">
                    <li>
                      <SheetClose asChild>
                        <Link
                          href={group.href}
                          className="text-primary flex min-h-11 items-center rounded-md px-3 text-sm font-semibold focus-visible:outline-none"
                        >
                          {group.label} overview
                        </Link>
                      </SheetClose>
                    </li>
                    {group.productLinks.map((link) => {
                      const Icon = link.icon;

                      return (
                        <li key={link.href}>
                          <SheetClose asChild>
                            <Link
                              href={link.href}
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="border-border mt-5 border-t pt-5">
            <p className="text-muted-foreground px-3 text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
              Quick actions
            </p>
            <ul className="mt-2 space-y-1">
              <li>
                <SheetClose asChild>
                  <Link
                    href={routes.aiDesigner}
                    className="hover:bg-secondary focus-visible:ring-ring flex min-h-[52px] items-center rounded-lg px-3 text-base font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <Sparkles aria-hidden="true" className="text-primary mr-3 size-4" />
                    AI Designer
                  </Link>
                </SheetClose>
              </li>
              <li>
                <SheetClose asChild>
                  <Link
                    href={routes.reorder}
                    className="hover:bg-secondary focus-visible:ring-ring flex min-h-[52px] items-center rounded-lg px-3 text-base font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <Repeat2 aria-hidden="true" className="text-primary mr-3 size-4" />
                    Reorder
                  </Link>
                </SheetClose>
              </li>
            </ul>

            <div className="mt-4 rounded-lg border p-3">
              <div className="mb-2 flex min-h-11 items-center gap-3 px-1 text-sm font-semibold">
                <Globe2 aria-hidden="true" className="text-primary size-4" />
                Country selector
              </div>
              <div className="grid gap-1">
                {countryOptions.slice(0, 5).map((country) => {
                  const selected = country.code === countryCode;

                  return (
                    <button
                      key={country.code}
                      type="button"
                      className={cn(
                        "flex min-h-11 items-center justify-between rounded-md px-3 text-left text-sm transition-colors duration-150 focus-visible:outline-none",
                        selected ? "bg-tag-bg text-primary" : "hover:bg-secondary",
                      )}
                      onClick={() => selectCountry(country.code)}
                    >
                      <span>{country.label}</span>
                      {selected ? <Check aria-hidden="true" className="size-4" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        <SheetFooter className="border-border gap-3 border-t px-5 pt-4 pb-[max(var(--space-5),env(safe-area-inset-bottom))] sm:flex-col sm:space-x-0">
          <p id={quoteDescriptionId} className="sr-only">
            Get a free custom patch quote.
          </p>
          <SheetClose asChild>
            <Button
              asChild
              className="h-12 w-full rounded-full"
              aria-describedby={quoteDescriptionId}
            >
              <Link href={routes.quote}>Get Free Quote</Link>
            </Button>
          </SheetClose>
          <p className="text-muted-foreground text-center text-xs">Worldwide shipping available</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
