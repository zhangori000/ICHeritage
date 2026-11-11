"use client";

import * as React from "react";

type Pillar = {
  _key?: string;
  title?: string | null;
  description?: string | null;
};

type Stat = {
  _key?: string;
  /** Kept for the Sanity schema; the editorial layout does not render icons. */
  icon?: string | null;
  value?: string | null;
  label?: string | null;
  description?: string | null;
};

type AboutOverviewProps = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: Array<string | null> | null;
  pillars?: Pillar[] | null;
  stats?: Stat[] | null;
} & Record<string, unknown>;

export function AboutOverview({ sectionId, heading, intro, pillars, stats }: AboutOverviewProps) {
  const anchor = sectionId?.trim() ? sectionId.trim() : undefined;
  const introParagraphs = Array.isArray(intro)
    ? intro.filter((paragraph): paragraph is string => Boolean(paragraph))
    : [];
  const pillarItems = Array.isArray(pillars) ? pillars : [];
  const statItems = Array.isArray(stats) ? stats : [];

  return (
    <section id={anchor} className="py-20 md:py-28">
      <div className="wrap">
        {/* Heading left, intro right. */}
        {(heading || introParagraphs.length > 0) && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            {heading ? (
              <h2 className="display text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
                {heading}
              </h2>
            ) : null}

            {introParagraphs.length > 0 ? (
              <div className="max-w-md space-y-5 text-lg leading-relaxed text-[color:var(--ink-soft)] md:justify-self-end">
                {introParagraphs.map((paragraph, index) => (
                  <p key={`intro-${index}`}>{paragraph}</p>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {/* Pillars: three hairline columns. */}
        {pillarItems.length > 0 ? (
          <div className="mt-16 grid grid-cols-1 border-t border-[color:var(--ink)] md:mt-20 md:grid-cols-3">
            {pillarItems.map((pillar, index) => (
              <article
                key={pillar._key ?? `${pillar.title ?? "pillar"}-${index}`}
                className="border-b border-[color:var(--hairline)] py-8 last:border-b-0 md:border-b-0 md:border-r md:pr-8 md:pl-8 md:first:pl-0 md:last:border-r-0"
              >
                {pillar.title ? (
                  <h3 className="font-serif text-2xl text-[color:var(--ink)]">{pillar.title}</h3>
                ) : null}
                {pillar.description ? (
                  <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
                    {pillar.description}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        {/* Stats: a fact row, not cards. */}
        {statItems.length > 0 ? (
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 md:mt-20 md:grid-cols-4">
            {statItems.map((stat, index) => (
              <div
                key={stat._key ?? `${stat.label ?? "stat"}-${index}`}
                className="border-t border-[color:var(--hairline)] pt-3"
              >
                {stat.label ? <dt className="eyebrow">{stat.label}</dt> : null}
                {stat.value ? (
                  <dd className="mt-2 font-serif text-2xl text-[color:var(--ink)] md:text-3xl">
                    {stat.value}
                  </dd>
                ) : null}
                {stat.description ? (
                  <dd className="mt-2 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                    {stat.description}
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
