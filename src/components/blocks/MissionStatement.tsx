"use client";

import * as React from "react";

type Pillar = {
  _key?: string;
  title?: string | null;
  description?: string | null;
};

type MissionStatementProps = {
  sectionId?: string | null;
  heading?: string | null;
  mission?: string | null;
  pillars?: Pillar[] | null;
  visionHeading?: string | null;
  vision?: string | null;
} & Record<string, unknown>;

export function MissionStatement({
  sectionId,
  heading,
  mission,
  pillars,
  visionHeading,
  vision,
}: MissionStatementProps) {
  const anchor = sectionId?.trim() ? sectionId.trim() : undefined;
  const pillarItems = Array.isArray(pillars)
    ? pillars.filter((pillar): pillar is Pillar => Boolean(pillar))
    : [];

  return (
    <section id={anchor} className="band py-20 md:py-28">
      <div className="wrap">
        {/* Mission: narrow label column, wide statement column. */}
        {(heading || mission) && (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4 lg:col-span-3">
              {heading ? (
                <h2 className="font-serif text-2xl text-[color:var(--band-text)]">
                  {heading}
                </h2>
              ) : null}
              <span
                aria-hidden
                className="font-sc mt-6 block text-[56px] leading-none text-[color:var(--seal)]"
              >
                传承
              </span>
            </div>

            {mission ? (
              <blockquote className="md:col-span-8 lg:col-span-9 font-serif font-light text-3xl leading-[1.15] tracking-tight text-[color:var(--band-text)] md:text-4xl lg:text-5xl">
                {mission}
              </blockquote>
            ) : null}
          </div>
        )}

        {/* Pillars: three columns divided by hairlines. */}
        {pillarItems.length > 0 ? (
          <div className="mt-16 grid grid-cols-1 border-t border-[color:var(--band-rule)] md:mt-20 md:grid-cols-3">
            {pillarItems.map((pillar, index) => (
              <article
                key={pillar._key ?? `${pillar.title ?? "pillar"}-${index}`}
                className="border-b border-[color:var(--band-rule)] py-8 last:border-b-0 md:border-b-0 md:border-r md:pr-8 md:pl-8 md:first:pl-0 md:last:border-r-0"
              >
                {pillar.title ? (
                  <h3 className="font-serif text-2xl text-[color:var(--band-text)]">
                    {pillar.title}
                  </h3>
                ) : null}
                {pillar.description ? (
                  <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--band-muted)]">
                    {pillar.description}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        {/* Vision: same two-column rhythm under a rule. */}
        {(visionHeading || vision) && (
          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-[color:var(--band-rule)] pt-10 md:mt-20 md:grid-cols-12 md:gap-12 md:pt-12">
            {visionHeading ? (
              <h3 className="font-serif text-2xl text-[color:var(--band-text)] md:col-span-4 lg:col-span-3">
                {visionHeading}
              </h3>
            ) : null}
            {vision ? (
              <p className="font-serif font-light text-2xl leading-snug text-[color:var(--band-text)] md:col-span-8 md:text-3xl lg:col-span-9">
                {vision}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
