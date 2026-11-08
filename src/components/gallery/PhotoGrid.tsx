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
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={photo.key}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-[var(--muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              aria-label={`Open photo ${index + 1} of ${photos.length}${
                photo.caption ? `: ${photo.caption}` : ""
              }`}
            >
              <Image
                src={photo.thumbSrc}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                placeholder={photo.blurDataURL ? "blur" : "empty"}
                blurDataURL={photo.blurDataURL ?? undefined}
              />
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${albumTitle} photo viewer`}
          className="fixed inset-0 z-[10000] flex flex-col bg-black text-white"
          onClick={close}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 text-sm sm:px-6">
            <span className="text-white/80">
              {activeIndex! + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close photo viewer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Image */}
          <div
            className="relative flex-1 px-12 pb-4 sm:px-20"
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
              className="px-6 pb-4 text-center text-sm text-white/85 sm:text-base"
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
                className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:left-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
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
                className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 sm:right-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
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
