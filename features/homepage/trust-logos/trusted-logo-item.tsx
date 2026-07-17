import Link from "next/link";
import type { SVGProps } from "react";

import type { TrustedLogoItem as TrustedLogoItemType, TrustedLogoMotif } from "./data";

import { getLinkPrefetch } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type TrustedLogoItemProps = {
  logo: TrustedLogoItemType;
  isDuplicate?: boolean;
};

const logoItemClasses =
  "flex h-12 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-70 outline-none grayscale [transition:var(--transition-colors)] hover:text-foreground hover:opacity-100 hover:grayscale-0 focus-visible:text-foreground focus-visible:opacity-100 focus-visible:grayscale-0 motion-reduce:transition-none";

function Motif({ motif, width }: { motif: TrustedLogoMotif; width: number }) {
  const centerX = width / 2;

  const motifProps: SVGProps<SVGGElement> = {
    "aria-hidden": true,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
  };

  switch (motif) {
    case "road":
      return (
        <g {...motifProps}>
          <path
            d={`M${centerX - 44} 33 C${centerX - 24} 17 ${centerX + 24} 17 ${centerX + 44} 33`}
          />
          <path d={`M${centerX - 28} 35 H${centerX + 28}`} />
          <path d={`M${centerX} 20 V34`} />
        </g>
      );
    case "star":
      return (
        <g {...motifProps}>
          <path
            d={`M${centerX} 14 L${centerX + 4} 22 L${centerX + 13} 23 L${centerX + 6} 29 L${centerX + 8} 38 L${centerX} 33 L${centerX - 8} 38 L${centerX - 6} 29 L${centerX - 13} 23 L${centerX - 4} 22 Z`}
          />
          <path d={`M${centerX - 34} 24 H${centerX - 18}`} />
          <path d={`M${centerX + 18} 24 H${centerX + 34}`} />
        </g>
      );
    case "dojo":
      return (
        <g {...motifProps}>
          <path d={`M${centerX - 34} 33 H${centerX + 34}`} />
          <path d={`M${centerX - 28} 33 V23 L${centerX} 13 L${centerX + 28} 23 V33`} />
          <path d={`M${centerX - 12} 33 V25 H${centerX + 12} V33`} />
        </g>
      );
    case "crest":
      return (
        <g {...motifProps}>
          <path
            d={`M${centerX - 24} 15 H${centerX + 24} V27 C${centerX + 24} 36 ${centerX + 9} 40 ${centerX} 42 C${centerX - 9} 40 ${centerX - 24} 36 ${centerX - 24} 27 Z`}
          />
          <path d={`M${centerX} 17 V39`} />
          <path d={`M${centerX - 15} 25 H${centerX + 15}`} />
        </g>
      );
    case "scout":
      return (
        <g {...motifProps}>
          <path
            d={`M${centerX} 12 C${centerX + 11} 22 ${centerX + 11} 33 ${centerX} 41 C${centerX - 11} 33 ${centerX - 11} 22 ${centerX} 12 Z`}
          />
          <path d={`M${centerX - 17} 30 C${centerX - 7} 26 ${centerX + 7} 26 ${centerX + 17} 30`} />
          <path d={`M${centerX} 18 V38`} />
        </g>
      );
    case "shield":
      return (
        <g {...motifProps}>
          <path
            d={`M${centerX} 12 L${centerX + 25} 20 V29 C${centerX + 25} 36 ${centerX + 12} 40 ${centerX} 43 C${centerX - 12} 40 ${centerX - 25} 36 ${centerX - 25} 29 V20 Z`}
          />
          <path d={`M${centerX - 11} 27 H${centerX + 11}`} />
          <path d={`M${centerX} 20 V35`} />
        </g>
      );
    case "flame":
      return (
        <g {...motifProps}>
          <path
            d={`M${centerX} 41 C${centerX - 13} 36 ${centerX - 11} 25 ${centerX - 3} 18 C${centerX - 4} 25 ${centerX + 7} 25 ${centerX + 4} 12 C${centerX + 17} 23 ${centerX + 15} 36 ${centerX} 41 Z`}
          />
          <path
            d={`M${centerX} 34 C${centerX - 4} 31 ${centerX - 2} 26 ${centerX + 2} 23 C${centerX + 6} 28 ${centerX + 5} 32 ${centerX} 34 Z`}
          />
        </g>
      );
    case "service":
      return (
        <g {...motifProps}>
          <path d={`M${centerX - 28} 34 H${centerX + 28}`} />
          <path d={`M${centerX} 13 L${centerX + 20} 34 H${centerX - 20} Z`} />
          <path d={`M${centerX} 20 V34`} />
        </g>
      );
    case "commerce":
      return (
        <g {...motifProps}>
          <path d={`M${centerX - 30} 36 V20 H${centerX - 8} V36`} />
          <path d={`M${centerX - 2} 36 V14 H${centerX + 30} V36`} />
          <path d={`M${centerX + 7} 22 H${centerX + 21}`} />
          <path d={`M${centerX + 7} 29 H${centerX + 21}`} />
        </g>
      );
    case "horizon":
      return (
        <g {...motifProps}>
          <path d={`M${centerX - 39} 32 H${centerX + 39}`} />
          <path
            d={`M${centerX - 24} 32 C${centerX - 14} 15 ${centerX + 14} 15 ${centerX + 24} 32`}
          />
          <path
            d={`M${centerX - 34} 24 C${centerX - 16} 18 ${centerX + 16} 18 ${centerX + 34} 24`}
          />
        </g>
      );
    case "club":
      return (
        <g {...motifProps}>
          <path
            d={`M${centerX - 20} 17 H${centerX + 20} L${centerX + 29} 30 L${centerX} 41 L${centerX - 29} 30 Z`}
          />
          <path d={`M${centerX - 12} 28 H${centerX + 12}`} />
        </g>
      );
    case "event":
      return (
        <g {...motifProps}>
          <path d={`M${centerX - 30} 18 H${centerX + 30} V38 H${centerX - 30} Z`} />
          <path d={`M${centerX - 18} 12 V22`} />
          <path d={`M${centerX + 18} 12 V22`} />
          <path d={`M${centerX - 18} 29 H${centerX + 18}`} />
        </g>
      );
  }
}

