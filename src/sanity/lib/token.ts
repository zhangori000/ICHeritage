/**
 * Viewer token for drafts and live previews. Published content does not need
 * it, so a missing token only disables draft mode instead of crashing the
 * site; `defineLive` logs its own warning in development.
 */
export const token = process.env.SANITY_API_READ_TOKEN || undefined;

if (!token && process.env.NODE_ENV === "development") {
  console.warn(
    "SANITY_API_READ_TOKEN is not set: showing published content only (draft mode and live previews are off)."
  );
}
