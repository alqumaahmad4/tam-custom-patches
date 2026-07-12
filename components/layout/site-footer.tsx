import Link from "next/link";

import { FooterWordmark } from "@/components/layout/brand-logo";
import { footerNavigation, legalNavigationLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="text-surface bg-[var(--color-ink)]" aria-labelledby="site-footer-title">
      <div className="mx-auto max-w-[var(--container-xl)] px-6 py-16 lg:px-10">
        <h2 id="site-footer-title" className="sr-only">
          Site footer
        </h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[240px_repeat(4,minmax(0,1fr))]">
          <div>
            <FooterWordmark />
            <p className="text-muted-light mt-5 max-w-56 text-sm leading-6">
              Premium patches, apparel, and martial arts gear manufactured for teams and brands.
            </p>
          </div>

          {footerNavigation.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="text-muted-light text-xs font-semibold tracking-[0.06em] uppercase">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-surface hover:text-muted-light text-sm transition-colors duration-150 focus-visible:outline-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-muted/30 text-muted-light mt-12 flex flex-col gap-4 border-t pt-6 text-xs md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <nav aria-label="Legal links">
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {legalNavigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-surface transition-colors duration-150 focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
