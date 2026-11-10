"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

type Executive = {
  _key?: string;
  name?: string | null;
  title?: string | null;
  credential?: string | null;
  bio?: string | null;
  headshot?: {
    asset?: { _ref?: string } | null;
    alt?: string | null;
  } | null;
  linkedin?: string | null;
  email?: string | null;
};

type Advisor = {
  _key?: string;
  name?: string | null;
  role?: string | null;
  expertise?: string | null;
  bio?: string | null;
};

type CTA = {
  label?: string | null;
  href?: string | null;
} | null | undefined;

type LeadershipSectionProps = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: string | null;
  executiveHeading?: string | null;
  executiveSubheading?: string | null;
  executiveTeam?: Executive[] | null;
  advisoryHeading?: string | null;
  advisorySubheading?: string | null;
  advisors?: Advisor[] | null;
  ctaCard?: {
    heading?: string | null;
    body?: string | null;
    primaryCta?: CTA;
    secondaryCta?: CTA;
  } | null;
} & Record<string, unknown>;

const placeholderHeadshot = "/placeholder-user.webp";

type ButtonVariant = "link" | "primary" | "secondary";

const buttonClasses: Record<ButtonVariant, string> = {
  link: "textlink text-sm",
  primary: "btn btn-primary",
  secondary: "btn",
};

/* Sub-section header: a rule, then heading and subheading side by side. */
function GroupHeader({
  heading,
  subheading,
}: {
  heading?: string | null;
  subheading?: string | null;
}) {
  if (!heading && !subheading) return null;
  return (
    <div className="grid grid-cols-1 gap-3 border-t border-[color:var(--ink)] pt-6 md:grid-cols-2 md:gap-16">
      {heading ? (
        <h3 className="font-serif text-2xl text-[color:var(--ink)] md:text-3xl">{heading}</h3>
      ) : null}
      {subheading ? (
        <p className="max-w-md text-[15px] leading-relaxed text-[color:var(--ink-muted)] md:justify-self-end">
          {subheading}
        </p>
      ) : null}
    </div>
  );
}

