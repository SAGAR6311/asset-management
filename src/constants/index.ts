export * from "./colors";
export * from "./breakpoints";

export const PART_TYPES = [
  "Electrical",
  "Mechanical",
  "Plumbing",
  "HVAC",
  "Structural",
  "Safety",
  "Tools",
  "Hardware",
] as const;

export const PART_CATEGORIES = [
  "Consumable",
  "Reusable",
  "Equipment",
  "Tool",
  "Material",
  "Component",
] as const;

export const ASSET_STATUS = {
  AVAILABLE: "available",
  ASSIGNED: "assigned",
  MAINTENANCE: "maintenance",
} as const;

export const ROUTES = {
  DASHBOARD: "/",
  PARTS: "/parts",
  ASSETS: "/assets",
  UTILIZATION: "/utilization",
} as const;

export const DEBOUNCE_DELAY = 300;
export const ITEMS_PER_PAGE = 10;
