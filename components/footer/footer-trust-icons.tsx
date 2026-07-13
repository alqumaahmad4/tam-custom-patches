import Image from "next/image";

import { footerTrustIcons } from "@/components/footer/trust-icons-data";

export const footerTrustIconsLabel = "Payment, security, and shipping services";

export function FooterTrustIcons() {
  return (
    <section aria-label={footerTrustIconsLabel} className="border-muted/30 mt-12 border-t pt-6">
      <div className="-mx-6 [scrollbar-width:none] overflow-x-auto [padding-right:max(var(--space-6),env(safe-area-inset-right))] [padding-left:max(var(--space-6),env(safe-area-inset-left))] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <ul className="mx-auto flex w-max min-w-full items-center justify-start gap-6 sm:justify-center xl:gap-10">
          {footerTrustIcons.map((icon) => (
            <li key={icon.id} className="flex shrink-0 items-center">
              <Image
                alt={icon.accessibleLabel}
                className="h-6 w-auto opacity-[var(--opacity-muted-dark)] brightness-0 invert"
                height={icon.intrinsicHeight}
                loading="lazy"
                src={icon.assetPath}
                unoptimized
                width={icon.intrinsicWidth}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
