"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { BrandLogo } from "@/components/layout/brand-logo";
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
import { primaryNavigation, routes } from "@/lib/site-config";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const quoteDescriptionId = "mobile-quote-description";

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
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
        className="flex h-dvh w-full max-w-none flex-col p-0 sm:max-w-[360px]"
      >
        <SheetHeader className="border-border border-b px-5 pt-5 pb-4 text-left">
          <BrandLogo imageClassName="h-8" />
          <SheetTitle className="sr-only">Site menu</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation links for Tam Custom Patches.
          </SheetDescription>
        </SheetHeader>

        <nav aria-label="Mobile navigation" className="flex-1 px-5 py-8">
          <ul className="space-y-1">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <SheetClose asChild>
                  <Link
                    href={item.href}
                    className="hover:bg-secondary focus-visible:ring-ring flex min-h-[52px] items-center rounded-lg px-3 text-base font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>

        <SheetFooter className="border-border gap-3 border-t px-5 pt-4 pb-5 sm:flex-col sm:space-x-0">
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
