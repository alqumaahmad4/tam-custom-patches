import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getLinkPrefetch, routes } from "@/lib/site-config";

export function FinalCta() {
  return (
    <section
      aria-labelledby="final-cta-title"
      className="dark bg-background text-foreground py-12 md:py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[var(--container-xl)] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-primary mb-3 text-xs font-semibold tracking-[var(--letter-spacing-uppercase)] uppercase">
            Start Your Project
          </p>
          <h2 id="final-cta-title" className="text-3xl font-bold text-balance md:text-4xl">
            Ready to shape your custom manufacturing request?
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-7">
            Share the product type, quantity, artwork direction, and goals so the next step starts
            with the right context.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="premiumPrimary">
              <Link href={routes.quote}>
                Get a Quote
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="premiumOutline">
              <Link href={routes.contact} prefetch={getLinkPrefetch(routes.contact)}>
                <MessageCircle aria-hidden="true" className="size-4" />
                Talk to support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
