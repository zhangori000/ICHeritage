"use client";

import * as React from "react";
import Link from "next/link";

type Highlight = {
  _key?: string;
  /** Kept for the Sanity schema; the editorial layout renders no icons. */
  icon?: string | null;
  title?: string | null;
  body?: string | null;
};

type Benefit = {
  _key?: string;
  title?: string | null;
  description?: string | null;
};

type Fact = {
  _key?: string;
  label?: string | null;
  value?: string | null;
};

type CTA = {
  label?: string | null;
  href?: string | null;
} | null | undefined;

const FALLBACK_APPLY_PATH = "/start-a-chapter/apply";

type ChapterApplicationProps = {
  sectionId?: string | null;
  kicker?: string | null;
  title?: string | null;
  description?: string | null;
  highlights?: Highlight[] | null;
  benefitsHeading?: string | null;
  benefitsIntro?: string | null;
  benefits?: Benefit[] | null;
  cardTitle?: string | null;
  cardSubtitle?: string | null;
  cardFacts?: Fact[] | null;
  cta?: CTA;
  cardFootnote?: string | null;
} & Record<string, unknown>;

export function ChapterApplication({
  sectionId,
  kicker,
  title,
  description,
  highlights,
  benefitsHeading,
  benefitsIntro,
  benefits,
  cardTitle,
  cardSubtitle,
  cardFacts,
  cta,
  cardFootnote,
}: ChapterApplicationProps) {
  const sectionAnchor = sectionId?.trim() ? sectionId.trim() : undefined;
  const trimmedCtaLabel = typeof cta?.label === "string" ? cta.label.trim() : "";
  const trimmedCtaHref = typeof cta?.href === "string" ? cta.href.trim() : "";
  const safeCtaHref =
    trimmedCtaHref && !trimmedCtaHref.startsWith("#") ? trimmedCtaHref : FALLBACK_APPLY_PATH;
  const safeCtaLabel = trimmedCtaLabel || "Begin application";

  const highlightItems = Array.isArray(highlights) ? highlights : [];
  const benefitItems = Array.isArray(benefits) ? benefits : [];
  const facts = Array.isArray(cardFacts) ? cardFacts : [];

  const hasHeader = Boolean(kicker || title || description);
  const hasBenefits = Boolean(benefitsHeading || benefitsIntro || benefitItems.length > 0);
  const hasPaperContent = hasHeader || highlightItems.length > 0 || hasBenefits;

  return (
    <section id={sectionAnchor}>
      {hasPaperContent ? (
        <div className="bg-[color:var(--paper-deep)] py-20 md:py-28">
          <div className="wrap">
            {hasHeader ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end">
                <div>
                  {kicker ? <p className="eyebrow eyebrow-rule mb-5">{kicker}</p> : null}
                  {title ? (
                    <h2 className="display text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
                      {title}
                    </h2>
                  ) : null}
                </div>
                {description ? (
                  <p className="max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)] md:justify-self-end">
                    {description}
                  </p>
                ) : null}
              </div>
            ) : null}

            {highlightItems.length > 0 ? (
              <ul
                className={[
                  "grid grid-cols-1 border-t border-[color:var(--ink)] md:grid-cols-2 lg:grid-cols-4",
                  hasHeader ? "mt-14" : "",
                ].join(" ")}
              >
                {highlightItems.map((item, index) => {
                  const key = item._key ?? `${item.title ?? "highlight"}-${index}`;
                  return (
                    <li
                      key={key}
                      className="border-b border-[color:var(--hairline)] py-6 md:py-8 md:odd:border-r md:odd:pr-8 md:even:pl-8 lg:border-b-0 lg:border-r lg:px-8 lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-child(4n)]:pr-0 lg:[&:nth-child(4n+1)]:pl-0 lg:[&:nth-child(n+5)]:border-t"
                    >
                      {item.title ? (
                        <h3 className="font-serif text-2xl text-[color:var(--ink)]">{item.title}</h3>
                      ) : null}
                      {item.body ? (
                        <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
                          {item.body}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {hasBenefits ? (
              <div
                className={[
                  "grid grid-cols-1 gap-x-16 gap-y-8 border-t border-[color:var(--ink)] pt-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
                  hasHeader || highlightItems.length > 0 ? "mt-16" : "",
                ].join(" ")}
              >
                <div>
                  {benefitsHeading ? (
                    <h3 className="font-serif text-3xl text-[color:var(--ink)] md:text-4xl">
                      {benefitsHeading}
                    </h3>
                  ) : null}
                  {benefitsIntro ? (
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)]">
                      {benefitsIntro}
                    </p>
                  ) : null}
                </div>

                {benefitItems.length > 0 ? (
                  <ul>
                    {benefitItems.map((benefit, index) => (
                      <li
                        key={benefit._key ?? `${benefit.title ?? "benefit"}-${index}`}
                        className="border-b border-[color:var(--hairline)] py-5 first:border-t first:border-t-[color:var(--hairline)] lg:first:border-t-0 lg:first:pt-0"
                      >
                        {benefit.title ? (
                          <h4 className="font-serif text-2xl text-[color:var(--ink)]">{benefit.title}</h4>
                        ) : null}
                        {benefit.description ? (
                          <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
                            {benefit.description}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Closing call to action: the one dark band on the page. */}
      <div className="band py-20 md:py-28">
        <div className="wrap">
          <div
            className={[
              "grid grid-cols-1 gap-x-16 gap-y-12",
              facts.length > 0 ? "lg:grid-cols-2" : "",
            ].join(" ")}
          >
            <div>
              {cardTitle ? (
                <h3 className="display text-3xl text-[color:var(--band-text)] md:text-4xl lg:text-5xl">
                  {cardTitle}
                </h3>
              ) : null}
              {cardSubtitle ? (
                <p className="mt-5 max-w-md text-lg leading-relaxed text-[color:var(--band-muted)]">
                  {cardSubtitle}
                </p>
              ) : null}
              <div className="mt-8">
                <Link
                  href={safeCtaHref}
                  className="btn btn-primary text-[color:var(--primary-foreground)] hover:text-[color:var(--primary-foreground)]"
                >
                  {safeCtaLabel}
                </Link>
              </div>
              {cardFootnote ? (
                <p className="mt-5 max-w-md text-sm leading-relaxed text-[color:var(--band-muted)]">
                  {cardFootnote}
                </p>
              ) : null}
            </div>

            {facts.length > 0 ? (
              <dl className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:self-end">
                {facts.map((fact, index) => (
                  <div
                    key={fact._key ?? `${fact.label ?? "fact"}-${index}`}
                    className="border-t border-[color:var(--band-rule)] pt-3"
                  >
                    <dt className="eyebrow text-[color:var(--band-muted)]">{fact.label}</dt>
                    <dd className="mt-2 font-serif text-2xl text-[color:var(--band-text)] md:text-3xl">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
