"use client";

import * as React from "react";

type Story = {
  _key?: string;
  quote?: string | null;
  name?: string | null;
  role?: string | null;
  location?: string | null;
  program?: string | null;
};

type Stat = {
  _key?: string;
  value?: string | null;
  label?: string | null;
  /** Kept for the Sanity schema; the fact row renders every value in ink. */
  color?: "primary" | "secondary" | "accent" | null;
};

type StoriesImpactProps = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: string | null;
  stories?: Story[] | null;
  statsCard?: {
    heading?: string | null;
    description?: string | null;
    stats?: Stat[] | null;
  } | null;
} & Record<string, unknown>;

export function StoriesImpact({
  sectionId,
  heading,
  intro,
  stories,
  statsCard,
}: StoriesImpactProps) {
  const anchor = sectionId?.trim() ? sectionId.trim() : undefined;
  const storyItems = Array.isArray(stories) ? stories : [];
  const stats = Array.isArray(statsCard?.stats) ? statsCard?.stats ?? [] : [];

  return (
    <section id={anchor} className="py-20 md:py-28">
      <div className="wrap">
        {/* Heading left, intro right. */}
        {(heading || intro) && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            {heading ? (
              <h2 className="display text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
                {heading}
              </h2>
            ) : null}
            {intro ? (
              <p className="max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)] md:justify-self-end">
                {intro}
              </p>
            ) : null}
          </div>
        )}

        {/* Stories: a list of rows divided by hairlines. */}
        {storyItems.length > 0 ? (
          <ul className="mt-12 list-none border-t border-[color:var(--ink)] p-0 md:mt-16">
            {storyItems.map((story, index) => {
              const where = [story.role, story.location].filter(Boolean).join(", ");
              return (
                <li
                  key={story._key ?? `${story.name ?? "story"}-${index}`}
                  className="border-b border-[color:var(--hairline)]"
                >
                  <figure className="grid grid-cols-1 gap-6 py-8 md:grid-cols-12 md:gap-12 md:py-10">
                    {story.quote ? (
                      <blockquote className="font-serif text-xl font-light leading-snug text-[color:var(--ink)] md:col-span-8 md:text-2xl">
                        {story.quote}
                      </blockquote>
                    ) : null}

                    {(story.name || where || story.program) && (
                      <figcaption className="text-sm md:col-span-4">
                        {story.name ? (
                          <div className="font-medium text-[color:var(--ink)]">{story.name}</div>
                        ) : null}
                        {where ? (
                          <div className="mt-1 text-[color:var(--ink-muted)]">{where}</div>
                        ) : null}
                        {story.program ? (
                          <div className="eyebrow mt-3">{story.program}</div>
                        ) : null}
                      </figcaption>
                    )}
                  </figure>
                </li>
              );
            })}
          </ul>
        ) : null}

        {/* Impact numbers: a fact row under a rule. */}
        {statsCard ? (
          <div className="mt-16 md:mt-20">
            {statsCard.heading ? <h3 className="eyebrow">{statsCard.heading}</h3> : null}

            {stats.length > 0 ? (
              <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
                {stats.map((stat, statIndex) => (
                  <div
                    key={stat._key ?? `${stat.label ?? "stat"}-${statIndex}`}
                    className="border-t border-[color:var(--hairline)] pt-3"
                  >
                    {stat.label ? <dt className="eyebrow">{stat.label}</dt> : null}
                    {stat.value ? (
                      <dd className="mt-2 font-serif text-2xl text-[color:var(--ink)] md:text-3xl">
                        {stat.value}
                      </dd>
                    ) : null}
                  </div>
                ))}
              </dl>
            ) : null}

            {statsCard.description ? (
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-[color:var(--ink-muted)]">
                {statsCard.description}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
