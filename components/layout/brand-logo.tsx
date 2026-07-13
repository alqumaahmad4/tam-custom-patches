import Image from "next/image";
import Link from "next/link";

import { routes, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const logoIntrinsicDimensions = {
  width: 3088,
  height: 330,
} as const;

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function BrandLogo({
  className,
  imageClassName,
  priority = false,
  sizes = "(max-width: 639px) 300px, (max-width: 1279px) 220px, 240px",
}: BrandLogoProps) {
  return (
    <Link
      href={routes.home}
      aria-label={`${siteConfig.name} home`}
      className={cn("inline-flex items-center rounded-sm focus-visible:outline-none", className)}
    >
      <Image
        src="/logos/logo.png"
        alt={siteConfig.name}
        width={logoIntrinsicDimensions.width}
        height={logoIntrinsicDimensions.height}
        priority={priority}
        sizes={sizes}
        className={cn("h-8 w-auto object-contain sm:h-9 lg:h-10", imageClassName)}
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
