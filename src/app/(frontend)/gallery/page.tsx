import type { Metadata } from "next";
import Image from "next/image";
import dayjs from "dayjs";
import { stegaClean } from "next-sanity";

import { sanityFetch } from "@/sanity/lib/live";
import { GALLERY_PAGE_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { GALLERY_PAGE_QUERY_RESULT } from "@/sanity/types";
import { PhotoGrid, type GalleryPhoto } from "@/components/gallery/PhotoGrid";
import { FeaturedAlbumCard } from "@/components/gallery/FeaturedAlbumCard";

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

  const heroImage =
    hero?.heroBackgroundImage?.asset?._ref &&
    urlFor(hero.heroBackgroundImage).width(2400).height(1000).fit("crop").quality(75).url();

  return (
    <section className="bg-[color:var(--paper)] py-20 md:py-28">
      <div className="wrap">
        <header className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow eyebrow-rule">
              {hero?.heroEyebrow ?? "Community moments"}
            </p>
            <h1 className="display mt-5 text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
              {hero?.heroTitle ?? "Gallery"}
            </h1>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)] md:justify-self-end">
            {hero?.heroDescription ??
              "Moments from our workshops, celebrations, and community gatherings."}
          </p>
        </header>

        {heroImage ? (
          <figure className="mt-12">
            <div className="relative aspect-[21/9] overflow-hidden border border-[color:var(--ink)] bg-[color:var(--paper-slot)]">
              <Image
                src={heroImage}
                alt={hero?.heroBackgroundImage?.alt ?? ""}
                fill
                priority
                sizes="(min-width: 1360px) 1280px, 100vw"
                className="object-cover"
              />
            </div>
          </figure>
        ) : null}

        {albums.length === 0 ? (
          <p className="mt-12 border-t border-[color:var(--ink)] pt-6 text-[color:var(--ink-muted)]">
            Photos are coming soon. Check back shortly.
          </p>
        ) : (
          <div className="mt-16 border-t border-[color:var(--ink)]">
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

              // Albums that live on an external service (iCloud, Google Photos…)
              // get the featured link; uploaded-photo albums get the grid.
              if (externalUrl) {
                return (
                  <div
                    key={album._id}
                    className="border-b border-[color:var(--hairline)] py-12 md:py-16"
                  >
                    <FeaturedAlbumCard
                      title={title}
                      description={description || null}
                      date={date}
                      href={externalUrl.toString()}
                      hostLabel={externalUrl.hostname.replace(/^www\./, "")}
                      coverSrc={coverSrc || null}
                      coverAlt={coverAlt}
                      previews={photos.slice(0, 4).map((photo) => ({
                        key: photo.key,
                        src: photo.thumbSrc,
                        alt: photo.alt,
                      }))}
                      photoCount={photos.length || undefined}
                    />
                  </div>
                );
              }

              return (
                <article
                  key={album._id}
                  className="border-b border-[color:var(--hairline)] py-12 md:py-16"
                >
                  <div className="grid gap-6 md:grid-cols-2 md:items-end">
                    <div>
                      {date ? <p className="eyebrow">{date}</p> : null}
                      <h2 className="mt-3 font-serif text-2xl leading-tight text-[color:var(--ink)] md:text-3xl">
                        {title}
                      </h2>
                    </div>
                    {description ? (
                      <p className="max-w-md text-base leading-relaxed text-[color:var(--ink-soft)] md:justify-self-end">
                        {description}
                      </p>
                    ) : null}
                  </div>

                  {coverSrc ? (
                    <figure className="mt-8">
                      <div className="relative aspect-[16/7] overflow-hidden border border-[color:var(--ink)] bg-[color:var(--paper-slot)]">
                        <Image
                          src={coverSrc}
                          alt={coverAlt}
                          fill
                          sizes="(min-width: 1360px) 1280px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    </figure>
                  ) : null}

                  <div className="mt-8">
                    {photos.length > 0 ? (
                      <PhotoGrid albumTitle={title} photos={photos} />
                    ) : (
                      <p className="text-sm text-[color:var(--ink-muted)]">
                        Photos for this album are on their way.
                      </p>
                    )}
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
