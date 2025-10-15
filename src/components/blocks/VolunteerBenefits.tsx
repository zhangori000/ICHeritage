"use client";

import * as React from "react";
import { stegaClean } from "next-sanity";

type VolunteerBenefitsBlock = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: string | null;
  benefits?: Array<{
    _key?: string;
    icon?: string | null;
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

const toneStyles: Record<
  NonNullable<NonNullable<VolunteerBenefitsBlock["benefits"]>[number]["tone"]>,
  {
    badge: string;
    iconWrap: string;
    bullet: string;
  }
> = {
  primary: {
    badge: "group-hover:text-[color:var(--primary)]",
    iconWrap: "bg-[color:var(--primary)]/10 text-[color:var(--primary)]",
    bullet: "bg-[color:var(--primary)]",
  },
  secondary: {
    badge: "group-hover:text-[color:var(--primary)]",
    iconWrap: "bg-[color:var(--secondary)]/10 text-[color:var(--secondary)]",
    bullet: "bg-[color:var(--secondary)]",
  },
  accent: {
    badge: "group-hover:text-[color:var(--primary)]",
    iconWrap: "bg-[color:var(--accent)]/10 text-[color:var(--accent)]",
    bullet: "bg-[color:var(--accent)]",
  },
};

const iconMap: Record<string, React.ReactNode> = {
  heart: (
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
      className="h-8 w-8"
      aria-hidden
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  lightbulb: (
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
      className="h-8 w-8"
      aria-hidden
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
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
      className="h-8 w-8"
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  award: (
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
      className="h-8 w-8"
      aria-hidden
    >
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  ),
  "book-open": (
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
      className="h-8 w-8"
      aria-hidden
    >
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3Z" />
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
      className="h-8 w-8"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  quote: (
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
      className="h-6 w-6"
      aria-hidden
    >
      <path d="M3 21h4l1-7H4l1-7h6l-1 7h-3z" />
      <path d="M14 21h4l1-7h-4l1-7h6l-1 7h-3z" />
    </svg>
  ),
};

const renderIcon = (icon?: string | null, tone?: "primary" | "secondary" | "accent" | null) => {
  const cleaned = clean(icon).trim().toLowerCase();
  const iconElement = cleaned && iconMap[cleaned];
  if (iconElement) {
    return iconElement;
  }
  const initial = cleaned.replace(/[^a-z0-9]/g, "").charAt(0).toUpperCase();
  const colorClass =
    tone === "secondary"
      ? "text-[color:var(--secondary)]"
      : tone === "accent"
      ? "text-[color:var(--accent)]"
      : "text-[color:var(--primary)]";
  return (
    <span className={`text-2xl font-medium ${colorClass}`} aria-hidden>
      {initial || "?"}
    </span>
  );
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
  const stories = Array.isArray(testimonials) ? testimonials : [];

  return (
    <section id={anchor} className="bg-[color:var(--muted)]/30 py-20">
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

          {benefitCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benefitCards.map((card, index) => {
                const {
                  _key,
                  icon,
                  tone = index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "accent",
                  title,
                  description,
                  points,
                } = card ?? {};

                const styles = toneStyles[tone ?? "primary"] ?? toneStyles.primary;
                const pointList = Array.isArray(points)
                  ? points.map((item) => clean(item)).filter(Boolean)
                  : [];

                return (
                  <article
                    key={_key ?? `benefit-${index}`}
                    data-slot="card"
                    className="group flex h-full flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="space-y-4 px-6">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full ${styles.iconWrap}`}
                      >
                        {renderIcon(icon, tone ?? "primary")}
                      </div>
                      {title ? (
                        <h3
                          className={`font-serif text-xl font-medium text-[color:var(--foreground)] transition-colors md:text-2xl ${styles.badge}`}
                        >
                          {clean(title)}
                        </h3>
                      ) : null}
                      {description ? (
                        <p className="text-[color:var(--muted-foreground)] leading-relaxed">
                          {clean(description)}
                        </p>
                      ) : null}
                    </div>
                    {pointList.length > 0 ? (
                      <div className="px-6 pt-0">
                        <ul className="space-y-2">
                          {pointList.map((point, pointIndex) => (
                            <li
                              key={`${_key ?? index}-point-${pointIndex}`}
                              className="flex items-start gap-2 text-sm text-[color:var(--muted-foreground)]"
                            >
                              <span
                                className={`mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full ${styles.bullet}`}
                              />
                              <span>{point}</span>
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

          {(testimonialsHeading || testimonialsIntro || stories.length > 0) && (
            <div className="mt-16 space-y-8">
              {(testimonialsHeading || testimonialsIntro) && (
                <div className="text-center">
                  {testimonialsHeading ? (
                    <h3 className="mb-4 font-serif text-2xl font-medium text-[color:var(--foreground)] md:text-3xl">
                      {clean(testimonialsHeading)}
                    </h3>
                  ) : null}
                  {testimonialsIntro ? (
                    <p className="text-[color:var(--muted-foreground)]">
                      {clean(testimonialsIntro)}
                    </p>
                  ) : null}
                </div>
              )}

              {stories.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {stories.map((story, storyIndex) => {
                    const quote = clean(story?.quote);
                    const name = clean(story?.name);
                    const role = clean(story?.role);

                    if (!quote && !name && !role) return null;

                    return (
                      <article
                        key={story?._key ?? `testimonial-${storyIndex}`}
                        data-slot="card"
                        className="flex flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 shadow-sm"
                      >
                        <div className="space-y-4 px-6">
                          {quote ? (
                            <div className="space-y-4">
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                                {iconMap.quote}
                              </span>
                              <p className="italic leading-relaxed text-[color:var(--muted-foreground)]">
                                “{quote}”
                              </p>
                            </div>
                          ) : null}
                          {(name || role) && (
                            <footer className="space-y-1">
                              {name ? (
                                <div className="font-medium text-[color:var(--foreground)]">
                                  {name}
                                </div>
                              ) : null}
                              {role ? (
                                <div className="text-sm text-[color:var(--muted-foreground)]">
                                  {role}
                                </div>
                              ) : null}
                            </footer>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
