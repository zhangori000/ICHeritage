import Link from "next/link";
import { stegaClean } from "next-sanity";

import { BlurUpImage } from "@/components/BlurUpImage";
import { urlFor } from "@/sanity/lib/image";
import type { PAGE_QUERY_RESULT } from "@/sanity/types";

type InitiativesGridBlock = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["content"]>[number],
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

/**
 * "Our initiatives" as a numbered editorial list: a faint numeral, the title,
 * the description with its link, and the photo. Each row is one link.
 */
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
    <section className="bg-[color:var(--paper)] py-20 md:py-28">
      <div className="wrap flex flex-col gap-14 md:gap-16">
        {(safeHeading || safeIntro) && (
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-10">
            <div className="flex flex-col gap-4">
              <span className="eyebrow">What we do</span>
              {safeHeading ? (
                <h2 className="display m-0 text-4xl md:text-5xl lg:text-[3.75rem]">
                  {safeHeading}
                </h2>
              ) : null}
            </div>
            {safeIntro ? (
              <p className="m-0 max-w-md text-[17px] leading-relaxed text-[color:var(--ink-soft)] text-pretty md:justify-self-end">
                {safeIntro}
              </p>
            ) : null}
          </div>
        )}

        {items.length > 0 ? (
          <ol className="m-0 list-none border-t border-[color:var(--hairline)] p-0">
            {items.map((card, index) => {
              const title = clean(card?.title);
              const description = clean(card?.description);
              const label = clean(card?.cta?.label);
              const href = resolveHref(clean(card?.cta?.href));
              const alt = clean(card?.alt) || title;
              const number = String(index + 1).padStart(2, "0");

              const inner = (
                <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-5 gap-y-6 py-9 md:grid-cols-[6rem_minmax(0,1.1fr)_minmax(0,1fr)_16rem] md:items-center md:gap-8 md:py-10 lg:grid-cols-[7rem_minmax(0,1.1fr)_minmax(0,1fr)_18rem]">
                  <span
                    aria-hidden="true"
                    className="font-serif text-4xl font-light leading-none text-[color:var(--ink-faint)] transition-colors duration-300 group-hover:text-[color:var(--ink)] md:text-6xl"
                    style={{ fontVariationSettings: '"opsz" 144' }}
                  >
                    {number}
                  </span>

                  {title ? (
                    <h3 className="m-0 font-serif text-3xl leading-[1.08] tracking-[-0.02em] md:text-[2.375rem]">
                      {title}
                    </h3>
                  ) : (
                    <span />
                  )}

                  <div className="col-start-2 flex flex-col items-start gap-4 md:col-start-auto">
                    {description ? (
                      <p className="m-0 text-base leading-relaxed text-[color:var(--ink-soft)]">
                        {description}
                      </p>
                    ) : null}
                    {href && label ? (
                      <span className="textlink">{label}</span>
                    ) : null}
                  </div>

                  <div className="col-start-2 md:col-start-auto">
                    {card?.image ? (
                      <div className="relative aspect-[3/2] w-full overflow-hidden border border-[color:var(--ink)] transition-transform duration-500 ease-out group-hover:-translate-y-1">
                        <BlurUpImage
                          sizes="(min-width: 1024px) 288px, (min-width: 768px) 256px, 90vw"
                          lqip={card.lqip}
                          hotspot={card.image.hotspot}
                          className="object-cover"
                          alt={alt || ""}
                          src={urlFor(card.image).width(900).height(600).url()}
                        />
                      </div>
                    ) : (
                      <div
                        className="photo-slot aspect-[3/2] w-full transition-transform duration-500 ease-out group-hover:-translate-y-1"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
              );

              return (
                <li
                  key={card?._key ?? `${title}-${href ?? index}`}
                  className="border-b border-[color:var(--hairline)]"
                >
                  {href ? (
                    <Link
                      href={href}
                      aria-label={label ? `${title}: ${label}` : title}
                      className="row-hover group -mx-4 block px-4 text-[color:var(--ink)] no-underline"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="group">{inner}</div>
                  )}
                </li>
              );
            })}
          </ol>
        ) : null}

        {sectionCtaHref && sectionCtaLabel ? (
          <div>
            <Link href={sectionCtaHref} className="btn">
              {sectionCtaLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
