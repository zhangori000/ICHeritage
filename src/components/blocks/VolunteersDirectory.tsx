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

const clean = (value?: string | null) => (value ? stegaClean(value) : "");

const getTrackKey = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const filterToggleClass = (active: boolean) =>
  [
    "cursor-pointer border-b pb-1 text-sm font-medium transition-colors",
    active
      ? "border-[color:var(--ink)] text-[color:var(--ink)]"
      : "border-transparent text-[color:var(--ink-muted)] hover:border-[color:var(--hairline)] hover:text-[color:var(--ink)]",
  ].join(" ");

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

  const searchInputId = React.useId();

  return (
    <section id={clean(sectionId) || undefined} className="bg-[color:var(--paper)] py-20 md:py-28">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end">
          <div>
            {heading ? (
              <h2 className="display text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
                {clean(heading)}
              </h2>
            ) : null}
            {intro ? (
              <p className="mt-6 max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)]">
                {clean(intro)}
              </p>
            ) : null}
          </div>

          <div className="w-full md:max-w-sm md:justify-self-end">
            <label htmlFor={searchInputId} className="eyebrow block">
              Search
            </label>
            <input
              id={searchInputId}
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={clean(searchPlaceholder) || "Search volunteer roles"}
              className="mt-3 w-full rounded-none border border-[color:var(--hairline)] bg-white px-4 py-3 text-[15px] text-[color:var(--ink)] placeholder:text-[color:var(--ink-muted)] focus:border-[color:var(--ink)] focus:outline-none"
            />
          </div>
        </div>

        {trackFilters.length > 0 ? (
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            <button
              type="button"
              onClick={() => setActiveTrack("all")}
              aria-pressed={activeTrack === "all"}
              className={filterToggleClass(activeTrack === "all")}
            >
              All tracks
            </button>
            {trackFilters.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTrack(key)}
                aria-pressed={activeTrack === key}
                className={filterToggleClass(activeTrack === key)}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        <div className={trackFilters.length > 0 ? "mt-6" : "mt-12"}>
          {filteredOpportunities.length > 0 ? (
            <ul className="border-t border-[color:var(--ink)]">
              {filteredOpportunities.map((opportunity) => {
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
                        src: urlFor(opportunity.heroImage).width(320).height(320).fit("crop").quality(80).url(),
                        alt: clean(opportunity.heroImage?.alt) || title,
                      }
                    : null;

                const metaParts = [estimatedTime, location].filter(Boolean);

                return (
                  <li
                    key={opportunity._id}
                    className="row-hover grid grid-cols-[5rem_minmax(0,1fr)] gap-x-6 gap-y-5 border-b border-[color:var(--hairline)] py-8 md:grid-cols-[7rem_minmax(0,1fr)_auto] md:gap-x-10"
                  >
                    {heroImage ? (
                      <div className="relative aspect-square w-20 overflow-hidden border border-[color:var(--ink)] md:w-28">
                        <Image
                          src={heroImage.src}
                          alt={heroImage.alt}
                          fill
                          sizes="(min-width: 768px) 112px, 80px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="photo-slot aspect-square w-20 md:w-28" aria-hidden />
                    )}

                    <div className="min-w-0">
                      {track || urgent || remoteFriendly ? (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          {track ? (
                            <span className="eyebrow text-[color:var(--pine)]">{track}</span>
                          ) : null}
                          {urgent ? (
                            <span className="eyebrow text-[color:var(--seal)]">Urgent need</span>
                          ) : null}
                          {remoteFriendly ? (
                            <span className="eyebrow text-[color:var(--pine)]">Remote friendly</span>
                          ) : null}
                        </div>
                      ) : null}
                      <h3
                        className={[
                          "font-serif text-2xl text-[color:var(--ink)] md:text-3xl",
                          track || urgent || remoteFriendly ? "mt-3" : "",
                        ].join(" ")}
                      >
                        {title}
                      </h3>
                      {summary ? (
                        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
                          {summary}
                        </p>
                      ) : null}
                      {metaParts.length > 0 ? (
                        <p className="mt-4 text-sm text-[color:var(--ink-muted)]">
                          {metaParts.map((part, index) => (
                            <React.Fragment key={`${opportunity._id}-meta-${index}`}>
                              {index > 0 ? <span aria-hidden> &middot; </span> : null}
                              <span>{part}</span>
                            </React.Fragment>
                          ))}
                        </p>
                      ) : null}
                    </div>

                    {applyHref ? (
                      <div className="col-start-2 md:col-start-3 md:self-center">
                        {applyHrefIsInternal ? (
                          <Link href={applyHref} prefetch={false} className="btn btn-sm">
                            Apply Now
                          </Link>
                        ) : (
                          <a href={applyHref} target="_blank" rel="noreferrer" className="btn btn-sm">
                            Apply Now
                          </a>
                        )}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="border-t border-[color:var(--ink)] py-12 text-[15px] leading-relaxed text-[color:var(--ink-muted)]">
              No volunteer opportunities match your current search. Try a different track or keyword.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
