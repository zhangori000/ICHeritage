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
    tone?: "accent" | "muted" | "primary" | "secondary" | null;
    icon?: string | null;
    title?: string | null;
    description?: string | null;
    keyAreasHeading?: string | null;
    keyAreas?: Array<string | null> | null;
    commitmentHeading?: string | null;
    commitmentItems?: Array<{
      _key?: string;
      icon?: string | null;
      text?: string | null;
    }> | null;
    benefitsHeading?: string | null;
    benefits?: Array<string | null> | null;
    cta?: {
      label?: string | null;
      href?: string | null;
    } | null;
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

type Track = NonNullable<VolunteerTracksBlock["tracks"]>[number];
type CommitmentItem = NonNullable<Track["commitmentItems"]>[number];

const clean = (value?: string | null) => (value ? stegaClean(value) : "");

const toneStyles: Record<
  NonNullable<Track["tone"]>,
  {
    card: string;
    badge: string;
    iconRing: string;
    accentText: string;
    bulletDot: string;
    cta: string;
    ctaHover: string;
    ctaText: string;
  }
> = {
  primary: {
    card: "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]",
    badge:
      "border-[color:var(--primary-foreground)]/20 bg-[color:var(--primary-foreground)]/10 text-[color:var(--primary-foreground)]",
    iconRing: "bg-[color:var(--primary-foreground)]/10 text-[color:var(--primary-foreground)]",
    accentText: "text-[color:var(--primary-foreground)]/90",
    bulletDot: "bg-[color:var(--primary-foreground)]",
    cta: "bg-[color:var(--primary-foreground)]",
    ctaHover: "hover:bg-[color:var(--primary-foreground)]/90",
    ctaText: "text-[color:var(--primary)]",
  },
  secondary: {
    card: "bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)]",
    badge:
      "border-[color:var(--secondary-foreground)]/20 bg-[color:var(--secondary-foreground)]/10 text-[color:var(--secondary-foreground)]",
    iconRing:
      "bg-[color:var(--secondary-foreground)]/10 text-[color:var(--secondary-foreground)]",
    accentText: "text-[color:var(--secondary-foreground)]/90",
    bulletDot: "bg-[color:var(--secondary-foreground)]",
    cta: "bg-[color:var(--secondary-foreground)]",
    ctaHover: "hover:bg-[color:var(--secondary-foreground)]/90",
    ctaText: "text-[color:var(--secondary)]",
  },
  accent: {
    card: "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]",
    badge:
      "border-[color:var(--accent-foreground)]/20 bg-[color:var(--accent-foreground)]/10 text-[color:var(--accent-foreground)]",
    iconRing: "bg-[color:var(--accent-foreground)]/10 text-[color:var(--accent-foreground)]",
    accentText: "text-[color:var(--accent-foreground)]/90",
    bulletDot: "bg-[color:var(--accent-foreground)]",
    cta: "bg-[color:var(--accent-foreground)]",
    ctaHover: "hover:bg-[color:var(--accent-foreground)]/90",
    ctaText: "text-[color:var(--accent)]",
  },
  muted: {
    card: "bg-[color:var(--card)] text-[color:var(--foreground)]",
    badge:
      "border-[color:var(--foreground)]/20 bg-[color:var(--accent)]/10 text-[color:var(--foreground)]",
    iconRing: "bg-[color:var(--accent)]/20 text-[color:var(--foreground)]",
    accentText: "text-[color:var(--muted-foreground)]",
    bulletDot: "bg-[color:var(--primary)]",
    cta: "bg-[color:var(--primary)]",
    ctaHover: "hover:bg-[color:var(--primary)]/90",
    ctaText: "text-[color:var(--primary-foreground)]",
  },
};

const iconMap: Record<string, React.ReactElement<React.SVGProps<SVGSVGElement>>> = {
  "building-2": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-8 w-8"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  ),
  calendar: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-8 w-8"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  ),
  clock: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  "map-pin": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  sparkles: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-8 w-8"
    >
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
      <path d="M12 8l-2 4h4l-2 4" />
    </svg>
  ),
  "arrow-right": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-5 w-5"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  ),
};

const renderIcon = (icon?: string | null) => {
  const name = clean(icon).trim().toLowerCase();
  if (name && iconMap[name]) {
    return iconMap[name];
  }
  const initial = name.replace(/[^a-z0-9]/g, "").charAt(0).toUpperCase();
  return (
    <span className="text-2xl font-medium" aria-hidden>
      {initial || "?"}
    </span>
  );
};

const renderCommitmentIcon = (
  item: CommitmentItem,
  tone: NonNullable<Track["tone"]>
) => {
  const icon = clean(item?.icon).trim().toLowerCase();
  if (icon && iconMap[icon]) {
    const element = iconMap[icon];
    return React.cloneElement(element, {
      className: ["h-4 w-4 flex-shrink-0", element.props.className].filter(Boolean).join(" "),
    });
  }
  return <div className={`h-2 w-2 rounded-full ${toneStyles[tone].bulletDot} flex-shrink-0`} />;
};

const isInternalHref = (href?: string | null) => (href ? href.startsWith("/") : false);

const CallToAction = ({
  href,
  label,
  className,
}: {
  href?: string | null;
  label?: string | null;
  className: string;
}) => {
  const cleanedHref = href ?? "";
  const cleanedLabel = clean(label);
  if (!cleanedLabel) return null;
  if (isInternalHref(cleanedHref)) {
    return (
      <Link href={cleanedHref} className={className}>
        {cleanedLabel}
        {iconMap["arrow-right"]}
      </Link>
    );
  }
  return (
    <a
      href={cleanedHref || "#"}
      target={cleanedHref.startsWith("http") ? "_blank" : undefined}
      rel={cleanedHref.startsWith("http") ? "noreferrer" : undefined}
      className={className}
    >
      {cleanedLabel}
      {iconMap["arrow-right"]}
    </a>
  );
};

