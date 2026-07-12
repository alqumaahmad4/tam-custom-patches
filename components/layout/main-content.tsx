"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { routes } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type MainContentProps = {
  children: ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const isHome = pathname === routes.home;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={cn("min-h-svh outline-none", isHome ? "pt-0" : "pt-16 lg:pt-20")}
    >
      {children}
    </main>
  );
}
