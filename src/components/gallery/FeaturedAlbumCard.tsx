import Image from "next/image";

/**
 * Featured album card: a split layout with the cover photo on one side and
 * a warm panel with eyebrow, title, description and a single arrow CTA on the
 * other. Used for albums that live on an external service (iCloud Shared
 * Albums, Google Photos…) so visitors get one clear, inviting link instead of
 * a bare URL. If the album also has uploaded photos, a small preview strip is
 * shown under the text.
 */
export type FeaturedAlbumCardProps = {
  title: string;
  description?: string | null;
  date?: string | null;
  href: string;
  /** Hostname of the external service, e.g. "icloud.com" */
  hostLabel: string;
  coverSrc?: string | null;
  coverAlt?: string;
  /** Up to four small preview images (already sized), optional. */
  previews?: Array<{ key: string; src: string; alt: string }>;
  photoCount?: number;
};

function serviceName(host: string) {
  if (host.includes("icloud")) return "iCloud Shared Album";
  if (host.includes("google")) return "Google Photos";
  if (host.includes("dropbox")) return "Dropbox";
  if (host.includes("flickr")) return "Flickr";
  return host;
}

export function FeaturedAlbumCard({
  title,
  description,
  date,
  href,
  hostLabel,
  coverSrc,
  coverAlt,
  previews = [],
  photoCount,
}: FeaturedAlbumCardProps) {
  const service = serviceName(hostLabel);

  return (
    <article className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="grid focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] md:grid-cols-5"
        aria-label={`Open ${title} on ${service} (opens in a new tab)`}
      >
        {/* Cover */}
        <div className="relative aspect-[4/3] md:col-span-3 md:aspect-auto md:min-h-[22rem]">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={coverAlt ?? `${title} cover photo`}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-[#c4555a] to-[var(--secondary)]">
              {/* Stacked-photos glyph for albums without a cover yet */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-28 w-36">
                  <div className="absolute inset-0 -rotate-6 rounded-xl bg-white/25 backdrop-blur-sm" />
                  <div className="absolute inset-0 rotate-3 rounded-xl bg-white/35 backdrop-blur-sm" />
                  <div className="absolute inset-0 rounded-xl bg-white/90 shadow-lg" />
                </div>
              </div>
            </div>
          )}
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10.5" r="1.5" />
              <path d="m21 16-5-5-8 8" />
            </svg>
            {photoCount ? `${photoCount} photos` : "Photo album"}
          </span>
        </div>

        {/* Panel */}
        <div className="flex flex-col justify-between gap-8 bg-[var(--background)] p-7 sm:p-9 md:col-span-2">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              {service}
              {date ? <span className="text-[var(--muted-foreground)]"> · {date}</span> : null}
            </p>
            <h2 className="font-noto-serif-sc text-2xl font-semibold leading-tight text-[var(--foreground)] sm:text-3xl">
              {title}
            </h2>
            {description ? (
              <p className="text-base leading-relaxed text-[var(--muted-foreground)]">
                {description}
              </p>
            ) : null}

            {previews.length > 0 ? (
              <ul className="flex gap-2 pt-1" aria-hidden="true">
                {previews.slice(0, 4).map((preview) => (
                  <li
                    key={preview.key}
                    className="relative h-14 w-14 overflow-hidden rounded-lg ring-1 ring-black/10"
                  >
                    <Image src={preview.src} alt="" fill sizes="56px" className="object-cover" />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition group-hover:brightness-110">
              View album
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              Opens on {hostLabel}
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
