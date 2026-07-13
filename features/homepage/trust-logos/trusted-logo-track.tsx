import { TrustedLogoItem } from "./trusted-logo-item";
import { trustedLogoItems } from "./data";

export function TrustedLogoTrack() {
  return (
    <div className="trusted-logo-scroll overflow-hidden">
      <div className="trusted-logo-track flex w-max items-center">
        <div className="flex shrink-0 items-center gap-10 pr-10 sm:gap-12 sm:pr-12 lg:gap-16 lg:pr-16">
          {trustedLogoItems.map((logo) => (
            <TrustedLogoItem key={logo.id} logo={logo} />
          ))}
        </div>
        <div
          aria-hidden="true"
          className="trusted-logo-duplicate flex shrink-0 items-center gap-10 pr-10 sm:gap-12 sm:pr-12 lg:gap-16 lg:pr-16"
          data-track="duplicate"
        >
          {trustedLogoItems.map((logo) => (
            <TrustedLogoItem key={`duplicate-${logo.id}`} isDuplicate logo={logo} />
          ))}
        </div>
      </div>
    </div>
  );
}
