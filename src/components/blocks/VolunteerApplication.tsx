"use client";

import * as React from "react";
import Link from "next/link";
import { stegaClean } from "next-sanity";

type VolunteerApplicationBlock = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: string | null;
  processHeading?: string | null;
  processSubheading?: string | null;
  steps?: Array<{
    _key?: string;
    title?: string | null;
    description?: string | null;
    timeEstimate?: string | null;
  }> | null;
  requirementsHeading?: string | null;
  requirementsIntro?: string | null;
  requirements?: Array<
    | {
        _key?: string;
        text?: string | null;
      }
    | string
    | null
  > | null;
  tracks?: Array<{
    _key?: string;
    title?: string | null;
    description?: string | null;
    highlights?: Array<{
      _key?: string;
      icon?: "clock" | "users" | "map" | "calendar" | "sparkles" | "globe" | null;
      label?: string | null;
    }> | null;
    cta?: {
      label?: string | null;
      href?: string | null;
    } | null;
    tone?: "primary" | "secondary" | "accent" | null;
  }> | null;
  supportHeading?: string | null;
  supportBody?: string | null;
  supportLinks?: Array<{
    _key?: string;
    label?: string | null;
    href?: string | null;
  }> | null;
};

const clean = (value?: string | null) => (value ? stegaClean(value) : "");

