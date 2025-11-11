"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { stegaClean } from "next-sanity";

import { urlFor } from "@/sanity/lib/image";

type SanitySlugValue = string | { current?: string | null } | null | undefined;

type VolunteerOpportunityCard = {
  _id: string;
  title?: string | null;
  slug?: SanitySlugValue;
  summary?: string | null;
  trackLabel?: string | null;
  commitmentSummary?: string | null;
  location?: string | null;
  applyUrl?: string | null;
  isUrgent?: boolean | null;
  isRemoteFriendly?: boolean | null;
  heroImage?: {
    asset?: { _ref?: string } | null;
    alt?: string | null;
  } | null;
};

type VolunteersDirectoryBlock = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: string | null;
  searchPlaceholder?: string | null;
  opportunities?: VolunteerOpportunityCard[] | null;
};

const placeholderImage = "/Gemini_Generated_Image_volunteer_default.png";

const clean = (value?: string | null) => (value ? stegaClean(value) : "");

const getTrackKey = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function VolunteersDirectory({
  sectionId,
  heading,
  intro,
  searchPlaceholder,
  opportunities,
}: VolunteersDirectoryBlock) {
  const safeOpportunities = React.useMemo(
    () =>
      Array.isArray(opportunities)
        ? opportunities.filter(
            (opportunity): opportunity is VolunteerOpportunityCard =>
              Boolean(opportunity && typeof opportunity === "object" && opportunity._id)
          )
        : [],
    [opportunities]
  );

  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTrack, setActiveTrack] = React.useState<string>("all");

  const trackFilters = React.useMemo(() => {
    const map = new Map<string, string>();
    safeOpportunities.forEach((opportunity) => {
      const label = clean(opportunity?.trackLabel);
      if (!label) return;
      const key = getTrackKey(label);
      if (!map.has(key)) {
        map.set(key, label);
      }
    });
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [safeOpportunities]);

  const filteredOpportunities = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return safeOpportunities.filter((opportunity) => {
      if (!opportunity) return false;

      const title = clean(opportunity.title);
      if (!title) return false;

      const trackLabel = clean(opportunity.trackLabel);
      const trackKey = trackLabel ? getTrackKey(trackLabel) : "";
      if (activeTrack !== "all" && trackKey !== activeTrack) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        title,
        clean(opportunity.summary),
        trackLabel,
        clean(opportunity.location),
        clean(opportunity.commitmentSummary),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [activeTrack, safeOpportunities, searchTerm]);

  return (
    <section
      id={clean(sectionId)}
      className="relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]"
    >
      <div className="absolute inset-0 bg-[color:var(--accent)]/5" aria-hidden />
      <div className="relative isolate px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              {heading ? (
                <h2 className="font-serif text-3xl text-[color:var(--foreground)]">{clean(heading)}</h2>
              ) : null}
              {intro ? (
                <p className="mt-3 max-w-2xl text-sm text-[color:var(--muted-foreground)]">
                  {clean(intro)}
                </p>
              ) : null}
            </div>

            <label className="flex w-full max-w-sm items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-[color:var(--muted-foreground)]"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={clean(searchPlaceholder) || "Search volunteer roles"}
                className="w-full bg-transparent text-sm text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted-foreground)]"
              />
            </label>
          </div>

          {trackFilters.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTrack("all")}
                className={[
                  "inline-flex items-center rounded-full border px-4 py-1.5 text-sm transition-colors",
                  activeTrack === "all"
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)]/10 text-[color:var(--primary)]"
                    : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]",
                ].join(" ")}
              >
                All tracks
              </button>
              {trackFilters.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTrack(key)}
                  className={[
                    "inline-flex items-center rounded-full border px-4 py-1.5 text-sm transition-colors",
                    activeTrack === key
                      ? "border-[color:var(--primary)] bg-[color:var(--primary)]/10 text-[color:var(--primary)]"
                      : "border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opportunity) => {
                const title = clean(opportunity.title);
                const summary = clean(opportunity.summary);
                const track = clean(opportunity.trackLabel);
                const location = clean(opportunity.location);
                const estimatedTime = clean(opportunity.commitmentSummary);
                const urgent = Boolean(opportunity.isUrgent);
                const remoteFriendly = Boolean(opportunity.isRemoteFriendly);
                const applyHref = clean(opportunity.applyUrl).trim();
                const applyHrefIsInternal = applyHref.startsWith("/");

                const heroImage =
                  opportunity.heroImage?.asset?._ref
                    ? {
                        src: urlFor(opportunity.heroImage).width(640).height(400).fit("crop").quality(80).url(),
                        alt: clean(opportunity.heroImage?.alt) || title,
                      }
                    : null;

                return (
                  <article
                    key={opportunity._id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] shadow-sm transition hover:shadow-lg"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-[color:var(--muted)]">
                      {heroImage ? (
                        <Image
                          src={heroImage.src}
                          alt={heroImage.alt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <Image
                          src={placeholderImage}
                          alt=""
                          fill
                          className="object-cover opacity-60 transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-5 p-6">
                      <div className="space-y-3">
                        {track ? (
                          <span className="inline-flex items-center rounded-full border border-[color:var(--border)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--foreground)]">
                            {track}
                          </span>
                        ) : null}
                        <div className="flex flex-wrap items-center gap-2">
                          {urgent ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3.5 w-3.5"
                                aria-hidden
                              >
                                <path d="m13 2-10 18h9l-1 6 10-18h-9z" />
                              </svg>
                              Urgent need
                            </span>
                          ) : null}
                          {remoteFriendly ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3.5 w-3.5"
                                aria-hidden
                              >
                                <path d="M2 10c0-1.886 0-2.828.586-3.414C3.172 6 4.114 6 6 6h12c1.886 0 2.828 0 3.414.586C22 7.172 22 8.114 22 10v2c0 1.886 0 2.828-.586 3.414C20.828 16 19.886 16 18 16H6c-1.886 0-2.828 0-3.414-.586C2 14.828 2 13.886 2 12z" />
                                <path d="M6 6V4" />
                                <path d="M18 6V4" />
                                <path d="M6 16v2" />
                                <path d="M18 16v2" />
                              </svg>
                              Remote friendly
                            </span>
                          ) : null}
                        </div>
                        <h3 className="font-serif text-2xl text-[color:var(--foreground)] transition-colors group-hover:text-[color:var(--primary)]">
                          {title}
                        </h3>
                        {summary ? (
                          <p className="text-sm text-[color:var(--muted-foreground)] line-clamp-3">{summary}</p>
                        ) : null}
                      </div>

                      <div className="mt-auto space-y-2 text-sm text-[color:var(--muted-foreground)]">
                        {estimatedTime ? (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                              aria-hidden
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{estimatedTime}</span>
                          </div>
                        ) : null}
                        {location ? (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                              aria-hidden
                            >
                              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{location}</span>
                          </div>
                        ) : null}
                      </div>

                      {applyHref ? (
                        <div className="pt-2">
                          {applyHrefIsInternal ? (
                            <Link
                              href={applyHref}
                              prefetch={false}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:bg-[color:var(--primary)]/90"
                            >
                              Apply Now
                            </Link>
                          ) : (
                            <a
                              href={applyHref}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:bg-[color:var(--primary)]/90"
                            >
                              Apply Now
                            </a>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--background)]/60 p-12 text-center text-sm text-[color:var(--muted-foreground)]">
                No volunteer opportunities match your current search. Try a different track or keyword.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
