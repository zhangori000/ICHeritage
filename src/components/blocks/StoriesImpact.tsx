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

const statColorClasses: Record<string, string> = {
  primary: "text-[color:var(--primary)]",
  secondary: "text-[color:var(--secondary)]",
  accent: "text-[color:var(--accent)]",
};

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
    <section id={anchor} className="bg-[color:var(--background)] py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-16">
          <div className="space-y-6 text-center">
            {heading ? (
              <h2 className="font-serif text-3xl font-bold text-[color:var(--foreground)] md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            ) : null}
            {intro ? (
              <p className="mx-auto max-w-3xl text-lg text-[color:var(--muted-foreground)] md:text-xl">
                {intro}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {storyItems.map((story, index) => (
              <article
                key={story._key ?? `${story.name ?? "story"}-${index}`}
                className="flex h-full flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-full flex-col gap-6 px-6">
                  <div className="flex-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mb-4 h-8 w-8 text-[color:var(--primary)]/30"
                      aria-hidden
                    >
                      <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2Z" />
                      <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2Z" />
                    </svg>
                    {story.quote ? (
                      <blockquote className="text-[color:var(--muted-foreground)] italic leading-relaxed">
                        “{story.quote}”
                      </blockquote>
                    ) : null}
                  </div>

                  <div className="space-y-2 border-t border-[color:var(--border)] pt-4 text-left">
                    {story.name ? (
                      <div className="font-semibold text-[color:var(--foreground)]">{story.name}</div>
                    ) : null}
                    {story.role ? (
                      <div className="text-sm text-[color:var(--muted-foreground)]">{story.role}</div>
                    ) : null}
                    {story.location ? (
                      <div className="text-sm text-[color:var(--muted-foreground)]">{story.location}</div>
                    ) : null}
                    {story.program ? (
                      <div className="text-xs font-medium text-[color:var(--primary)]">{story.program}</div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {statsCard ? (
            <article className="rounded-xl border border-[color:var(--primary)]/20 bg-gradient-to-br from-[color:var(--primary)]/5 via-[color:var(--secondary)]/5 to-[color:var(--primary)]/5 py-8 text-[color:var(--foreground)] shadow-sm">
              <div className="mx-auto flex max-w-5xl flex-col gap-8 px-8 text-center">
                {statsCard.heading ? (
                  <h3 className="font-serif text-2xl font-bold md:text-3xl">{statsCard.heading}</h3>
                ) : null}

                {stats.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {stats.map((stat, statIndex) => (
                      <div key={stat._key ?? `${stat.label ?? "stat"}-${statIndex}`} className="space-y-2">
                        {stat.value ? (
                          <div
                            className={[
                              "text-3xl font-bold md:text-4xl",
                              statColorClasses[stat.color ?? "primary"] ?? statColorClasses.primary,
                            ].join(" ")}
                          >
                            {stat.value}
                          </div>
                        ) : null}
                        {stat.label ? (
                          <div className="text-sm text-[color:var(--muted-foreground)]">{stat.label}</div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}

                {statsCard.description ? (
                  <p className="mx-auto max-w-2xl text-[color:var(--muted-foreground)] leading-relaxed">
                    {statsCard.description}
                  </p>
                ) : null}
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