function GeneratedLogoMark({ logo }: { logo: TrustedLogoItemType }) {
  const { generatedMark } = logo;
  const centerX = generatedMark.width / 2;

  return (
    <svg
      aria-hidden="true"
      className="h-8 w-auto sm:h-9"
      focusable="false"
      height={generatedMark.height}
      viewBox={`0 0 ${generatedMark.width} ${generatedMark.height}`}
      width={generatedMark.width}
    >
      <Motif motif={generatedMark.motif} width={generatedMark.width} />
      <text
        aria-hidden="true"
        dominantBaseline="middle"
        fill="currentColor"
        fontSize="11"
        fontWeight="700"
        textAnchor="middle"
        x={centerX}
        y="25"
      >
        {generatedMark.initials}
      </text>
    </svg>
  );
}

export function TrustedLogoItem({ logo, isDuplicate = false }: TrustedLogoItemProps) {
  if (logo.href) {
    return (
      <Link
        aria-label={logo.accessibleLabel}
        className={cn(logoItemClasses, "focus-visible:ring-ring focus-visible:ring-2")}
        href={logo.href}
        prefetch={getLinkPrefetch(logo.href)}
        tabIndex={isDuplicate ? -1 : undefined}
      >
        <GeneratedLogoMark logo={logo} />
      </Link>
    );
  }

  return (
    <span
      aria-label={logo.accessibleLabel}
      className={logoItemClasses}
      role="img"
      tabIndex={isDuplicate ? -1 : undefined}
    >
      <GeneratedLogoMark logo={logo} />
    </span>
  );
}
