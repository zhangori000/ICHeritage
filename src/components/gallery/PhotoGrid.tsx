"use client";

import * as React from "react";
import Image from "next/image";

/**
 * Pre-computed photo data. URLs are built on the server with `urlFor` so this
 * client component stays small and never needs the Sanity client config.
 */
export type GalleryPhoto = {
  key: string;
  thumbSrc: string;
  fullSrc: string;
  alt: string;
  caption?: string | null;
  width: number;
  height: number;
  blurDataURL?: string | null;
};

type PhotoGridProps = {
  albumTitle: string;
  photos: GalleryPhoto[];
};

const arrowProps = {
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-5 w-5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function PhotoGrid({ albumTitle, photos }: PhotoGridProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const close = React.useCallback(() => setActiveIndex(null), []);
  const showPrev = React.useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + photos.length) % photos.length
    );
  }, [photos.length]);
  const showNext = React.useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % photos.length
    );
  }, [photos.length]);

  // Keyboard controls + lock page scroll while the lightbox is open
  React.useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, showPrev, showNext]);

  if (photos.length === 0) return null;

  const active = activeIndex === null ? null : photos[activeIndex];

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={photo.key}>
            <figure>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative block aspect-square w-full overflow-hidden border border-[color:var(--ink)] bg-[color:var(--paper-slot)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--seal)]"
                aria-label={`Open photo ${index + 1} of ${photos.length}${
                  photo.caption ? `: ${photo.caption}` : ""
                }`}
              >
                <Image
                  src={photo.thumbSrc}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
                  placeholder={photo.blurDataURL ? "blur" : "empty"}
                  blurDataURL={photo.blurDataURL ?? undefined}
                />
              </button>
              {photo.caption ? (
                <figcaption className="mt-2 line-clamp-1 text-[13px] text-[color:var(--ink-muted)]">
                  {photo.caption}
                </figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${albumTitle} photo viewer`}
          className="fixed inset-0 z-[10000] flex flex-col bg-[color:var(--paper)] text-[color:var(--ink)]"
          onClick={close}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between border-b border-[color:var(--hairline)] px-5 py-3 sm:px-8"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="eyebrow">
              {activeIndex! + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close photo viewer"
              className="btn btn-sm"
            >
              Close
            </button>
          </div>

          {/* Image */}
          <div
            className="relative flex-1 px-14 py-6 sm:px-24"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              key={active.key}
              src={active.fullSrc}
              alt={active.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Caption */}
          {active.caption ? (
            <p
              className="border-t border-[color:var(--hairline)] px-5 py-4 text-[13px] text-[color:var(--ink-muted)] sm:px-8"
              onClick={(event) => event.stopPropagation()}
            >
              {active.caption}
            </p>
          ) : (
            <div className="pb-4" />
          )}

          {/* Prev / Next */}
          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous photo"
                className="btn absolute left-2 top-1/2 h-12 w-12 -translate-y-1/2 px-0 sm:left-5"
              >
                <svg {...arrowProps}>
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="Next photo"
                className="btn absolute right-2 top-1/2 h-12 w-12 -translate-y-1/2 px-0 sm:right-5"
              >
                <svg {...arrowProps}>
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
