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
    <section id={anchor} className="bg-[color:var(--primary)] py-20 text-[color:var(--primary-foreground)]">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-16 text-center">
          <div className="space-y-12">
            {heading ? (
              <h2 className="font-serif text-3xl font-bold md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            ) : null}

            {mission ? (
              <blockquote className="relative">
                <span className="absolute -top-6 -left-4 text-7xl font-serif leading-none text-[color:var(--primary-foreground)]/20">
                  “
                </span>
                <span className="absolute -bottom-10 -right-4 text-7xl font-serif leading-none text-[color:var(--primary-foreground)]/20">
                  ”
                </span>
                <p className="px-6 font-serif text-2xl font-medium leading-relaxed text-pretty md:px-12 md:text-3xl lg:text-4xl">
                  {mission}
                </p>
              </blockquote>
            ) : null}
          </div>

          {pillarItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {pillarItems.map((pillar, index) => (
                <article key={pillar._key ?? `${pillar.title ?? "pillar"}-${index}`} className="space-y-4">
                  {pillar.title ? (
                    <h3 className="font-serif text-xl font-bold md:text-2xl">
                      {pillar.title}
                    </h3>
                  ) : null}
                  {pillar.description ? (
                    <p className="leading-relaxed text-[color:var(--primary-foreground)]/90">
                      {pillar.description}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}

          {(visionHeading || vision) && (
            <div className="space-y-6 border-t border-[color:var(--primary-foreground)]/20 pt-12">
              {visionHeading ? (
                <h3 className="font-serif text-2xl font-bold md:text-3xl">
                  {visionHeading}
                </h3>
              ) : null}
              {vision ? (
                <p className="text-xl leading-relaxed text-[color:var(--primary-foreground)]/90 md:text-2xl">
                  {vision}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