export function LeadershipSection({
  sectionId,
  heading,
  intro,
  executiveHeading,
  executiveSubheading,
  executiveTeam,
  advisoryHeading,
  advisorySubheading,
  advisors,
  ctaCard,
}: LeadershipSectionProps) {
  const anchor = sectionId?.trim() ? sectionId.trim() : undefined;
  const executives = Array.isArray(executiveTeam) ? executiveTeam : [];
  const advisorItems = Array.isArray(advisors) ? advisors : [];

  const renderActionButton = (
    cta: CTA,
    content: React.ReactNode,
    variant: ButtonVariant,
    ariaLabel?: string
  ) => {
    if (!cta?.label && !cta?.href) return null;
    const href = cta?.href?.trim();
    const label = ariaLabel ?? cta?.label ?? "";

    if (!href) {
      return (
        <span className={`${buttonClasses[variant]} cursor-default`} aria-disabled>
          {content}
        </span>
      );
    }

    const isExternal = /^(https?:\/\/)/i.test(href);

    if (isExternal) {
      return (
        <a
          href={href}
          className={buttonClasses[variant]}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
        >
          {content}
        </a>
      );
    }

    if (href.startsWith("mailto:")) {
      return (
        <a href={href} className={buttonClasses[variant]} aria-label={label}>
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={buttonClasses[variant]} aria-label={label}>
        {content}
      </Link>
    );
  };

  return (
    <section id={anchor} className="bg-[color:var(--paper-deep)] py-20 md:py-28">
      <div className="wrap">
        {/* Heading left, intro right. */}
        {(heading || intro) && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
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
        )}

        {/* Executive team: framed portraits in a grid. */}
        {executives.length > 0 ? (
          <div className="mt-16 md:mt-20">
            <GroupHeader heading={executiveHeading} subheading={executiveSubheading} />

            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {executives.map((exec, index) => {
                const imageUrl = exec.headshot?.asset?._ref
                  ? urlFor(exec.headshot).width(720).height(720).fit("crop").url()
                  : placeholderHeadshot;

                const linkedInCta: CTA = exec.linkedin
                  ? { label: `${exec.name ?? ""} on LinkedIn`, href: exec.linkedin }
                  : null;
                const emailHref = exec.email?.includes("@") ? `mailto:${exec.email}` : exec.email;
                const emailCta: CTA = exec.email
                  ? { label: `Email ${exec.name ?? "team member"}`, href: emailHref }
                  : null;

                return (
                  <article key={exec._key ?? `${exec.name ?? "executive"}-${index}`}>
                    <div className="aspect-square border border-[color:var(--ink)]">
                      <Image
                        alt={exec.headshot?.alt || exec.name || "Team member"}
                        src={imageUrl}
                        width={720}
                        height={720}
                        className="block h-full w-full object-cover"
                      />
                    </div>

                    {exec.name ? (
                      <h4 className="mt-5 font-serif text-xl text-[color:var(--ink)]">{exec.name}</h4>
                    ) : null}
                    {exec.title ? <p className="eyebrow mt-2">{exec.title}</p> : null}
                    {exec.credential ? (
                      <p className="mt-2 text-sm text-[color:var(--ink-muted)]">{exec.credential}</p>
                    ) : null}

                    {exec.bio ? (
                      <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
                        {exec.bio}
                      </p>
                    ) : null}

                    {(linkedInCta || emailCta) && (
                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                        {renderActionButton(
                          linkedInCta,
                          <span>LinkedIn</span>,
                          "link",
                          linkedInCta?.label ?? undefined
                        )}
                        {renderActionButton(
                          emailCta,
                          <span>Email</span>,
                          "link",
                          emailCta?.label ?? undefined
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Advisors: a list of rows divided by hairlines. */}
        {advisorItems.length > 0 ? (
          <div className="mt-16 md:mt-20">
            <GroupHeader heading={advisoryHeading} subheading={advisorySubheading} />

            <ul className="mt-10 list-none border-t border-[color:var(--hairline)] p-0">
              {advisorItems.map((advisor, index) => (
                <li
                  key={advisor._key ?? `${advisor.name ?? "advisor"}-${index}`}
                  className="grid grid-cols-1 gap-3 border-b border-[color:var(--hairline)] py-6 md:grid-cols-12 md:gap-8"
                >
                  <div className="md:col-span-4">
                    {advisor.name ? (
                      <h4 className="font-serif text-xl text-[color:var(--ink)]">{advisor.name}</h4>
                    ) : null}
                    {advisor.role ? <p className="eyebrow mt-2">{advisor.role}</p> : null}
                  </div>
                  {advisor.expertise ? (
                    <p className="text-sm text-[color:var(--ink-muted)] md:col-span-3">
                      {advisor.expertise}
                    </p>
                  ) : null}
                  {advisor.bio ? (
                    <p className="text-[15px] leading-relaxed text-[color:var(--ink-soft)] md:col-span-5 md:col-start-8">
                      {advisor.bio}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Closing call to action under a rule, left-aligned. */}
        {ctaCard ? (
          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-[color:var(--ink)] pt-10 md:mt-20 md:grid-cols-2 md:gap-16 md:pt-12">
            {ctaCard.heading ? (
              <h3 className="font-serif text-2xl text-[color:var(--ink)] md:text-3xl">
                {ctaCard.heading}
              </h3>
            ) : null}
            <div className="max-w-md md:justify-self-end">
              {ctaCard.body ? (
                <p className="text-lg leading-relaxed text-[color:var(--ink-soft)]">{ctaCard.body}</p>
              ) : null}
              {(ctaCard.primaryCta?.label || ctaCard.secondaryCta?.label) && (
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  {ctaCard.primaryCta?.label
                    ? renderActionButton(
                        ctaCard.primaryCta,
                        <span>{ctaCard.primaryCta.label}</span>,
                        "primary"
                      )
                    : null}
                  {ctaCard.secondaryCta?.label
                    ? renderActionButton(
                        ctaCard.secondaryCta,
                        <span>{ctaCard.secondaryCta.label}</span>,
                        "secondary"
                      )
                    : null}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
