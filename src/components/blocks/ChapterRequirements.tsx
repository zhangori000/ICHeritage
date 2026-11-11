"use client";

import * as React from "react";

type RequirementCard = {
  _key?: string;
  title?: string | null;
  /** Kept for the Sanity schema; the editorial layout renders no icons. */
  icon?: string | null;
  /** Kept for the Sanity schema; the editorial layout has a single tone. */
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

const pad = (n: number) => String(n).padStart(2, "0");

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
  const hasProcess = Boolean(processCard && (processCard.title || processSteps.length > 0));
  const hasMetrics = Boolean(metricsCard && (metricsCard.title || metrics.length > 0));

  return (
    <section id={anchor} className="bg-[color:var(--paper)] py-20 md:py-28">
      <div className="wrap">
        {heading || intro ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end">
            {heading ? (
              <h2 className="display text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
                {heading}
              </h2>
            ) : null}
            {intro ? (
              <p className="max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)] md:justify-self-end">
                {intro}
              </p>
            ) : null}
          </div>
        ) : null}

        {requirementCards.length > 0 ? (
          <ol className="mt-14 border-t border-[color:var(--ink)]">
            {requirementCards.map((card, index) => {
              const points = Array.isArray(card.points)
                ? card.points.filter((point): point is string => Boolean(point))
                : [];

              return (
                <li
                  key={card._key ?? `${card.title ?? "card"}-${index}`}
                  className="grid grid-cols-1 gap-x-10 gap-y-4 border-b border-[color:var(--hairline)] py-10 md:grid-cols-[6rem_minmax(0,1fr)] lg:grid-cols-[6rem_minmax(0,20rem)_minmax(0,1fr)]"
                >
                  <span
                    className="font-serif text-5xl font-light leading-none text-[color:var(--ink-faint)] md:text-6xl"
                    aria-hidden
                  >
                    {pad(index + 1)}
                  </span>

                  {card.title ? (
                    <h3 className="font-serif text-2xl text-[color:var(--ink)] md:col-start-2">{card.title}</h3>
                  ) : null}

                  {points.length > 0 ? (
                    <ul className="grid grid-cols-1 gap-x-10 md:col-start-2 lg:col-start-3 lg:grid-cols-2">
                      {points.map((point, pointIndex) => (
                        <li
                          key={`${card._key ?? index}-point-${pointIndex}`}
                          className="border-t border-[color:var(--hairline)] py-3 text-[15px] leading-relaxed text-[color:var(--ink-soft)] first:border-t-0 first:pt-0 lg:[&:nth-child(2)]:border-t-0 lg:[&:nth-child(2)]:pt-0"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ol>
        ) : null}

        {hasProcess || hasMetrics ? (
          <div
            className={[
              "grid grid-cols-1 gap-y-12",
              requirementCards.length > 0 ? "mt-16" : "mt-14",
              hasProcess && hasMetrics ? "lg:grid-cols-2" : "",
            ].join(" ")}
          >
            {hasProcess ? (
              <div className={hasProcess && hasMetrics ? "lg:border-r lg:border-[color:var(--hairline)] lg:pr-12" : ""}>
                {processCard?.title ? (
                  <h3 className="eyebrow">{processCard.title}</h3>
                ) : null}
                {processSteps.length > 0 ? (
                  <ol className="mt-5 border-t border-[color:var(--ink)]">
                    {processSteps.map((step, stepIndex) => (
                      <li
                        key={step._key ?? `${step.label ?? "step"}-${stepIndex}`}
                        className="flex items-baseline justify-between gap-6 border-b border-[color:var(--hairline)] py-4"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-serif text-sm text-[color:var(--ink-faint)]" aria-hidden>
                            {pad(stepIndex + 1)}
                          </span>
                          <span className="text-[15px] text-[color:var(--ink)]">{step.label}</span>
                        </span>
                        {step.duration ? (
                          <span className="eyebrow shrink-0">{step.duration}</span>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>
            ) : null}

            {hasMetrics ? (
              <div className={hasProcess && hasMetrics ? "lg:pl-12" : ""}>
                {metricsCard?.title ? (
                  <h3 className="eyebrow eyebrow-rule">{metricsCard.title}</h3>
                ) : null}
                {metrics.length > 0 ? (
                  <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
                    {metrics.map((metric, metricIndex) => (
                      <div
                        key={metric._key ?? `${metric.label ?? "metric"}-${metricIndex}`}
                        className="border-t border-[color:var(--hairline)] pt-3"
                      >
                        <dt className="eyebrow">{metric.label}</dt>
                        <dd className="mt-2 font-serif text-2xl text-[color:var(--ink)] md:text-3xl">
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
