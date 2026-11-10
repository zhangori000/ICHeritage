"use client";

import * as React from "react";
import Link from "next/link";
import { stegaClean } from "next-sanity";

type VolunteerTracksBlock = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: string | null;
  tracks?: Array<{
    _key?: string;
    badgeLabel?: string | null;
    /** Kept for the Sanity schema; the editorial layout has a single tone. */
    tone?: "accent" | "muted" | "primary" | "secondary" | null;
    /** Kept for the Sanity schema; the editorial layout renders no icons. */
    icon?: string | null;
    title?: string | null;
    description?: string | null;
    keyAreasHeading?: string | null;
    keyAreas?: Array<string | null> | null;
    commitmentHeading?: string | null;
    commitmentItems?: Array<{
      _key?: string;
      /** Kept for the Sanity schema; the editorial layout renders no icons. */
      icon?: string | null;
      text?: string | null;
    }> | null;
    benefitsHeading?: string | null;
    benefits?: Array<string | null> | null;
  }> | null;
  callout?: {
    heading?: string | null;
    body?: string | null;
    links?: Array<{
      _key?: string;
      label?: string | null;
      href?: string | null;
    }> | null;
  } | null;
};

const clean = (value?: string | null) => (value ? stegaClean(value) : "");

const isInternalHref = (href?: string | null) => (href ? href.startsWith("/") : false);

export function VolunteerTracks(block: VolunteerTracksBlock) {
  const { sectionId, heading, intro, tracks, callout } = block;
  const anchor = sectionId?.trim() ? sectionId.trim() : undefined;
  const trackList = Array.isArray(tracks) ? tracks : [];
  const hasCallout = Boolean(
    callout && (callout.heading || callout.body || callout.links?.length)
  );

  return (
    <section id={anchor} className="bg-[color:var(--paper)] py-20 md:py-28">
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

        {trackList.length > 0 ? (
          <div
            className={[
              "grid grid-cols-1 border-t border-[color:var(--ink)] lg:grid-cols-2",
              heading || intro ? "mt-14" : "",
            ].join(" ")}
          >
            {trackList.map((track, index) => {
              const {
                _key,
                badgeLabel,
                title,
                description,
                keyAreasHeading,
                keyAreas,
                commitmentHeading,
                commitmentItems,
                benefitsHeading,
                benefits,
              } = track ?? {};

              const cleanedTitle = clean(title);
              const cleanedDescription = clean(description);
              const keyAreasList = Array.isArray(keyAreas)
                ? keyAreas.map((area) => clean(area)).filter(Boolean)
                : [];
              const commitmentList = Array.isArray(commitmentItems)
                ? commitmentItems.filter((item) => clean(item?.text))
                : [];
              const benefitsList = Array.isArray(benefits)
                ? benefits.map((item) => clean(item)).filter(Boolean)
                : [];

              return (
                <article
                  key={_key ?? `track-${index}`}
                  data-track-card
                  className="border-b border-[color:var(--hairline)] py-10 lg:border-b-0 lg:py-12 lg:odd:border-r lg:odd:pr-12 lg:even:pl-12 lg:[&:nth-child(n+3)]:border-t"
                >
                  {badgeLabel ? (
                    <p className="eyebrow text-[color:var(--seal)]">{clean(badgeLabel)}</p>
                  ) : null}
                  {cleanedTitle ? (
                    <h3 className="mt-4 font-serif text-3xl text-[color:var(--ink)] md:text-4xl">
                      {cleanedTitle}
                    </h3>
                  ) : null}
                  {cleanedDescription ? (
                    <p className="mt-5 max-w-lg text-lg leading-relaxed text-[color:var(--ink-soft)]">
                      {cleanedDescription}
                    </p>
                  ) : null}

                  {keyAreasList.length > 0 ? (
                    <div className="mt-10">
                      {keyAreasHeading ? (
                        <h4 className="eyebrow">{clean(keyAreasHeading)}</h4>
                      ) : null}
                      <ul className="mt-4 grid grid-cols-1 gap-x-8 md:grid-cols-2">
                        {keyAreasList.map((area, areaIndex) => (
                          <li
                            key={`${_key}-keyarea-${areaIndex}`}
                            className="border-t border-[color:var(--hairline)] py-3 text-[15px] leading-relaxed text-[color:var(--ink)]"
                          >
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {commitmentList.length > 0 ? (
                    <div className="mt-10">
                      {commitmentHeading ? (
                        <h4 className="eyebrow">{clean(commitmentHeading)}</h4>
                      ) : null}
                      <ul className="mt-4">
                        {commitmentList.map((item, itemIndex) => (
                          <li
                            key={`${_key}-commitment-${item?._key ?? itemIndex}`}
                            className="border-t border-[color:var(--hairline)] py-3 text-[15px] leading-relaxed text-[color:var(--ink-soft)]"
                          >
                            {clean(item?.text)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {benefitsList.length > 0 ? (
                    <div className="mt-10">
                      {benefitsHeading ? (
                        <h4 className="eyebrow">{clean(benefitsHeading)}</h4>
                      ) : null}
                      <ul className="mt-4">
                        {benefitsList.map((benefit, benefitIndex) => (
                          <li
                            key={`${_key}-benefit-${benefitIndex}`}
                            className="border-t border-[color:var(--hairline)] py-3 text-[15px] leading-relaxed text-[color:var(--ink-soft)]"
                          >
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}

        {hasCallout && callout ? (
          <div
            className={[
              "grid grid-cols-1 gap-x-16 gap-y-8 border-t border-[color:var(--ink)] pt-10 lg:grid-cols-[minmax(0,3fr)_auto] lg:items-end",
              trackList.length > 0 || heading || intro ? "mt-16" : "",
            ].join(" ")}
          >
            <div>
              {callout.heading ? (
                <h3 className="font-serif text-2xl text-[color:var(--ink)] md:text-3xl">
                  {clean(callout.heading)}
                </h3>
              ) : null}
              {callout.body ? (
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[color:var(--ink-soft)]">
                  {clean(callout.body)}
                </p>
              ) : null}
            </div>
            {Array.isArray(callout.links) && callout.links.length > 0 ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {callout.links.slice(0, 2).map((link, linkIndex) => {
                  const label = clean(link?.label);
                  if (!label) return null;
                  const rawHref = link?.href ?? "";
                  const href = rawHref && rawHref.startsWith("#") ? "/volunteer" : rawHref;
                  const className = linkIndex === 0 ? "btn btn-primary" : "btn";
                  if (isInternalHref(href)) {
                    return (
                      <Link key={`${link?._key ?? linkIndex}-cta`} href={href} className={className}>
                        {label}
                      </Link>
                    );
                  }
                  return (
                    <a
                      key={`${link?._key ?? linkIndex}-cta`}
                      href={href || "#"}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer" : undefined}
                      className={className}
                    >
                      {label}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
