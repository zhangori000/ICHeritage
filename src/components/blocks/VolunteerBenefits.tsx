"use client";

import * as React from "react";
import { stegaClean } from "next-sanity";

type VolunteerBenefitsBlock = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: string | null;
  benefits?: Array<{
    _key?: string;
    /** Kept for the Sanity schema; the editorial layout renders no icons. */
    icon?: string | null;
    /** Kept for the Sanity schema; the editorial layout has a single tone. */
    tone?: "primary" | "secondary" | "accent" | null;
    title?: string | null;
    description?: string | null;
    points?: Array<string | null> | null;
  }> | null;
  testimonialsHeading?: string | null;
  testimonialsIntro?: string | null;
  testimonials?: Array<{
    _key?: string;
    quote?: string | null;
    name?: string | null;
    role?: string | null;
  }> | null;
};

const clean = (value?: string | null) => (value ? stegaClean(value) : "");

// Columns split by hairlines; stacks to hairline rows below md. Written out
// in full per column count so Tailwind can see every class.
const columnBase =
  "border-b border-[color:var(--hairline)] py-6 md:border-b-0 md:py-0 md:pt-8";
const columnClassFor = (cols: number) => {
  if (cols >= 3) {
    return `${columnBase} md:border-r md:pr-8 md:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(3n)]:pr-0 md:[&:not(:nth-child(3n+1))]:pl-8 md:[&:nth-child(n+4)]:mt-8 md:[&:nth-child(n+4)]:border-t`;
  }
  if (cols === 2) {
    return `${columnBase} md:border-r md:pr-8 md:[&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:pr-0 md:[&:not(:nth-child(2n+1))]:pl-8 md:[&:nth-child(n+3)]:mt-8 md:[&:nth-child(n+3)]:border-t`;
  }
  return columnBase;
};

export function VolunteerBenefits(block: VolunteerBenefitsBlock) {
  const {
    sectionId,
    heading,
    intro,
    benefits,
    testimonialsHeading,
    testimonialsIntro,
    testimonials,
  } = block;

  const anchor = sectionId?.trim() ? sectionId.trim() : undefined;
  const benefitCards = Array.isArray(benefits) ? benefits : [];
  const stories = Array.isArray(testimonials)
    ? testimonials.filter(
        (story) => clean(story?.quote) || clean(story?.name) || clean(story?.role)
      )
    : [];
  const hasStories = Boolean(testimonialsHeading || testimonialsIntro || stories.length > 0);

  const gridCols = (count: number) =>
    count >= 3 ? "md:grid-cols-3" : count === 2 ? "md:grid-cols-2" : "md:grid-cols-1";

  return (
    <section id={anchor} className="bg-[color:var(--paper-deep)] py-20 md:py-28">
      <div className="wrap">
        {heading || intro ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end">
            {heading ? (
              <h2 className="display text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
                {clean(heading)}
              </h2>
            ) : null}
            {intro ? (
              <p className="max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)] md:justify-self-end">
                {clean(intro)}
              </p>
            ) : null}
          </div>
        ) : null}

        {benefitCards.length > 0 ? (
          <ul
            className={[
              "grid grid-cols-1 border-t border-[color:var(--ink)]",
              gridCols(benefitCards.length),
              heading || intro ? "mt-14" : "",
            ].join(" ")}
          >
            {benefitCards.map((card, index) => {
              const { _key, title, description, points } = card ?? {};
              const pointList = Array.isArray(points)
                ? points.map((item) => clean(item)).filter(Boolean)
                : [];

              return (
                <li key={_key ?? `benefit-${index}`} className={columnClassFor(benefitCards.length)}>
                  {title ? (
                    <h3 className="font-serif text-2xl text-[color:var(--ink)]">{clean(title)}</h3>
                  ) : null}
                  {description ? (
                    <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
                      {clean(description)}
                    </p>
                  ) : null}
                  {pointList.length > 0 ? (
                    <ul className="mt-6">
                      {pointList.map((point, pointIndex) => (
                        <li
                          key={`${_key ?? index}-point-${pointIndex}`}
                          className="border-t border-[color:var(--hairline)] py-2.5 text-sm leading-relaxed text-[color:var(--ink-muted)]"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}

        {hasStories ? (
          <div className={benefitCards.length > 0 || heading || intro ? "mt-20" : ""}>
            {testimonialsHeading || testimonialsIntro ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end">
                {testimonialsHeading ? (
                  <h3 className="font-serif text-3xl text-[color:var(--ink)] md:text-4xl">
                    {clean(testimonialsHeading)}
                  </h3>
                ) : null}
                {testimonialsIntro ? (
                  <p className="max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)] md:justify-self-end">
                    {clean(testimonialsIntro)}
                  </p>
                ) : null}
              </div>
            ) : null}

            {stories.length > 0 ? (
              <ul
                className={[
                  "grid grid-cols-1 border-t border-[color:var(--ink)]",
                  gridCols(stories.length),
                  testimonialsHeading || testimonialsIntro ? "mt-10" : "",
                ].join(" ")}
              >
                {stories.map((story, storyIndex) => {
                  const quote = clean(story?.quote);
                  const name = clean(story?.name);
                  const role = clean(story?.role);

                  return (
                    <li key={story?._key ?? `testimonial-${storyIndex}`} className={columnClassFor(stories.length)}>
                      <figure>
                        {quote ? (
                          <blockquote className="font-serif text-xl leading-snug text-[color:var(--ink)] md:text-2xl">
                            <p>&ldquo;{quote}&rdquo;</p>
                          </blockquote>
                        ) : null}
                        {name || role ? (
                          <figcaption className="mt-6">
                            {name ? (
                              <div className="text-sm font-medium text-[color:var(--ink)]">{name}</div>
                            ) : null}
                            {role ? <div className="eyebrow mt-2">{role}</div> : null}
                          </figcaption>
                        ) : null}
                      </figure>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
