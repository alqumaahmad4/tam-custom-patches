"use client";

import Link from "next/link";
import { RotateCcw, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/site-config";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-[var(--container-md)] flex-col items-center justify-center px-6 py-16 text-center">
      <div
        aria-hidden="true"
        className="border-border text-muted-foreground bg-card mb-8 grid h-24 w-24 place-items-center rounded-full border"
      >
        <Wrench className="h-10 w-10" strokeWidth={1.5} />
      </div>
      <p className="text-destructive mb-3 text-sm font-semibold tracking-[0.06em] uppercase">
        Error
      </p>
      <h1 className="text-foreground text-4xl font-bold tracking-tight">
        Something went wrong on our end.
      </h1>
      <p className="text-muted-foreground mt-4 max-w-xl text-base leading-7">
        We&apos;ve been notified and are working to fix this. Please try again in a moment, or
        contact us if the problem persists.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={reset}>
          <RotateCcw aria-hidden="true" />
          Try Again
        </Button>
        <Button asChild variant="outline">
          <Link href={routes.contact}>Contact Us</Link>
        </Button>
      </div>
    </section>
  );
}
