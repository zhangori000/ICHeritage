import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { stegaClean } from "next-sanity";

import { urlFor } from "@/sanity/lib/image";
import type { PAGE_QUERYResult } from "@/sanity/types";

type InitiativesGridBlock = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "initiativesGrid" }
>;

function clean(value: string | null | undefined): string {
  return typeof value === "string" ? stegaClean(value) : value ?? "";
}

function resolveHref(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return `/${trimmed.replace(/^\//, "")}`;
}

const cardTone: CSSProperties & Record<`--${string}`, string> = {
  "--card-bg": "color-mix(in oklab, #ffffff 94%, var(--card) 6%)",
  "--card-border": "color-mix(in oklab, var(--muted) 55%, var(--border) 45%)",
  "--card-border-hover": "color-mix(in oklab, var(--primary) 35%, var(--muted) 65%)",
  "--card-title": "color-mix(in oklab, var(--foreground) 92%, #101010 8%)",
  "--card-title-hover": "var(--primary)",
  "--card-body": "color-mix(in oklab, var(--foreground) 88%, #1b1b1b 12%)",
  "--card-body-hover": "color-mix(in oklab, var(--primary) 80%, #3f0d11 20%)",
  "--card-link": "color-mix(in oklab, var(--foreground) 85%, #1a1a1a 15%)",
  "--card-link-hover": "var(--primary)",
};

export function InitiativesGrid({
  heading,
  intro,
  cards,
  sectionCta,
}: InitiativesGridBlock) {
  const safeHeading = clean(heading);
  const safeIntro = clean(intro);

  const items = Array.isArray(cards)
    ? cards.filter((card): card is NonNullable<typeof card> => Boolean(card))
    : [];

  const sectionCtaLabel = clean(sectionCta?.label);
  const sectionCtaHref = resolveHref(clean(sectionCta?.href));

  return (
    <section
      className="py-20"
      style={{
        backgroundColor:
          "color-mix(in oklab, var(--background) 70%, var(--muted) 30%)",
      }}
    >
      <div className="container mx-auto px-4">
        {(safeHeading || safeIntro) && (
          <div className="text-center space-y-6 mb-16">
            {safeHeading ? (
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">
                {safeHeading}
              </h2>
            ) : null}
            {safeIntro ? (
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty font-normal">
                {safeIntro}
              </p>
            ) : null}
          </div>
        )}

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {items.map((card, index) => {
              const title = clean(card?.title);
              const description = clean(card?.description);
              const label = clean(card?.cta?.label);
              const href = resolveHref(clean(card?.cta?.href));
              const alt = clean(card?.alt) || title;

              return (
                <article
                  key={card?._key ?? `${title}-${href ?? index}`}
                  className="group text-card-foreground flex flex-col gap-6 rounded-xl border border-[color:var(--card-border)] bg-[color:var(--card-bg)] py-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
                  style={cardTone}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {card?.image ? (
                      <Image
                        fill
                        priority={false}
                        sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 90vw"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={alt || ""}
                        src={urlFor(card.image).width(800).height(600).url()}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-muted" aria-hidden />
                    )}
                  </div>

                  <div className="px-6 space-y-4">
                    {title ? (
                      <h3 className="font-serif text-xl md:text-2xl font-medium leading-tight transition-colors duration-300 text-[color:var(--card-title)] group-hover:text-[color:var(--card-title-hover)]">
                        {title}
                      </h3>
                    ) : null}

                    {description ? (
                      <p className="text-base leading-relaxed text-pretty transition-colors duration-300 text-[color:var(--card-body)] group-hover:text-[color:var(--card-body-hover)]">
                        {description}
                      </p>
                    ) : null}

                    {href && label ? (
                      <Link
                        href={href}
                        className="group/cta inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 px-0 py-0 text-[color:var(--card-link)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 hover:text-[color:var(--card-link-hover)] group-hover:text-[color:var(--card-link-hover)]"
                      >
                        {label}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-arrow-right ml-2 h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-1"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}

        {sectionCtaHref && sectionCtaLabel ? (
          <div className="text-center mt-16">
            <Link
              href={sectionCtaHref}
              className="group inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-4 shrink-0 [&>svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border border-[color:var(--secondary)] text-[color:var(--secondary)] bg-transparent hover:bg-[color:var(--secondary)] hover:text-[color:var(--secondary-foreground)] h-10 rounded-md has-[>svg]:px-4 px-8 py-3 text-base"
            >
              {sectionCtaLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