export function VolunteerTracks(block: VolunteerTracksBlock) {
  const { sectionId, heading, intro, tracks, callout } = block;
  const anchor = sectionId?.trim() ? sectionId.trim() : undefined;
  const trackList = Array.isArray(tracks) ? tracks : [];

  return (
    <section id={anchor} className="bg-[color:var(--background)] py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 space-y-6 text-center">
            {heading ? (
              <h2 className="font-serif text-3xl font-medium text-[color:var(--foreground)] md:text-4xl lg:text-5xl">
                {clean(heading)}
              </h2>
            ) : null}
            {intro ? (
              <p className="mx-auto max-w-3xl text-lg text-[color:var(--muted-foreground)] md:text-xl">
                {clean(intro)}
              </p>
            ) : null}
          </div>

          {trackList.length > 0 ? (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {trackList.map((track, index) => {
                const {
                  _key,
                  badgeLabel,
                  tone = index === 0 ? "primary" : "secondary",
                  icon,
                  title,
                  description,
                  keyAreasHeading,
                  keyAreas,
                  commitmentHeading,
                  commitmentItems,
                  benefitsHeading,
                  benefits,
                  cta,
                } = track ?? {};

                const styles = toneStyles[tone ?? "primary"] ?? toneStyles.primary;
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
                    className={`flex flex-col gap-6 rounded-xl border border-[color:var(--border)] py-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.card}`}
                  >
                        <div className="space-y-6 px-6">
                          <div className="flex items-center gap-4">
                            <div
                              className={`rounded-full p-4 ${styles.iconRing}`}
                            >
                              {renderIcon(icon)}
                            </div>
                            <div className="space-y-2">
                              {badgeLabel ? (
                                <span
                                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles.badge}`}
                                >
                                  {clean(badgeLabel)}
                                </span>
                              ) : null}
                              {cleanedTitle ? (
                                <h3 className="font-serif text-2xl font-medium md:text-3xl">
                                  {cleanedTitle}
                                </h3>
                              ) : null}
                            </div>
                          </div>
                          {cleanedDescription ? (
                            <p className={`text-lg leading-relaxed ${styles.accentText}`}>
                              {cleanedDescription}
                            </p>
                          ) : null}
                        </div>

                    <div className="space-y-8 px-6">
                      {keyAreasList.length > 0 ? (
                        <div className="space-y-4">
                          {keyAreasHeading ? (
                            <h4 className="font-serif text-xl font-medium">
                              {clean(keyAreasHeading)}
                            </h4>
                          ) : null}
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {keyAreasList.map((area, areaIndex) => (
                              <div
                                key={`${_key}-keyarea-${areaIndex}`}
                                className="flex items-center gap-2 text-sm font-medium"
                              >
                                <div
                                  className={`h-2 w-2 flex-shrink-0 rounded-full ${styles.bulletDot}`}
                                />
                                <span>{area}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {commitmentList.length > 0 ? (
                        <div className="space-y-4">
                          {commitmentHeading ? (
                            <h4 className="font-serif text-xl font-medium">
                              {clean(commitmentHeading)}
                            </h4>
                          ) : null}
                          <div className="space-y-3">
                            {commitmentList.map((item, itemIndex) => (
                              <div
                                key={`${_key}-commitment-${item?._key ?? itemIndex}`}
                                className="flex items-center gap-3 text-sm"
                              >
                                {renderCommitmentIcon(item, tone ?? "primary")}
                                <span>{clean(item?.text)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {benefitsList.length > 0 ? (
                        <div className="space-y-4">
                          {benefitsHeading ? (
                            <h4 className="font-serif text-xl font-medium">
                              {clean(benefitsHeading)}
                            </h4>
                          ) : null}
                          <div className={`space-y-2 text-sm ${styles.accentText}`}>
                            {benefitsList.map((benefit, benefitIndex) => (
                              <div key={`${_key}-benefit-${benefitIndex}`}>• {benefit}</div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {cta?.label ? (
                        <CallToAction
                          href={cta?.href}
                          label={cta?.label}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-2 text-sm font-medium shadow-xs transition-all ${styles.cta} ${styles.ctaHover} ${styles.ctaText}`}
                        />
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          {callout && (callout.heading || callout.body || callout.links?.length) ? (
            <div className="mt-16 rounded-xl border border-dashed border-[color:var(--border)] bg-[color:var(--muted)]/50 p-8 text-center text-[color:var(--foreground)] shadow-sm">
              {callout.heading ? (
                <h3 className="font-serif text-2xl font-medium">
                  {clean(callout.heading)}
                </h3>
              ) : null}
              {callout.body ? (
                <p className="mx-auto mt-4 max-w-3xl text-lg text-[color:var(--muted-foreground)]">
                  {clean(callout.body)}
                </p>
              ) : null}
              {Array.isArray(callout.links) && callout.links.length > 0 ? (
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  {callout.links.slice(0, 2).map((link, linkIndex) => {
                    const label = clean(link?.label);
                    if (!label) return null;
                    const href = link?.href ?? "";
                    const className =
                      "inline-flex w-full items-center justify-center gap-2 rounded-md border border-[color:var(--border)] px-6 py-2 text-sm font-medium text-[color:var(--foreground)] transition-all hover:bg-[color:var(--accent)]/10";
                    if (isInternalHref(href)) {
                      return (
                        <Link key={`${link?._key ?? linkIndex}-cta`} href={href} className={className}>
                          {label}
                          {iconMap["arrow-right"]}
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
                        {iconMap["arrow-right"]}
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
