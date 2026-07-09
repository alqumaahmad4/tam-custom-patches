import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HomeSection } from "@/features/homepage/components/home-section";
import { PlaceholderVisual } from "@/features/homepage/components/placeholder-visual";
import { featuredCategories } from "@/features/homepage/data";
import { cn } from "@/lib/utils";

export function FeaturedCategories() {
  return (
    <HomeSection
      id="featured-categories"
      eyebrow="Featured Categories"
      title="What can we make for you?"
      description="Start with the product family that fits your project, from patches and apparel to accessories and scout-ready pieces."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredCategories.map((category, index) => (
          <Link
            key={category.title}
            href={category.href}
            aria-label={`${category.title} category`}
            className={cn(
              "group bg-card text-card-foreground focus-visible:ring-ring overflow-hidden rounded-lg border shadow-sm outline-none [transition:var(--transition-interactive)] hover:-translate-y-1 hover:shadow-md focus-visible:ring-2 motion-reduce:[transition:none] motion-reduce:hover:translate-y-0",
              index >= 4 ? "lg:col-span-2" : undefined,
            )}
          >
            <PlaceholderVisual
              label={category.label}
              tone={category.tone}
              className="rounded-none border-0 transition-transform duration-200 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold">{category.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">{category.description}</p>
              <span className="text-primary mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                Learn more
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </HomeSection>
  );
}
