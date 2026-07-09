import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/site-config";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-[var(--container-md)] flex-col items-center justify-center px-6 py-16 text-center">
      <div
        aria-hidden="true"
        className="text-surface shadow-premium mb-8 grid h-32 w-32 place-items-center rounded-full border-4 border-[var(--color-gold)] bg-[var(--color-dark-bg)] text-4xl font-extrabold"
      >
        404
      </div>
      <p className="text-primary mb-3 text-sm font-semibold tracking-[0.06em] uppercase">
        Page not found
      </p>
      <h1 className="text-foreground text-4xl font-bold tracking-tight">
        This page got lost in production.
      </h1>
      <p className="text-muted-foreground mt-4 max-w-xl text-base leading-7">
        The URL may have changed or the page may have moved. Let&apos;s get you back on track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href={routes.home}>
            <ArrowLeft aria-hidden="true" />
            Back to Homepage
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={routes.customPatches}>Browse Products</Link>
        </Button>
        <Button asChild variant="link">
          <Link href={routes.contact}>
            <Mail aria-hidden="true" />
            Contact Us
          </Link>
        </Button>
      </div>
    </section>
  );
}