const iconMap: Record<string, React.ReactNode> = {
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
      className="h-4 w-4"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  users: (
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
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  map: (
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
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M9 18-1 13V5l10 5V18z" />
      <path d="m9 18 10 5V15L9 10" />
      <path d="m9 10 10-5 4 2" />
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
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
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
      className="h-4 w-4"
      aria-hidden
    >
      <path d="m12 3 1.9 5.8 6.1.2-4.9 3.7 1.8 5.8-5-3.5-5 3.5 1.8-5.8L4 9l6.1-.2Z" />
      <path d="M5 3v4" />
      <path d="M3 5h4" />
      <path d="M19 17v4" />
      <path d="M17 19h4" />
    </svg>
  ),
  globe: (
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
      className="h-4 w-4"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    </svg>
  ),
};

const checkIcon = (
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
    className="h-5 w-5 text-[color:var(--primary)] flex-shrink-0 mt-0.5"
    aria-hidden
  >
    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const arrowIcon = (
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
    className="h-5 w-5"
    aria-hidden
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const DEFAULT_TRACK_LINKS: Record<string, string> = {
  "organizational volunteers": "/forms/volunteer-organizational",
  "workshop volunteers": "/forms/volunteer-workshop",
};

function renderSupportLink(link: { label: string; href: string }, key: string) {
  const isInternal = link.href.startsWith("/");
  const className =
    "inline-flex items-center justify-center gap-2 rounded-md border border-[color:var(--border)] px-6 py-2 text-sm font-medium text-[color:var(--foreground)] transition-all hover:bg-[color:var(--accent)]/10";

  if (isInternal) {
    return (
      <Link key={key} href={link.href} className={className}>
        {link.label}
        {arrowIcon}
      </Link>
    );
  }

  return (
    <a key={key} href={link.href} className={className}>
      {link.label}
      {arrowIcon}
    </a>
  );
}

export function VolunteerApplication(block: VolunteerApplicationBlock) {
  const {
    sectionId,
    heading,
    intro,
    processHeading,
    processSubheading,
    steps,
    requirementsHeading,
    requirementsIntro,
    requirements,
    tracks,
    supportHeading,
    supportBody,
    supportLinks,
  } = block;

  const anchor = sectionId?.trim() ? sectionId.trim() : undefined;

  const stepList = Array.isArray(steps)
    ? steps.map((step) => ({
        _key: step?._key ?? step?.title ?? crypto.randomUUID(),
        title: clean(step?.title),
        description: clean(step?.description),
        timeEstimate: clean(step?.timeEstimate),
      }))
    : [];

  const requirementItems = Array.isArray(requirements)
    ? requirements
        .map((item) => {
          if (!item) return null;
          if (typeof item === "string") {
            const text = clean(item);
            return text ? { _key: crypto.randomUUID(), text } : null;
          }
          const text = clean(item.text);
          return text ? { _key: item._key ?? crypto.randomUUID(), text } : null;
        })
        .filter((item): item is { _key: string; text: string } => Boolean(item))
    : [];

  const trackCards = Array.isArray(tracks)
    ? tracks.map((card, idx) => {
        const titleText = clean(card?.title);
        const titleKey = titleText.toLowerCase();
        const ctaHref = clean(card?.cta?.href) || DEFAULT_TRACK_LINKS[titleKey] || "#";

        return {
          _key: card?._key ?? card?.title ?? `track-${idx}`,
          tone: card?.tone ?? (idx % 2 === 0 ? "primary" : "secondary"),
          title: titleText,
          description: clean(card?.description),
          highlights: Array.isArray(card?.highlights)
            ? card!.highlights!
                .map((highlight) => ({
                  _key: highlight?._key ?? highlight?.label ?? crypto.randomUUID(),
                  icon: highlight?.icon ?? "clock",
                  label: clean(highlight?.label),
                }))
                .filter((highlight) => highlight.label)
            : [],
          cta:
            card?.cta?.label
              ? {
                  label: clean(card.cta.label),
                  href: ctaHref,
                }
              : null,
        };
      })
    : [];

  const supportCtas = Array.isArray(supportLinks)
    ? supportLinks
        .map((link) => ({
          _key: link?._key ?? link?.label ?? crypto.randomUUID(),
          label: clean(link?.label),
          href: clean(link?.href),
        }))
        .filter((link) => link.label && link.href)
    : [];

  const stepsGridClass = (() => {
    const count = stepList.length;
    if (count >= 5) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-5";
    if (count === 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    if (count === 3) return "grid-cols-1 md:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2";
  })();

  return (
    <section id={anchor} className="bg-[color:var(--muted)]/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="space-y-6 text-center">
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

          {(processHeading || processSubheading || stepList.length > 0) && (
            <div className="space-y-8">
              {(processHeading || processSubheading) && (
                <div className="text-center">
                  {processHeading ? (
                    <h3 className="mb-4 font-serif text-2xl font-medium text-[color:var(--foreground)] md:text-3xl">
                      {clean(processHeading)}
                    </h3>
                  ) : null}
                  {processSubheading ? (
                    <p className="text-[color:var(--muted-foreground)]">
                      {clean(processSubheading)}
                    </p>
                  ) : null}
                </div>
              )}

              {stepList.length > 0 ? (
                <div className={`grid gap-6 ${stepsGridClass}`}>
                  {stepList.map((step, index) => {
                    if (!step.title && !step.description) return null;
                    const number = index + 1;
                    return (
                      <article
                        key={step._key}
                        data-slot="card"
                        className="relative flex flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 text-center text-[color:var(--foreground)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="space-y-4 px-6">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-semibold">
                            {number}
                          </div>
                          {step.title ? (
                            <h4 className="font-serif text-lg font-medium transition-colors group-hover:text-[color:var(--primary)]">
                              {step.title}
                            </h4>
                          ) : null}
                        </div>
                        {step.description ? (
                          <div className="space-y-3 px-6 pt-0">
                            <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                              {step.description}
                            </p>
                            {step.timeEstimate ? (
                              <div className="flex items-center justify-center gap-1 text-xs text-[color:var(--muted-foreground)]">
                                {iconMap.clock}
                                <span>{step.timeEstimate}</span>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <article className="flex flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 text-[color:var(--foreground)] shadow-sm">
              <div className="space-y-4 px-6">
                {requirementsHeading ? (
                  <h3 className="font-serif text-2xl font-medium">{clean(requirementsHeading)}</h3>
                ) : null}
                {requirementsIntro ? (
                  <p className="text-[color:var(--muted-foreground)]">{clean(requirementsIntro)}</p>
                ) : null}
              </div>
              {requirementItems.length > 0 ? (
                <div className="px-6 pb-6">
                  <ul className="space-y-3">
                    {requirementItems.map((item) => (
                      <li key={item._key} className="flex items-start gap-3">
                        {checkIcon}
                        <span className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>

            <div className="space-y-6">
              {trackCards.map((track) => {
                const tone = track.tone ?? "primary";
                const toneStyles =
                  tone === "secondary"
                    ? {
                        card: "bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)]",
                        button:
                          "inline-flex w-full items-center justify-center gap-2 rounded-md bg-[color:var(--secondary-foreground)] px-6 py-2 text-sm font-medium text-[color:var(--secondary)] transition-all hover:bg-[color:var(--secondary-foreground)]/90",
                        iconColor: "text-[color:var(--secondary-foreground)]",
                      }
                    : tone === "accent"
                    ? {
                        card: "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]",
                        button:
                          "inline-flex w-full items-center justify-center gap-2 rounded-md bg-[color:var(--accent-foreground)] px-6 py-2 text-sm font-medium text-[color:var(--accent)] transition-all hover:bg-[color:var(--accent-foreground)]/90",
                        iconColor: "text-[color:var(--accent-foreground)]",
                      }
                    : {
                        card: "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]",
                        button:
                          "inline-flex w-full items-center justify-center gap-2 rounded-md bg-[color:var(--primary-foreground)] px-6 py-2 text-sm font-medium text-[color:var(--primary)] transition-all hover:bg-[color:var(--primary-foreground)]/90",
                        iconColor: "text-[color:var(--primary-foreground)]",
                      };

                return (
                  <article
                    key={track._key}
                    data-slot="card"
                    className={`flex flex-col gap-6 rounded-xl border border-transparent py-6 shadow-sm ${toneStyles.card}`}
                  >
                    <div className="space-y-4 px-6">
                      {track.title ? (
                        <h3 className="font-serif text-2xl font-medium">{track.title}</h3>
                      ) : null}
                      {track.description ? (
                        <p className="text-sm opacity-90 leading-relaxed">{track.description}</p>
                      ) : null}
                    </div>
                    {track.highlights.length > 0 ? (
                      <div className="space-y-2 px-6">
                        {track.highlights.map((highlight) => {
                          if (!highlight.label) return null;
                          const icon = highlight.icon ? iconMap[highlight.icon] ?? iconMap.clock : iconMap.clock;
                          return (
                            <div key={highlight._key} className="flex items-center gap-2 text-sm opacity-90">
                              <span className={toneStyles.iconColor}>{icon}</span>
                              <span>{highlight.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                    {track.cta ? (
                      <div className="px-6">
                        <a href={track.cta.href} className={toneStyles.button}>
                          {track.cta.label}
                          {arrowIcon}
                        </a>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>

          {(supportHeading || supportBody || supportCtas.length > 0) && (
            <article className="flex flex-col gap-6 rounded-xl border border-dashed border-[color:var(--border)] bg-[color:var(--background)] py-6 text-[color:var(--foreground)] shadow-sm">
              <div className="space-y-4 px-6 text-center">
                {supportHeading ? (
                  <h3 className="font-serif text-2xl font-medium">{clean(supportHeading)}</h3>
                ) : null}
                {supportBody ? (
                  <p className="mx-auto max-w-2xl text-lg text-[color:var(--muted-foreground)]">{clean(supportBody)}</p>
                ) : null}
              </div>
              {supportCtas.length > 0 ? (
                <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:justify-center">
                  {supportCtas.map((link) => renderSupportLink({ label: link.label, href: link.href }, link._key))}
                </div>
              ) : null}
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
