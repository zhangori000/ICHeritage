import type { Metadata } from "next";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { GALLERY_PAGE_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

type GalleryAlbum = {
  _id: string;
  title?: string | null;
  description?: string | null;
  shareUrl?: string | null;
  highlightImage?: {
    asset?: {
      _ref?: string;
    };
    alt?: string | null;
  } | null;
};

type GallerySettings = {
  heroEyebrow?: string | null;
  heroTitle?: string | null;
  heroDescription?: string | null;
  heroBackgroundImage?: {
    asset?: {
      _ref?: string;
    };
    alt?: string | null;
  } | null;
};

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse curated photo albums that our regional leads maintain in iCloud, Google Photos, and other platforms.",
};

function parseUrl(urlString?: string | null) {
  if (!urlString) return null;
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}

export default async function GalleryPage() {
  const { data } = await sanityFetch({
    query: GALLERY_PAGE_QUERY,
  });

  const payload = (data ?? null) as {
    settings?: GallerySettings | null;
    albums?: GalleryAlbum[] | null;
  } | null;

  const hero = payload?.settings ?? null;
  const albums = payload?.albums ?? [];
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
                "Chapter leads keep their photo libraries in platforms like iCloud or Google Photos. We surface those live albums here so you can browse the latest highlights without re-uploading media."}
            </p>
          </div>
        </header>

        {albums.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/40 p-8 text-center text-sm text-[var(--muted-foreground)]">
            No shared albums have been published yet. Add a Gallery Album
            document in Sanity Studio to feature your first link.
          </div>
        ) : (
          <div className="grid gap-10 lg:gap-12">
            {albums.map((album) => {
              const parsedUrl = parseUrl(album.shareUrl);
              const hostname = parsedUrl
                ? parsedUrl.hostname.replace(/^www\./, "")
                : "External album";
              const highlightSrc =
                album.highlightImage?.asset?._ref &&
                urlFor(album.highlightImage).width(1600).height(900).fit("crop").url();

              return (
                <article
                  key={album._id}
                  className="rounded-3xl border border-[var(--border)] bg-white/90 shadow-sm ring-1 ring-black/5"
                >
                  {highlightSrc && (
                    <div className="relative h-64 w-full overflow-hidden rounded-t-3xl bg-black">
                      <Image
                        src={highlightSrc}
                        alt={
                          album.highlightImage?.alt ??
                          `${album.title ?? "Gallery"} preview`
                        }
                        fill
                        sizes="(min-width: 1024px) 720px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-5 px-6 py-6 sm:px-8">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                        {hostname}
                      </p>
                      <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                        {album.title ?? "Untitled album"}
                      </h2>
                      {album.description && (
                        <p className="text-base text-[var(--muted-foreground)]">
                          {album.description}
                        </p>
                      )}
                    </div>

                    {parsedUrl ? (
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
                        <a
                          href={parsedUrl.toString()}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                        >
                          View album
                        </a>
                        <span>
                          Opens in a new tab hosted on {hostname}. Albums stay
                          private—only whoever has the shared link can see them.
                        </span>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/40 px-4 py-3 text-sm text-[var(--muted-foreground)]">
                        Missing or invalid share URL. Update this Gallery Album
                        in Sanity Studio with a public link.
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--accent)]/10 p-6 text-sm text-[var(--muted-foreground)] sm:text-base">
          <p className="font-semibold text-[var(--foreground)]">
            Add or update albums from Sanity Studio
          </p>
          <p>
            Each card on this page is powered by a Gallery Album document. Your
            regional teams can paste any public share link (iCloud, Google
            Photos, Dropbox, etc.) and this page updates automatically—no image
            uploads or CDN work on our side.
          </p>
        </div>
      </div>
    </section>
  );
}
