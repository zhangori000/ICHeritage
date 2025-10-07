"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { stegaClean } from "next-sanity";

import { urlFor } from "@/sanity/lib/image";

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

const placeholderImage = "/Gemini_Generated_Image_podcast_default.png";

const platformIcon = (type?: string | null) => {
  switch (type) {
    case "spotify":
    case "apple":
    case "youtube":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v5a3 3 0 0 0 6 0v-5a1 1 0 0 1-1-1 2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
          <path d="M15 5a6 6 0 0 1 6 6v7a3 3 0 0 1-6 0" />
        </svg>
      );
  }
};

const externalIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden
  >
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

const musicIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-[color:var(--primary)]"
    aria-hidden
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const playIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-[color:var(--primary-foreground)]"
    aria-hidden
  >
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

const playSmallIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden
  >
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

function clean(value?: string | null) {
  return value ? stegaClean(value) : "";
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const formatted = dayjs(value);
  return formatted.isValid() ? formatted.format("M/D/YYYY") : value;
}

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
  const episodeCards = Array.isArray(episodes) ? episodes : [];
  const platformLinks = Array.isArray(platforms) ? platforms : [];
  const safeHeading = clean(heading);
  const safeIntro = clean(intro);
  const safePlatformHeading = clean(platformHeading);
  const safeViewAllLabel = clean(viewAllCta?.label);

  return (
    <section id={anchor} className="bg-[color:var(--muted)]/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-16">
          <div className="text-center">
            {safeHeading ? (
              <div className="mb-4 flex items-center justify-center gap-3">
                {musicIcon}
                <h2 className="font-serif text-3xl font-medium text-[color:var(--foreground)] md:text-4xl lg:text-5xl">
                  {safeHeading}
                </h2>
              </div>
            ) : null}
            {safeIntro ? (
              <p className="mx-auto max-w-3xl text-lg text-[color:var(--muted-foreground)] md:text-xl">
                {safeIntro}
              </p>
            ) : null}
          </div>

          {episodeCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {episodeCards.map((episode, index) => {
                const imageUrl = episode.heroImage?.asset?._ref
                  ? urlFor(episode.heroImage)
                      .width(400)
                      .height(400)
                      .fit("crop")
                      .url()
                  : placeholderImage;
                const imageAlt =
                  clean(episode.heroImage?.alt) ||
                  clean(episode.title) ||
                  "Podcast episode";
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

                return (
                  <article
                    key={
                      episode._key ?? `${episode.title ?? "episode"}-${index}`
                    }
                    className="group flex h-full flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative mx-6 overflow-hidden rounded-lg">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={imageAlt}
                          fill
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <span className="rounded-full bg-[color:var(--primary)] p-4">
                            {playIcon}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 px-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[color:var(--muted-foreground)]">
                          {episodeLabel ? (
                            <span className="inline-flex items-center rounded-full border border-[color:var(--border)] px-2.5 py-0.5 font-semibold text-[color:var(--foreground)]">
                              {episodeLabel}
                            </span>
                          ) : null}
                          <div className="flex flex-wrap items-center gap-4">
                            {duration ? (
                              <span className="flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-3 w-3"
                                  aria-hidden
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span>{duration}</span>
                              </span>
                            ) : null}
                            {publishDate ? (
                              <span className="flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-3 w-3"
                                  aria-hidden
                                >
                                  <path d="M8 2v4" />
                                  <path d="M16 2v4" />
                                  <rect
                                    width="18"
                                    height="18"
                                    x="3"
                                    y="4"
                                    rx="2"
                                  />
                                  <path d="M3 10h18" />
                                </svg>
                                <span>{publishDate}</span>
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {title ? (
                          <h3 className="font-serif text-xl font-semibold leading-tight text-[color:var(--foreground)] transition-colors group-hover:text-[color:var(--primary)]">
                            {title}
                          </h3>
                        ) : null}

                        {(guestName || guestTitle || programTag) && (
                          <div className="space-y-1 text-sm text-[color:var(--muted-foreground)]">
                            {guestName ? (
                              <p>
                                <span className="font-medium">Guest: </span>
                                {guestName}
                              </p>
                            ) : null}
                            {guestTitle ? (
                              <p className="text-xs">{guestTitle}</p>
                            ) : null}
                            {programTag ? (
                              <p className="text-xs font-medium text-[color:var(--primary)]">
                                {programTag}
                              </p>
                            ) : null}
                          </div>
                        )}
                      </div>

                      {summary ? (
                        <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                          {summary}
                        </p>
                      ) : null}

                      <div className="flex flex-wrap gap-2">
                        {spotifyUrl ? (
                          <a
                            href={spotifyUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-1.5 text-xs font-medium transition-all hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)]"
                          >
                            {platformIcon("spotify")}
                            <span>Spotify</span>
                            {externalIcon}
                          </a>
                        ) : null}
                        {appleUrl ? (
                          <a
                            href={appleUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-1.5 text-xs font-medium transition-all hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)]"
                          >
                            {platformIcon("apple")}
                            <span>Apple</span>
                            {externalIcon}
                          </a>
                        ) : null}
                      </div>

                      {youtubeUrl ? (
                        <a
                          href={youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-2 text-sm font-medium transition-all hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)]"
                        >
                          {playSmallIcon}
                          Listen Now
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          {(platformHeading || platformLinks.length > 0) && (
            <div className="text-center">
              {safePlatformHeading ? (
                <h3 className="mb-5 font-serif text-3xl font-medium text-[color:var(--foreground)] md:text-2xl lg:text-2xl">
                  {safePlatformHeading}
                </h3>
              ) : null}
              {platformLinks.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4">
                  {platformLinks.map((platform, index) => (
                    <a
                      key={
                        platform._key ??
                        `${platform.label ?? "platform"}-${index}`
                      }
                      href={(platform.href ?? "").trim() || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-6 py-2 text-sm font-medium transition-all hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)]"
                    >
                      {platformIcon(platform.platform)}
                      <span>{clean(platform.label) || "Platform"}</span>
                      {externalIcon}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          {safeViewAllLabel ? (
            <div className="text-center">
              {(() => {
                const href = viewAllCta?.href?.trim();
                const isExternal = href ? /^(https?:\/\/)/i.test(href) : false;
                if (href && isExternal) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-transparent px-8 py-2 text-sm font-medium transition-all hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)]"
                    >
                      {safeViewAllLabel}
                    </a>
                  );
                }
                return (
                  <Link
                    href={href || "#"}
                    prefetch={false}
                    className="inline-flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-transparent px-8 py-2 text-sm font-medium transition-all hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)]"
                  >
                    {safeViewAllLabel}
                  </Link>
                );
              })()}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
