// src/lib/siteVisibility.ts
//
// Central place for "which optional sections of the site are switched on".
// Editors control this from Sanity Studio → Site Settings → Section visibility.
// Anything not explicitly switched on is treated as hidden, so a brand-new
// deployment hides Workshops and Brands until the owner decides to show them.

export type HideableSection = "workshops" | "brands";

export type SectionVisibility = Record<HideableSection, boolean>;

type SettingsLike =
  | {
      navigation?: {
        showWorkshops?: boolean | null;
        showBrands?: boolean | null;
      } | null;
    }
  | null
  | undefined;

/** Map a page slug (or first path segment) to the section that controls it. */
const SECTION_BY_SLUG: Record<string, HideableSection> = {
  workshops: "workshops",
  brands: "brands",
};

export function getSectionVisibility(settings: SettingsLike): SectionVisibility {
  return {
    workshops: settings?.navigation?.showWorkshops ?? false,
    brands: settings?.navigation?.showBrands ?? false,
  };
}

/** True when the given page slug belongs to a section that is currently hidden. */
export function isPageHidden(
  slug: string | null | undefined,
  visibility: SectionVisibility
): boolean {
  if (!slug) return false;
  const section = SECTION_BY_SLUG[slug.toLowerCase()];
  return section ? !visibility[section] : false;
}
