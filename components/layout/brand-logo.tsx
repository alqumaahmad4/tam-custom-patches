import Image from "next/image";
import Link from "next/link";

import { routes, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function BrandLogo({ className, imageClassName, priority = false }: BrandLogoProps) {
  return (
    <Link
      href={routes.home}
      aria-label={`${siteConfig.name} home`}
      className={cn("inline-flex items-center rounded-sm focus-visible:outline-none", className)}
    >
      <Image
        src="/logos/logo.png"
        alt={siteConfig.name}
        width={374}
        height={40}
        priority={priority}
        className={cn("h-8 w-auto sm:h-9 lg:h-10", imageClassName)}
      />
    </Link>
  );
}

export function FooterWordmark({ className }: { className?: string }) {
  return (
    <Link
      href={routes.home}
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "text-surface inline-flex flex-col rounded-sm focus-visible:outline-none",
        className,
      )}
    >
      <span className="text-xl font-extrabold tracking-[0.06em]">TAM</span>
      <span className="text-xs font-medium tracking-[0.06em] uppercase">Custom Patches</span>
    </Link>
  );
}
