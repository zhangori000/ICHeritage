"use client";

import * as React from "react";
import Link from "next/link";

type Highlight = {
  _key?: string;
  icon?: string | null;
  title?: string | null;
  body?: string | null;
};

type Benefit = {
  _key?: string;
  title?: string | null;
  description?: string | null;
};

type Fact = {
  _key?: string;
  label?: string | null;
  value?: string | null;
};

type CTA = {
  label?: string | null;
  href?: string | null;
} | null | undefined;

type ChapterApplicationProps = {
  sectionId?: string | null;
  kicker?: string | null;
  title?: string | null;
  description?: string | null;
  highlights?: Highlight[] | null;
  benefitsHeading?: string | null;
  benefitsIntro?: string | null;
  benefits?: Benefit[] | null;
  cardTitle?: string | null;
  cardSubtitle?: string | null;
  cardFacts?: Fact[] | null;
  cta?: CTA;
  cardFootnote?: string | null;
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

const IconBookOpen = createIcon(
  <>
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
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

const IconUsers = createIcon(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx={9} cy={7} r={4} />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
);

const IconAward = createIcon(
  <>
    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
    <circle cx={12} cy={8} r={6} />
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

const IconLightbulb = createIcon(
  <>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2-.6.4-1 1-1 1.8v.5H10v-.5c0-.8-.4-1.4-1-1.8-1.8-1.1-3-3-3-5.2a6 6 0 0 1 6-6Z" />
  </>
);

const IconHandshake = createIcon(
  <>
    <path d="m9 7 3 3 3-3" />
    <path d="M4 8h2a2 2 0 0 1 2 2v6" />
    <path d="M20 8h-2a2 2 0 0 0-2 2v6" />
    <path d="m4 14 4 4 4-3 4 3 4-4" />
  </>
);

const IconGraduationCap = createIcon(
  <>
    <path d="m3 7 9-4 9 4-9 4-9-4Z" />
    <path d="M12 11v6" />
    <path d="M7 9v6a5 5 0 0 0 10 0V9" />
  </>
);

const ICONS: Record<string, IconComponent> = {
  "book-open": IconBookOpen,
  calendar: IconCalendar,
  users: IconUsers,
  award: IconAward,
  sparkles: IconSparkles,
  lightbulb: IconLightbulb,
  handshake: IconHandshake,
  "graduation-cap": IconGraduationCap,
};

function normalizeIconName(value: string | null | undefined) {
  if (!value) return "";
  return value.trim().toLowerCase();
}

export function ChapterApplication({
  sectionId,
  kicker,
  title,
  description,
  highlights,
  benefitsHeading,
  benefitsIntro,
  benefits,
  cardTitle,
  cardSubtitle,
  cardFacts,
  cta,
  cardFootnote,
}: ChapterApplicationProps) {
  const sectionAnchor = sectionId?.trim() ? sectionId.trim() : undefined;

  return (
    <section
      id={sectionAnchor}
      className="bg-[color:var(--primary)] py-20 text-[color:var(--primary-foreground)]"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-16">
          <div className="space-y-6 text-center">
            {kicker ? (
              <span className="inline-flex items-center rounded-full border border-[color:var(--primary-foreground)]/25 bg-[color:var(--primary-foreground)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {kicker}
              </span>
            ) : null}

            {title ? (
              <h2 className="font-serif text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[color:var(--primary-foreground)]/90 md:text-xl">
                {description}
              </p>
            ) : null}
          </div>

          {(() => {
            const highlightItems = Array.isArray(highlights) ? highlights : [];
            if (highlightItems.length === 0) return null;

            return (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {highlightItems.map((item, index) => {
                  const key = item._key ?? `${item.title ?? "highlight"}-${index}`;
                  const iconName = normalizeIconName(item.icon);
                  const Icon = ICONS[iconName] ?? IconSparkles;

                  return (
                    <div
                      key={key}
                      className="space-y-4 rounded-xl border border-[color:var(--primary-foreground)]/15 bg-[color:var(--primary-foreground)]/5 px-6 py-8 text-center"
                    >
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--primary-foreground)]/10">
                        <Icon className="h-8 w-8" aria-hidden />
                      </div>
                      {item.title ? (
                        <h3 className="font-serif text-xl font-semibold">
                          {item.title}
                        </h3>
                      ) : null}
                      {item.body ? (
                        <p className="text-sm text-[color:var(--primary-foreground)]/80">
                          {item.body}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <div className="space-y-8">
              <div className="space-y-4">
                {benefitsHeading ? (
                  <h3 className="font-serif text-2xl font-bold md:text-3xl">
                    {benefitsHeading}
                  </h3>
                ) : null}
                {benefitsIntro ? (
                  <p className="text-lg text-[color:var(--primary-foreground)]/90">
                    {benefitsIntro}
                  </p>
                ) : null}
              </div>

              {(() => {
                const benefitItems = Array.isArray(benefits) ? benefits : [];
                if (benefitItems.length === 0) return null;

                return (
                  <div className="space-y-6">
                    {benefitItems.map((benefit, index) => (
                      <div
                        key={benefit._key ?? `${benefit.title ?? "benefit"}-${index}`}
                        className="flex gap-4"
                      >
                        <span className="mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-[color:var(--primary-foreground)]" />
                        <div className="space-y-1">
                          {benefit.title ? (
                            <h4 className="font-semibold text-[color:var(--primary-foreground)]">
                              {benefit.title}
                            </h4>
                          ) : null}
                          {benefit.description ? (
                            <p className="text-sm text-[color:var(--primary-foreground)]/80">
                              {benefit.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="flex flex-col gap-6 rounded-2xl border border-[color:var(--primary-foreground)]/15 bg-[color:var(--primary-foreground)] py-6 text-[color:var(--primary)] shadow-lg">
              <div className="space-y-4 px-6 text-center">
                {cardTitle ? (
                  <h3 className="font-serif text-2xl font-semibold">
                    {cardTitle}
                  </h3>
                ) : null}
                {cardSubtitle ? (
                  <p className="text-sm text-[color:var(--primary)]/80">
                    {cardSubtitle}
                  </p>
                ) : null}
              </div>

              {(() => {
                const facts = Array.isArray(cardFacts) ? cardFacts : [];
                if (facts.length === 0) return null;

                return (
                  <div className="space-y-2 px-6">
                    {facts.map((fact, index) => (
                      <div
                        key={fact._key ?? `${fact.label ?? "fact"}-${index}`}
                        className="flex items-center justify-between border-b border-[color:var(--primary)]/15 py-3 last:border-b-0"
                      >
                        <span className="font-medium text-[color:var(--primary)]">
                          {fact.label}
                        </span>
                        <span className="text-sm text-[color:var(--primary)]/70">
                          {fact.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {cta?.href && cta?.label ? (
                <div className="px-6">
                  <Link
                    href={cta.href}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[color:var(--primary)] px-6 text-sm font-medium text-[color:var(--primary-foreground)] transition hover:bg-[color-mix(in_oklab,var(--primary)_90%,black)]"
                  >
                    {cta.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ) : null}

              {cardFootnote ? (
                <p className="px-6 text-center text-xs text-[color:var(--primary)]/60">
                  {cardFootnote}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
