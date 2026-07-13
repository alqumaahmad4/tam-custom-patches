import { routes } from "@/lib/site-config";

export const trustedLogoSegments = [
  "Motorcycle Clubs",
  "Sports Teams",
  "Martial Arts Academies",
  "Schools",
  "Scout Groups",
  "Police Departments",
  "Fire Departments",
  "Military Units",
  "Businesses",
  "Nonprofit Organizations",
  "Clubs and Associations",
  "Events and Community Groups",
] as const;

export type TrustedLogoSegment = (typeof trustedLogoSegments)[number];

export type TrustedLogoMotif =
  | "road"
  | "star"
  | "dojo"
  | "crest"
  | "scout"
  | "shield"
  | "flame"
  | "service"
  | "commerce"
  | "horizon"
  | "club"
  | "event";

export type TrustedLogoItem = {
  id: string;
  name: string;
  segment: TrustedLogoSegment;
  href?: string;
  accessibleLabel: string;
  source: "original-placeholder";
  generatedMark: {
    initials: string;
    motif: TrustedLogoMotif;
    width: number;
    height: 48;
  };
};

export const trustedLogoItems = [
  {
    id: "iron-road-club",
    name: "Iron Road Club",
    segment: "Motorcycle Clubs",
    href: routes.motorcycleClubsIndustry,
    accessibleLabel: "Iron Road Club, original placeholder mark for Motorcycle Clubs",
    source: "original-placeholder",
    generatedMark: {
      initials: "IR",
      motif: "road",
      width: 132,
      height: 48,
    },
  },
  {
    id: "northstar-athletics",
    name: "Northstar Athletics",
    segment: "Sports Teams",
    href: routes.sportsTeamsIndustry,
    accessibleLabel: "Northstar Athletics, original placeholder mark for Sports Teams",
    source: "original-placeholder",
    generatedMark: {
      initials: "NA",
      motif: "star",
      width: 150,
      height: 48,
    },
  },
  {
    id: "apex-martial-arts-academy",
    name: "Apex Martial Arts Academy",
    segment: "Martial Arts Academies",
    href: routes.martialArtsSchoolsIndustry,
    accessibleLabel:
      "Apex Martial Arts Academy, original placeholder mark for Martial Arts Academies",
    source: "original-placeholder",
    generatedMark: {
      initials: "AX",
      motif: "dojo",
      width: 166,
      height: 48,
    },
  },
  {
    id: "crestline-school-guild",
    name: "Crestline School Guild",
    segment: "Schools",
    href: routes.schoolsIndustry,
    accessibleLabel: "Crestline School Guild, original placeholder mark for Schools",
    source: "original-placeholder",
    generatedMark: {
      initials: "CS",
      motif: "crest",
      width: 148,
      height: 48,
    },
  },
  {
    id: "summit-scouts",
    name: "Summit Scouts",
    segment: "Scout Groups",
    href: routes.scoutGroupsIndustry,
    accessibleLabel: "Summit Scouts, original placeholder mark for Scout Groups",
    source: "original-placeholder",
    generatedMark: {
      initials: "SS",
      motif: "scout",
      width: 128,
      height: 48,
    },
  },
  {
    id: "metro-service-department",
    name: "Metro Service Department",
    segment: "Police Departments",
    href: routes.policeDepartmentsIndustry,
    accessibleLabel: "Metro Service Department, original placeholder mark for Police Departments",
    source: "original-placeholder",
    generatedMark: {
      initials: "MS",
      motif: "shield",
      width: 160,
      height: 48,
    },
  },
  {
    id: "metro-fire-association",
    name: "Metro Fire Association",
    segment: "Fire Departments",
    href: routes.fireDepartmentsIndustry,
    accessibleLabel: "Metro Fire Association, original placeholder mark for Fire Departments",
    source: "original-placeholder",
    generatedMark: {
      initials: "MF",
      motif: "flame",
      width: 152,
      height: 48,
    },
  },
  {
    id: "national-service-unit",
    name: "National Service Unit",
    segment: "Military Units",
    href: routes.militaryIndustry,
    accessibleLabel: "National Service Unit, original placeholder mark for Military Units",
    source: "original-placeholder",
    generatedMark: {
      initials: "NS",
      motif: "service",
      width: 148,
      height: 48,
    },
  },
  {
    id: "bluecrest-business-group",
    name: "Bluecrest Business Group",
    segment: "Businesses",
    href: routes.businessesIndustry,
    accessibleLabel: "Bluecrest Business Group, original placeholder mark for Businesses",
    source: "original-placeholder",
    generatedMark: {
      initials: "BB",
      motif: "commerce",
      width: 162,
      height: 48,
    },
  },
  {
    id: "horizon-community-foundation",
    name: "Horizon Community Foundation",
    segment: "Nonprofit Organizations",
    href: routes.industries,
    accessibleLabel:
      "Horizon Community Foundation, original placeholder mark for Nonprofit Organizations",
    source: "original-placeholder",
    generatedMark: {
      initials: "HC",
      motif: "horizon",
      width: 176,
      height: 48,
    },
  },
  {
    id: "legacy-association",
    name: "Legacy Association",
    segment: "Clubs and Associations",
    href: routes.clubsOrganizationsIndustry,
    accessibleLabel: "Legacy Association, original placeholder mark for Clubs and Associations",
    source: "original-placeholder",
    generatedMark: {
      initials: "LA",
      motif: "club",
      width: 140,
      height: 48,
    },
  },
  {
    id: "vanguard-events-coalition",
    name: "Vanguard Events Coalition",
    segment: "Events and Community Groups",
    href: routes.eventsIndustry,
    accessibleLabel:
      "Vanguard Events Coalition, original placeholder mark for Events and Community Groups",
    source: "original-placeholder",
    generatedMark: {
      initials: "VE",
      motif: "event",
      width: 166,
      height: 48,
    },
  },
] as const satisfies ReadonlyArray<TrustedLogoItem>;
