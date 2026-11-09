"use client";

import type { ImageLoaderProps } from "next/image";

const SANITY_CDN = "https://cdn.sanity.io/";

/**
 * Global next/image loader (wired up in next.config.ts).
 *
 * Sanity's image CDN already resizes, converts to AVIF/WebP (`auto=format`)
 * and caches at the edge, so Sanity URLs are served straight from it instead
 * of going through Vercel's optimizer, which re-processes every new size on
 * first request and counts against the plan's transformation quota.
 *
 * The incoming `src` is whatever `urlFor(...)` built. Its `w` is treated as
 * the largest width the page wants, so srcset entries never upscale past it,
 * and a fixed `h` is scaled with the width so the crop's aspect ratio holds.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.startsWith(SANITY_CDN)) {
    // Local and static assets (logo, placeholders) are small and served as-is.
    // The width query keeps each srcset entry distinct and is ignored by the server.
    if (!src.startsWith("/")) return src;
    return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
  }

  const url = new URL(src);
  const params = url.searchParams;

  const maxWidth = Number(params.get("w")) || undefined;
  const fixedHeight = Number(params.get("h")) || undefined;
  const targetWidth = maxWidth ? Math.min(width, maxWidth) : width;

  params.set("w", String(targetWidth));
  if (maxWidth && fixedHeight) {
    params.set("h", String(Math.round((fixedHeight * targetWidth) / maxWidth)));
  }
  params.set("q", String(quality ?? 75));
  params.set("auto", "format");

  return url.toString();
}
