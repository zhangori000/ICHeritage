"use client";

import * as React from "react";

type Pillar = {
  _key?: string;
  title?: string | null;
  description?: string | null;
};

type Stat = {
  _key?: string;
  icon?: string | null;
  value?: string | null;
  label?: string | null;
  description?: string | null;
};

type AboutOverviewProps = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: Array<string | null> | null;
  pillars?: Pillar[] | null;
  stats?: Stat[] | null;
} & Record<string, unknown>;

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const createIcon = (children: React.ReactNode): IconComponent =>
  function Icon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {children}
      </svg>
    );
  };

const IconUsers = createIcon(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx={9} cy={7} r={4} />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
);

const IconCalendar = createIcon(
  <>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width={18} height={18} x={3} y={4} rx={2} />
    <path d="M3 10h18" />
  </>
);

const IconGlobe = createIcon(
  <>
    <circle cx={12} cy={12} r={10} />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 0 20" />
    <path d="M12 2a15.3 15.3 0 0 0 0 20" />
  </>
);

const IconAward = createIcon(
  <>
    <circle cx={12} cy={8} r={6} />
    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
  </>
);

const IconSparkles = createIcon(
  <>
    <path d="m12 3 1.9 5.8 6.1.2-4.9 3.7 1.8 5.8-5-3.5-5 3.5 1.8-5.8L4 9l6.1-.2Z" />
    <path d="M5 3v4" />
    <path d="M3 5h4" />
    <path d="M19 17v4" />
    <path d="M17 19h4" />
  </>
);

const IconBook = createIcon(
  <>
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </>
);

const IconHeart = createIcon(
  <>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3a4.9 4.9 0 0 0-4.5 2A4.9 4.9 0 0 0 7.5 3 5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" />
  </>
);

const ICONS: Record<string, IconComponent> = {
  users: IconUsers,
  calendar: IconCalendar,
  globe: IconGlobe,
  award: IconAward,
  sparkles: IconSparkles,
  "book-open": IconBook,
  heart: IconHeart,
};

export function AboutOverview({ sectionId, heading, intro, pillars, stats }: AboutOverviewProps) {
  const anchor = sectionId?.trim() ? sectionId.trim() : undefined;
  const introParagraphs = Array.isArray(intro)
    ? intro.filter((paragraph): paragraph is string => Boolean(paragraph))
    : [];
  const pillarCards = Array.isArray(pillars) ? pillars : [];
  const statCards = Array.isArray(stats) ? stats : [];

  return (
    <section id={anchor} className="bg-[color:var(--background)] py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-16">
          <div className="space-y-8 text-center">
            <div className="space-y-6">
              {heading ? (
                <h2 className="font-serif text-3xl font-bold text-[color:var(--foreground)] md:text-4xl lg:text-5xl">
                  {heading}
                </h2>
              ) : null}

              {introParagraphs.length > 0 ? (
                <div className="mx-auto max-w-4xl space-y-6 text-lg leading-relaxed text-[color:var(--muted-foreground)] md:text-xl">
                  {introParagraphs.map((paragraph, index) => (
                    <p key={`intro-${index}`}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
            </div>

            {pillarCards.length > 0 ? (
              <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                {pillarCards.map((pillar, index) => (
                  <article
                    key={pillar._key ?? `${pillar.title ?? "pillar"}-${index}`}
                    className="flex flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="space-y-4 px-8">
                      {pillar.title ? (
                        <h3 className="font-serif text-xl font-bold text-[color:var(--foreground)]">
                          {pillar.title}
                        </h3>
                      ) : null}
                      {pillar.description ? (
                        <p className="text-[color:var(--muted-foreground)] leading-relaxed">
                          {pillar.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>

          {statCards.length > 0 ? (
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {statCards.map((stat, index) => {
                const Icon = ICONS[stat.icon ?? "users"] ?? ICONS.users;
                return (
                  <article
                    key={stat._key ?? `${stat.label ?? "stat"}-${index}`}
                    className="flex flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-lg"
                  >
                    <div className="space-y-4 px-6">
                      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                        <Icon className="h-8 w-8" aria-hidden />
                      </span>
                      <div className="space-y-2">
                        {stat.value ? (
                          <div className="font-serif text-3xl font-bold text-[color:var(--foreground)] md:text-4xl">
                            {stat.value}
                          </div>
                        ) : null}
                        {stat.label ? (
                          <div className="font-semibold text-[color:var(--foreground)]">{stat.label}</div>
                        ) : null}
                        {stat.description ? (
                          <div className="text-sm text-[color:var(--muted-foreground)]">
                            {stat.description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
