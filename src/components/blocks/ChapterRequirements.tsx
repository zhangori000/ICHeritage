"use client";

import * as React from "react";

type RequirementCard = {
  _key?: string;
  title?: string | null;
  icon?: string | null;
  tone?: "primary" | "secondary" | "accent" | "muted" | null;
  points?: Array<string | null> | null;
};

type ProcessStep = {
  _key?: string;
  label?: string | null;
  duration?: string | null;
};

type ProcessCard = {
  title?: string | null;
  steps?: ProcessStep[] | null;
} | null;

type Metric = {
  _key?: string;
  label?: string | null;
  value?: string | null;
};

type MetricsCard = {
  title?: string | null;
  metrics?: Metric[] | null;
} | null;

type ChapterRequirementsProps = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: string | null;
  cards?: RequirementCard[] | null;
  processCard?: ProcessCard;
  metricsCard?: MetricsCard;
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
    <path d="M16 3.13a4 4 0 1 1 0 7.75" />
  </>
);

const IconBook = createIcon(
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

const IconTarget = createIcon(
  <>
    <circle cx={12} cy={12} r={10} />
    <circle cx={12} cy={12} r={6} />
    <circle cx={12} cy={12} r={2} />
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

const IconHeart = createIcon(
  <>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3a4.9 4.9 0 0 0-4.5 2A4.9 4.9 0 0 0 7.5 3 5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" />
  </>
);

const IconAward = createIcon(
  <>
    <circle cx={12} cy={8} r={6} />
    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
  </>
);

const IconLightbulb = createIcon(
  <>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2-.6.4-1 1-1 1.8V16H10v-1c0-.8-.4-1.4-1-1.8-1.8-1.1-3-3-3-5.2a6 6 0 0 1 6-6Z" />
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

const ICONS: Record<string, IconComponent> = {
  users: IconUsers,
  "book-open": IconBook,
  calendar: IconCalendar,
  target: IconTarget,
  globe: IconGlobe,
  heart: IconHeart,
  award: IconAward,
  lightbulb: IconLightbulb,
  sparkles: IconSparkles,
};

const toneStyles: Record<"primary" | "secondary" | "accent" | "muted", { badge: string; bullet: string }> = {
  primary: {
    badge: "bg-[color:var(--primary)]/10 text-[color:var(--primary)]",
    bullet: "text-[color:var(--primary)]",
  },
  secondary: {
    badge: "bg-[color:var(--secondary)]/10 text-[color:var(--secondary)]",
    bullet: "text-[color:var(--secondary)]",
  },
  accent: {
    badge: "bg-[color:var(--accent)]/10 text-[color:var(--accent)]",
    bullet: "text-[color:var(--accent)]",
  },
  muted: {
    badge: "bg-[color:var(--muted)] text-[color:var(--foreground)]/70",
    bullet: "text-[color:var(--foreground)]/60",
  },
};

const CheckIcon = createIcon(
  <>
    <path d="M21.8 10A10 10 0 1 1 17 3.33" />
    <path d="m9 11 3 3L22 4" />
  </>
);

export function ChapterRequirements({
  sectionId,
  heading,
  intro,
  cards,
  processCard,
  metricsCard,
}: ChapterRequirementsProps) {
  const anchor = sectionId?.trim() ? sectionId.trim() : undefined;
  const requirementCards = Array.isArray(cards) ? cards : [];
  const processSteps = Array.isArray(processCard?.steps) ? processCard?.steps ?? [] : [];
  const metrics = Array.isArray(metricsCard?.metrics) ? metricsCard?.metrics ?? [] : [];

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

          {requirementCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {requirementCards.map((card, index) => {
                const tone = (card.tone ?? "primary") as keyof typeof toneStyles;
                const Icon = ICONS[card.icon ?? "users"] ?? ICONS.users;
                const points = Array.isArray(card.points)
                  ? card.points.filter((point): point is string => Boolean(point))
                  : [];

                return (
                  <article
                    key={card._key ?? `${card.title ?? "card"}-${index}`}
                    className="flex flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="space-y-4 px-6">
                      <div className="flex items-center gap-4">
                        <span
                          className={["inline-flex rounded-full p-3", toneStyles[tone].badge].join(" ")}
                        >
                          <Icon className="h-6 w-6" aria-hidden />
                        </span>
                        {card.title ? (
                          <h3 className="font-serif text-xl font-semibold md:text-2xl text-[color:var(--foreground)]">
                            {card.title}
                          </h3>
                        ) : null}
                      </div>
                    </div>

                    {points.length > 0 ? (
                      <div className="space-y-4 px-6">
                        {points.map((point, pointIndex) => (
                          <div key={`${card._key ?? index}-point-${pointIndex}`} className="flex items-start gap-3">
                            <span className={["mt-0.5 flex-shrink-0", toneStyles[tone].bullet].join(" ")}>
                              <CheckIcon className="h-5 w-5" aria-hidden />
                            </span>
                            <p className="leading-relaxed text-[color:var(--muted-foreground)]">{point}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {processCard ? (
              <article className="flex flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/60 py-6 shadow-sm">
                <div className="px-6">
                  {processCard.title ? (
                    <h3 className="font-serif text-xl font-semibold text-[color:var(--foreground)]">
                      {processCard.title}
                    </h3>
                  ) : null}
                </div>
                {processSteps.length > 0 ? (
                  <div className="space-y-3 px-6">
                    {processSteps.map((step, stepIndex) => (
                      <div
                        key={step._key ?? `${step.label ?? "step"}-${stepIndex}`}
                        className="flex items-center justify-between border-b border-[color:var(--border)]/60 py-3 last:border-b-0"
                      >
                        <span className="font-medium text-[color:var(--foreground)]">{step.label}</span>
                        {step.duration ? (
                          <span className="text-sm text-[color:var(--muted-foreground)]">{step.duration}</span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ) : null}

            {metricsCard ? (
              <article className="flex flex-col gap-6 rounded-xl border border-[color:var(--primary)]/20 bg-[color:var(--primary)] py-6 text-[color:var(--primary-foreground)] shadow-sm">
                <div className="px-6">
                  {metricsCard.title ? (
                    <h3 className="font-serif text-xl font-semibold">{metricsCard.title}</h3>
                  ) : null}
                </div>
                {metrics.length > 0 ? (
                  <div className="space-y-3 px-6">
                    {metrics.map((metric, metricIndex) => (
                      <div
                        key={metric._key ?? `${metric.label ?? "metric"}-${metricIndex}`}
                        className="flex items-center justify-between"
                      >
                        <span>{metric.label}</span>
                        <span className="font-semibold">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
