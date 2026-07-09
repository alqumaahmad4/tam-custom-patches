import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HomeSection } from "@/features/homepage/components/home-section";
import { PlaceholderVisual } from "@/features/homepage/components/placeholder-visual";
import { blogPreviewArticles } from "@/features/homepage/data";

export function BlogPreview() {
  return (
    <HomeSection
      id="blog-preview"
      eyebrow="Blog Preview"
      title="Helpful guides for planning your order."
      description="Three article previews give customers a path into practical buying and production guidance."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {blogPreviewArticles.map((article) => (
          <article
            key={article.title}
            className="bg-card overflow-hidden rounded-lg border shadow-sm [transition:var(--transition-interactive)] hover:-translate-y-1 hover:shadow-md motion-reduce:[transition:none] motion-reduce:hover:translate-y-0"
          >
            <PlaceholderVisual
              label={article.category}
              tone={article.tone}
              className="rounded-none border-0"
            />
            <div className="p-6">
              <p className="text-primary text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
                {article.category}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{article.title}</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-6">{article.excerpt}</p>
              <Link
                href={article.href}
                className="text-primary mt-5 inline-flex items-center gap-2 rounded-sm text-sm font-semibold underline-offset-4 hover:underline"
              >
                Read preview
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </HomeSection>
  );
}
