"use client";

import * as React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { stegaClean } from "next-sanity";

type Episode = {
  _key?: string;
  episodeLabel?: string | null;
  duration?: string | null;
  publishedAt?: string | null;
  title?: string | null;
  guestName?: string | null;
  guestTitle?: string | null;
  programTag?: string | null;
  summary?: string | null;
  heroImage?: {
    asset?: { _ref?: string } | null;
    alt?: string | null;
  } | null;
  youtubeUrl?: string | null;
  spotifyUrl?: string | null;
  appleUrl?: string | null;
};

type PlatformLink = {
  _key?: string;
  label?: string | null;
  href?: string | null;
  platform?: "spotify" | "apple" | "youtube" | "other" | null;
};

type PodcastHighlightsProps = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: string | null;
  episodes?: Episode[] | null;
  platformHeading?: string | null;
  platforms?: PlatformLink[] | null;
  viewAllCta?: {
    label?: string | null;
    href?: string | null;
  } | null;
} & Record<string, unknown>;

function clean(value?: string | null) {
  return value ? stegaClean(value) : "";
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const formatted = dayjs(value);
  return formatted.isValid() ? formatted.format("MMMM D, YYYY") : value;
}

/**
 * Podcast episodes as rows (episode label, title and guest, date), platform
 * links as underlined text links, "view all" as a square button.
 */
export function PodcastHighlights({
  sectionId,
  heading,
  intro,
  episodes,
  platformHeading,
  platforms,
  viewAllCta,
}: PodcastHighlightsProps) {
  const anchor = sectionId?.trim() ? sectionId.trim() : undefined;
  const episodeRows = Array.isArray(episodes) ? episodes : [];
  const platformLinks = Array.isArray(platforms) ? platforms : [];
  const safeHeading = clean(heading);
  const safeIntro = clean(intro);
  const safePlatformHeading = clean(platformHeading);
  const safeViewAllLabel = clean(viewAllCta?.label);

  return (
    <section id={anchor} className="bg-[color:var(--paper)] py-20 md:py-28">
      <div className="wrap">
        {safeHeading || safeIntro ? (
          <div className="grid gap-6 md:grid-cols-2 md:items-end">
            {safeHeading ? (
              <h2 className="display text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
                {safeHeading}
              </h2>
            ) : null}
            {safeIntro ? (
              <p className="max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)] md:justify-self-end">
                {safeIntro}
              </p>
            ) : null}
          </div>
        ) : null}

        {episodeRows.length > 0 ? (
          <ul className="mt-12 border-t border-[color:var(--ink)]">
            {episodeRows.map((episode, index) => {
              const publishDate = formatDate(episode.publishedAt);
              const title = clean(episode.title);
              const episodeLabel = clean(episode.episodeLabel);
              const duration = clean(episode.duration);
              const guestName = clean(episode.guestName);
              const guestTitle = clean(episode.guestTitle);
              const programTag = clean(episode.programTag);
              const summary = clean(episode.summary);
              const youtubeUrl = episode.youtubeUrl?.trim();
              const spotifyUrl = episode.spotifyUrl?.trim();
              const appleUrl = episode.appleUrl?.trim();
              const meta = [publishDate, duration].filter(Boolean).join(" · ");
              const guest = [guestName, guestTitle].filter(Boolean).join(", ");
              const hasLinks = Boolean(youtubeUrl || spotifyUrl || appleUrl);

              return (
                <li
                  key={episode._key ?? `${episode.title ?? "episode"}-${index}`}
                  className="row-hover grid grid-cols-1 gap-2 border-b border-[color:var(--hairline)] py-6 md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-baseline md:gap-6"
                >
                  <div className="flex flex-col gap-2">
                    {episodeLabel ? <span className="eyebrow">{episodeLabel}</span> : null}
                    {programTag ? <span className="eyebrow">{programTag}</span> : null}
                  </div>

                  <div className="min-w-0">
                    {title ? (
                      <h3 className="font-serif text-2xl leading-tight text-[color:var(--ink)] md:text-[28px]">
                        {title}
                      </h3>
                    ) : null}
                    {guest ? (
                      <p className="mt-2 text-sm text-[color:var(--ink-soft)]">
                        <span className="text-[color:var(--ink-muted)]">Guest </span>
                        {guest}
                      </p>
                    ) : null}
                    {summary ? (
                      <p className="mt-2 line-clamp-1 text-[color:var(--ink-muted)]">{summary}</p>
                    ) : null}
                    {hasLinks ? (
                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                        {youtubeUrl ? (
                          <a
                            href={youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm"
                          >
                            Listen now
                          </a>
                        ) : null}
                        {spotifyUrl ? (
                          <a
                            href={spotifyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="textlink text-sm"
                          >
                            Spotify
                          </a>
                        ) : null}
                        {appleUrl ? (
                          <a
                            href={appleUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="textlink text-sm"
                          >
                            Apple Podcasts
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  {meta ? (
                    <span className="text-sm whitespace-nowrap text-[color:var(--ink-muted)]">
                      {meta}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}

        {safePlatformHeading || platformLinks.length > 0 ? (
          <div className="mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-4 border-t border-[color:var(--hairline)] pt-6">
            {safePlatformHeading ? (
              <h3 className="eyebrow eyebrow-rule">{safePlatformHeading}</h3>
            ) : null}
            {platformLinks.map((platform, index) => (
              <a
                key={platform._key ?? `${platform.label ?? "platform"}-${index}`}
                href={(platform.href ?? "").trim() || "#"}
                target="_blank"
                rel="noreferrer"
                className="textlink"
              >
                {clean(platform.label) || "Platform"}
              </a>
            ))}
          </div>
        ) : null}

        {safeViewAllLabel ? (
          <div className="mt-10">
            {(() => {
              const href = viewAllCta?.href?.trim();
              const isExternal = href ? /^(https?:\/\/)/i.test(href) : false;
              if (href && isExternal) {
                return (
                  <a href={href} target="_blank" rel="noreferrer" className="btn">
                    {safeViewAllLabel}
                  </a>
                );
              }
              return (
                <Link href={href || "#"} prefetch={false} className="btn">
                  {safeViewAllLabel}
                </Link>
              );
            })()}
          </div>
        ) : null}
      </div>
    </section>
  );
}
