import Image from "next/image";

import { footerTrustIcons } from "@/components/footer/trust-icons-data";
import { cn } from "@/lib/utils";

import styles from "./footer-trust-icons.module.css";

export const footerTrustIconsLabel = "Payment, security, and shipping services";
export const footerTrustIconSlotClassName =
  "flex h-32 w-[5.5rem] shrink-0 items-center justify-center";
export const footerTrustIconImageClassName = "h-[7.75rem] w-[5.5rem] object-contain";
export const footerTrustIconAmericanExpressImageClassName = "h-[5.25rem] w-16 object-contain";
export const footerTrustMarqueeDuration = "32s";

function getIconImageClassName(iconId: string) {
  return cn(
    iconId === "american-express"
      ? footerTrustIconAmericanExpressImageClassName
      : footerTrustIconImageClassName,
  );
}

export function FooterTrustIcons() {
  return (
    <section aria-label={footerTrustIconsLabel} className="border-muted/30 mt-12 border-t pt-8">
      <div className={styles.viewport}>
        <div className={styles.track}>
          <ul className={styles.logoList}>
            {footerTrustIcons.map((icon) => (
              <li key={icon.id} className={footerTrustIconSlotClassName}>
                <Image
                  alt={icon.accessibleLabel}
                  className={getIconImageClassName(icon.id)}
                  height={icon.intrinsicHeight}
                  loading="lazy"
                  src={icon.assetPath}
                  unoptimized
                  width={icon.intrinsicWidth}
                />
              </li>
            ))}
          </ul>
          <ul aria-hidden="true" className={cn(styles.logoList, styles.duplicateTrack)}>
            {footerTrustIcons.map((icon) => (
              <li key={`${icon.id}-duplicate`} className={footerTrustIconSlotClassName}>
                <Image
                  alt=""
                  aria-hidden="true"
                  className={getIconImageClassName(icon.id)}
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
      </div>
    </section>
  );
}
