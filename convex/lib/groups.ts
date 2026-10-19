import { v } from "convex/values";

/* The seven Senn groups and event tags. Keep in sync with GROUPS and TAGS
   in lib/umbrella-data.ts, which own the display names and colors. */

export const GROUP_SLUGS = [
  "pac",
  "lsc",
  "bac",
  "fos",
  "arts",
  "athletics",
  "icewatch",
] as const;
export type GroupSlug = (typeof GROUP_SLUGS)[number];
export const vGroup = v.union(...GROUP_SLUGS.map((s) => v.literal(s)));

/* Groups a parent can sign up for. LSC is information-only for now. */
export const JOINABLE_GROUPS: GroupSlug[] = [
  "pac",
  "bac",
  "fos",
  "arts",
  "athletics",
  "icewatch",
];

export const GROUP_NAMES: Record<GroupSlug, string> = {
  pac: "Parent Advisory Council",
  lsc: "Local School Council",
  bac: "Bilingual Advisory Committee",
  fos: "Friends of Senn",
  arts: "Senn Arts Boosters",
  athletics: "Senn Athletic Boosters",
  icewatch: "Senn Ice Watch",
};

export const TAG_SLUGS = [
  "meeting",
  "volunteer",
  "fundraiser",
  "social",
  "training",
] as const;
export const vTag = v.union(...TAG_SLUGS.map((s) => v.literal(s)));

export const vGroupRole = v.union(v.literal("lead"), v.literal("editor"));
export type GroupRole = "lead" | "editor";

export const vLanguage = v.union(
  v.literal("en"),
  v.literal("es"),
  v.literal("other"),
);

export const vPlace = v.object({
  kind: v.union(v.literal("senn"), v.literal("offsite"), v.literal("virtual")),
  name: v.string(),
  room: v.optional(v.string()),
  address: v.optional(v.string()),
  virtual: v.optional(v.string()),
});

export const vSlot = v.object({
  label: v.string(),
  open: v.number(),
  filled: v.number(),
});
