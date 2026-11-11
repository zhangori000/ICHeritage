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
  supportHeading?: string | null;
  supportBody?: string | null;
  supportLinks?: Array<{
    _key?: string;
    label?: string | null;
    href?: string | null;
  }> | null;
};

const clean = (value?: string | null) => (value ? stegaClean(value) : "");

const pad = (n: number) => String(n).padStart(2, "0");

// Buttons on the dark band: the first is the seal-red primary, the rest are
// light outlines. Utilities pin the primary's text colour above `.band a`.
const bandButtonClass = (index: number) =>
  index === 0
    ? "btn btn-primary text-[color:var(--primary-foreground)] hover:text-[color:var(--primary-foreground)]"
    : "btn btn-light hover:text-[color:var(--ink)]";

function renderSupportLink(link: { label: string; href: string }, key: string, index: number) {
  const hrefValue = link.href ?? "";
  const normalizedHref = hrefValue.startsWith("#") ? "/volunteer" : hrefValue;
  const isInternal = normalizedHref.startsWith("/");
  const className = bandButtonClass(index);

  if (isInternal) {
    return (
      <Link key={key} href={normalizedHref} className={className}>
        {link.label}
      </Link>
    );
  }

  return (
    <a key={key} href={normalizedHref || "#"} className={className}>
      {link.label}
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

  const supportCtas = Array.isArray(supportLinks)
    ? supportLinks
        .map((link) => ({
          _key: link?._key ?? link?.label ?? crypto.randomUUID(),
          label: clean(link?.label),
          href: clean(link?.href),
        }))
        .filter((link) => link.label && link.href)
    : [];

  const hasHeader = Boolean(heading || intro);
  const hasProcess = Boolean(processHeading || processSubheading || stepList.length > 0);
  const hasRequirements = Boolean(
    requirementsHeading || requirementsIntro || requirementItems.length > 0
  );
  const hasSupport = Boolean(supportHeading || supportBody || supportCtas.length > 0);
  const hasPaperContent = hasHeader || hasProcess || hasRequirements;

  return (
    <section id={anchor}>
      {hasPaperContent ? (
        <div className="bg-[color:var(--paper)] py-20 md:py-28">
          <div className="wrap">
            {hasHeader ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end">
                {heading ? (
                  <h2 className="display text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
                    {clean(heading)}
                  </h2>
                ) : null}
                {intro ? (
                  <p className="max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)] md:justify-self-end">
                    {clean(intro)}
                  </p>
                ) : null}
              </div>
            ) : null}

            {hasProcess ? (
              <div className={hasHeader ? "mt-16" : ""}>
                {processHeading || processSubheading ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end">
                    {processHeading ? (
                      <h3 className="font-serif text-3xl text-[color:var(--ink)] md:text-4xl">
                        {clean(processHeading)}
                      </h3>
                    ) : null}
                    {processSubheading ? (
                      <p className="max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)] md:justify-self-end">
                        {clean(processSubheading)}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {stepList.length > 0 ? (
                  <ol
                    className={[
                      "border-t border-[color:var(--ink)]",
                      processHeading || processSubheading ? "mt-8" : "",
                    ].join(" ")}
                  >
                    {stepList.map((step, index) => {
                      if (!step.title && !step.description) return null;
                      return (
                        <li
                          key={step._key}
                          className="grid grid-cols-1 gap-x-10 gap-y-3 border-b border-[color:var(--hairline)] py-8 md:grid-cols-[6rem_minmax(0,1fr)] lg:grid-cols-[6rem_minmax(0,20rem)_minmax(0,1fr)]"
                        >
                          <span
                            className="font-serif text-5xl font-light leading-none text-[color:var(--ink-faint)] md:text-6xl"
                            aria-hidden
                          >
                            {pad(index + 1)}
                          </span>
                          <div className="md:col-start-2">
                            {step.title ? (
                              <h4 className="font-serif text-2xl text-[color:var(--ink)]">{step.title}</h4>
                            ) : null}
                            {step.timeEstimate ? (
                              <p className="eyebrow mt-3">{step.timeEstimate}</p>
                            ) : null}
                          </div>
                          {step.description ? (
                            <p className="text-[15px] leading-relaxed text-[color:var(--ink-soft)] md:col-start-2 lg:col-start-3">
                              {step.description}
                            </p>
                          ) : null}
                        </li>
                      );
                    })}
                  </ol>
                ) : null}
              </div>
            ) : null}

            {hasRequirements ? (
              <div
                className={[
                  "grid grid-cols-1 gap-x-16 gap-y-8 border-t border-[color:var(--ink)] pt-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
                  hasHeader || hasProcess ? "mt-16" : "",
                ].join(" ")}
              >
                <div>
                  {requirementsHeading ? (
                    <h3 className="font-serif text-3xl text-[color:var(--ink)] md:text-4xl">
                      {clean(requirementsHeading)}
                    </h3>
                  ) : null}
                  {requirementsIntro ? (
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-[color:var(--ink-soft)]">
                      {clean(requirementsIntro)}
                    </p>
                  ) : null}
                </div>
                {requirementItems.length > 0 ? (
                  <ul>
                    {requirementItems.map((item) => (
                      <li
                        key={item._key}
                        className="border-b border-[color:var(--hairline)] py-4 text-[15px] leading-relaxed text-[color:var(--ink-soft)] first:border-t first:border-t-[color:var(--hairline)] lg:first:border-t-0 lg:first:pt-0"
                      >
                        {item.text}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {hasSupport ? (
        <div className="band py-20 md:py-28">
          <div className="wrap">
            <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,3fr)_auto] lg:items-end">
              <div>
                {supportHeading ? (
                  <h3 className="display text-3xl text-[color:var(--band-text)] md:text-4xl lg:text-5xl">
                    {clean(supportHeading)}
                  </h3>
                ) : null}
                {supportBody ? (
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-[color:var(--band-muted)]">
                    {clean(supportBody)}
                  </p>
                ) : null}
              </div>
              {supportCtas.length > 0 ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {supportCtas.map((link, index) =>
                    renderSupportLink({ label: link.label, href: link.href }, link._key, index)
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
