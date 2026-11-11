import Image from "next/image";

/**
 * Featured album: a framed cover photo beside an "External album" eyebrow,
 * title, description and an underlined "Open album" link. Used for albums
 * that live on an external service (iCloud Shared Albums, Google Photos…) so
 * visitors get one clear link instead of a bare URL. If the album also has
 * uploaded photos, a small preview strip is shown under the text.
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
  const facts = [photoCount ? `${photoCount} photos` : null, service]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="group">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="grid gap-6 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--seal)] md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-10"
        aria-label={`Open ${title} on ${service} (opens in a new tab)`}
      >
        {/* Cover */}
        <div className="relative aspect-[4/3] overflow-hidden border border-[color:var(--ink)] bg-[color:var(--paper-slot)]">
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={coverAlt ?? `${title} cover photo`}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
            />
          ) : null}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-4 md:pt-1">
          <p className="eyebrow">
            External album{date ? ` · ${date}` : ""}
          </p>
          <h2 className="font-serif text-2xl leading-tight text-[color:var(--ink)] md:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="text-base leading-relaxed text-[color:var(--ink-soft)]">
              {description}
            </p>
          ) : null}
          {facts ? (
            <p className="text-sm text-[color:var(--ink-muted)]">{facts}</p>
          ) : null}

          {previews.length > 0 ? (
            <ul className="flex gap-2" aria-hidden="true">
              {previews.slice(0, 4).map((preview) => (
                <li
                  key={preview.key}
                  className="relative h-14 w-14 overflow-hidden border border-[color:var(--hairline)]"
                >
                  <Image src={preview.src} alt="" fill sizes="56px" className="object-cover" />
                </li>
              ))}
            </ul>
          ) : null}

          <span className="textlink mt-2 self-start group-hover:border-[color:var(--seal)] group-hover:text-[color:var(--seal)]">
            Open album
          </span>
        </div>
      </a>
    </article>
  );
}
