import { HomeSection } from "@/features/homepage/components/home-section";
import { industriesServed } from "@/features/homepage/data";

export function IndustriesServed() {
  return (
    <HomeSection
      id="industries-served"
      eyebrow="Industries We Serve"
      title="Prepared for clubs, teams, agencies, schools, and events."
      description="A broad manufacturing range helps different groups plan patches, apparel, uniforms, and accessories with confidence."
      variant="dark"
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {industriesServed.map((industry) => (
          <li
            key={industry}
            className="border-border bg-secondary rounded-full border px-5 py-3 text-center text-sm font-semibold"
          >
            {industry}
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
