import Link from "next/link";

import { routes, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
  className?: string;
};

function toAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

function breadcrumbSchema(items: readonly BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: toAbsoluteUrl(item.href ?? routes.home),
    })),
  };
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length <= 1) {
    return null;
  }

  const parent = items.at(-2);
  const current = items.at(-1);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(items)) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={cn("mx-auto max-w-[var(--container-xl)] px-6 py-4 lg:px-10", className)}
      >
        {parent && current ? (
          <Link
            href={parent.href ?? routes.home}
            className="text-muted-foreground hover:text-primary inline-flex text-sm font-medium min-[481px]:hidden"
          >
            ← {parent.label}
          </Link>
        ) : null}
        <ol className="hidden items-center gap-2 text-sm min-[481px]:flex">
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1;

            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {index > 0 ? <span className="text-muted-foreground">/</span> : null}
                {isCurrent || !item.href ? (
                  <span aria-current="page" className="text-foreground font-semibold">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-150 focus-visible:outline-none"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
