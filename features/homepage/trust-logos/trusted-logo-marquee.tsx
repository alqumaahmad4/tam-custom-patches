import { TrustedLogoTrack } from "./trusted-logo-track";

export const trustedLogoHeading =
  "Trusted by clubs, teams, martial arts academies & organizations worldwide";

export function TrustedLogoMarquee() {
  return (
    <section
      aria-labelledby="trusted-logo-marquee-title"
      className="trusted-logo-marquee border-border bg-surface text-foreground border-y"
    >
      <div className="mx-auto max-w-[var(--container-xl)] px-4 py-6 sm:px-6 sm:py-7 lg:px-10">
        <div className="mx-auto mb-4 max-w-3xl text-center sm:mb-5">
          <h2
            id="trusted-logo-marquee-title"
            className="text-muted-foreground text-sm leading-6 font-semibold text-balance sm:text-base"
          >
            {trustedLogoHeading}
          </h2>
        </div>
        <div className="trusted-logo-mask -mx-4 sm:mx-0">
          <TrustedLogoTrack />
        </div>
      </div>
    </section>
  );
}
