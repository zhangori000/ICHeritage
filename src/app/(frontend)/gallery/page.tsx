import type { Metadata } from "next";
import Image from "next/image";
import dayjs from "dayjs";
import { stegaClean } from "next-sanity";

import { sanityFetch } from "@/sanity/lib/live";
import { GALLERY_PAGE_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { GALLERY_PAGE_QUERY_RESULT } from "@/sanity/types";
import { PhotoGrid, type GalleryPhoto } from "@/components/gallery/PhotoGrid";

type Album = NonNullable<GALLERY_PAGE_QUERY_RESULT["albums"]>[number];
type AlbumPhoto = NonNullable<Album["photos"]>[number];

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from ICHeritage workshops, celebrations, and community gatherings.",
};

function clean(value: string | null | undefined) {
  return typeof value === "string" ? stegaClean(value) : "";
}

function parseUrl(urlString?: string | null) {
  if (!urlString) return null;
  try {
    return new URL(stegaClean(urlString));
  } catch {
    return null;
  }
}

function formatAlbumDate(date?: string | null) {
  if (!date) return null;
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format("MMMM D, YYYY") : null;
}

/** Turn a Sanity photo into the plain data the client-side grid needs. */
function toGalleryPhoto(
  photo: AlbumPhoto,
  albumTitle: string,
  index: number
): GalleryPhoto | null {
  if (!photo?.asset?._ref) return null;

  const width = photo.dimensions?.width ?? 1600;
  const height = photo.dimensions?.height ?? 1200;

  return {
    key: photo._key ?? `${albumTitle}-${index}`,
    thumbSrc: urlFor(photo).width(800).height(800).fit("crop").auto("format").url(),
    fullSrc: urlFor(photo).width(2000).fit("max").auto("format").url(),
    alt: clean(photo.alt) || `${albumTitle} photo ${index + 1}`,
    caption: clean(photo.caption) || null,
    width,
    height,
    blurDataURL: photo.lqip ?? null,
  };
}

export default async function GalleryPage() {
  const { data } = await sanityFetch({ stega: false, query: GALLERY_PAGE_QUERY });

  const hero = data?.settings ?? null;
  const albums = (data?.albums ?? []).filter((album): album is Album =>
    Boolean(album)
  );

  const heroBackground =
    hero?.heroBackgroundImage?.asset?._ref &&
    urlFor(hero.heroBackgroundImage).width(2400).height(1200).quality(75).url();

  return (
    <section className="bg-[var(--background)] pb-16 sm:pb-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--foreground)]/90 via-[var(--primary)]/70 to-[var(--accent)]/70 px-6 py-16 text-center text-white shadow-xl sm:px-10 sm:py-20">
          {heroBackground && (
            <Image
              src={heroBackground}
              alt={hero?.heroBackgroundImage?.alt ?? "Gallery hero background"}
              fill
              priority
              sizes="100vw"
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          )}
          <div className="relative mx-auto max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              {hero?.heroEyebrow ?? "Community moments"}
            </p>
            <h1 className="font-noto-serif-sc text-3xl font-semibold sm:text-4xl">
              {hero?.heroTitle ?? "Gallery"}
            </h1>
            <p className="text-base text-white/90 sm:text-lg">
              {hero?.heroDescription ??
                "Moments from our workshops, celebrations, and community gatherings."}
            </p>
          </div>
        </header>

        {albums.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/40 p-8 text-center text-sm text-[var(--muted-foreground)]">
            Photos are coming soon. Check back shortly!
          </div>
        ) : (
          <div className="grid gap-12 lg:gap-16">
            {albums.map((album) => {
              const title = clean(album.title) || "Untitled album";
              const description = clean(album.description);
              const date = formatAlbumDate(album.date);
              const externalUrl = parseUrl(album.shareUrl);

              const photos = (album.photos ?? [])
                .map((photo, index) => toGalleryPhoto(photo, title, index))
                .filter((photo): photo is GalleryPhoto => Boolean(photo));

              // Cover: explicit cover image, otherwise the first uploaded photo
              const coverSource = album.highlightImage?.asset?._ref
                ? album.highlightImage
                : album.photos?.find((photo) => photo?.asset?._ref) ?? null;
              const coverSrc =
                coverSource &&
                urlFor(coverSource).width(1600).height(700).fit("crop").auto("format").url();
              const coverAlt =
                (album.highlightImage?.asset?._ref && clean(album.highlightImage.alt)) ||
                `${title} cover photo`;

              return (
                <article
                  key={album._id}
                  className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white/90 shadow-sm ring-1 ring-black/5"
                >
                  {coverSrc && (
                    <div className="relative h-56 w-full bg-black sm:h-72">
                      <Image
                        src={coverSrc}
                        alt={coverAlt}
                        fill
                        sizes="(min-width: 1024px) 1100px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
                    <div className="space-y-2">
                      {date ? (
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                          {date}
                        </p>
                      ) : null}
                      <h2 className="font-noto-serif-sc text-2xl font-semibold text-[var(--foreground)]">
                        {title}
                      </h2>
                      {description ? (
                        <p className="max-w-3xl text-base text-[var(--muted-foreground)]">
                          {description}
                        </p>
                      ) : null}
                    </div>

                    {photos.length > 0 ? (
                      <PhotoGrid albumTitle={title} photos={photos} />
                    ) : !externalUrl ? (
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Photos for this album are on their way.
                      </p>
                    ) : null}

                    {externalUrl ? (
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
                        <a
                          href={externalUrl.toString()}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                        >
                          View full album
                        </a>
                        <span>
                          Opens in a new tab on{" "}
                          {externalUrl.hostname.replace(/^www\./, "")}.
                        </span>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
