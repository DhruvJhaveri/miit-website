/**
 * Brands referenced on MIIT CORPORATION's existing website ("Norton, Addison, Taparia,
 * Miranda, Bipico, I.T. and any other make as per customer preference").
 * No dealership, distributorship or partnership status is claimed. Logos are not
 * displayed until MIIT confirms permission to use them — names are set as type.
 */
export interface BrandEntry {
  name: string;
  /** Product area MIIT associates with the brand — confirm before launch. */
  area?: string;
  logo?: string;
  href?: string;
}

export const brands: BrandEntry[] = [
  { name: "Norton", area: "Abrasives and grinding" },
  { name: "Addison", area: "Cutting tools" },
  { name: "Taparia", area: "Hand tools" },
  { name: "Miranda", area: "Cutting tools" },
  { name: "Bipico", area: "Cutting tools" },
  { name: "I.T." },
];

export const brandNote =
  "Brands referenced by MIIT CORPORATION. Availability depends on the requirement, and other makes can be sourced as per customer preference. Listing a brand does not indicate an authorised dealership or distributorship.";
