"use client";

import { useVisualEditingEnvironment } from "next-sanity/hooks";
import Link from "next/link";

/**
 * Shown while Next.js draft mode is on, so an editor who opened a preview
 * link in a normal tab can switch back to published content. Inside the
 * Studio's Presentation tool the Studio already owns that control, so the
 * button is hidden there.
 */
export function DisableDraftMode() {
  const environment = useVisualEditingEnvironment();

  // "standalone" = draft mode in a regular browser tab.
  // "presentation-iframe" / "presentation-window" = inside Sanity Studio.
  // null = still detecting; render nothing to avoid a flash.
  if (environment !== "standalone") {
    return null;
  }

  return (
    <Link
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-[200] rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-md hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
    >
      Exit preview
    </Link>
  );
}
