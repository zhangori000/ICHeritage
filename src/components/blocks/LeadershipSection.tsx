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

const placeholderHeadshot = "/placeholder-user.png";

type ButtonVariant = "icon" | "primary" | "secondary";

const buttonClasses: Record<ButtonVariant, string> = {
  icon: "inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium transition-all hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)]",
  primary:
    "inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-all bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary)]/90",
  secondary:
    "inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-all border border-[color:var(--border)] bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--accent)]/10",
};

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
  const sectionStyle = React.useMemo(
    () => ({
      backgroundColor: "color-mix(in oklab, var(--muted) 30%, transparent)",
    }),
    []
  );

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
    <section id={anchor} className="bg-[#f0e6d2] py-20" style={sectionStyle}>
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

          {executives.length > 0 ? (
            <div className="space-y-8">
              {(executiveHeading || executiveSubheading) && (
                <div className="text-center">
                  {executiveHeading ? (
                    <h3 className="mb-4 font-serif text-2xl font-bold text-[color:var(--foreground)] md:text-3xl">
                      {executiveHeading}
                    </h3>
                  ) : null}
                  {executiveSubheading ? (
                    <p className="text-[color:var(--muted-foreground)]">{executiveSubheading}</p>
                  ) : null}
                </div>
              )}

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {executives.map((exec, index) => {
                  const imageUrl = exec.headshot?.asset?._ref
                    ? urlFor(exec.headshot).width(192).height(192).fit("crop").url()
                    : placeholderHeadshot;

                  const linkedInCta: CTA = exec.linkedin
                    ? { label: `${exec.name ?? ""} on LinkedIn`, href: exec.linkedin }
                    : null;
                  const emailHref = exec.email?.includes("@") ? `mailto:${exec.email}` : exec.email;
                  const emailCta: CTA = exec.email
                    ? { label: `Email ${exec.name ?? "team member"}`, href: emailHref }
                    : null;

                  return (
                    <article
                      key={exec._key ?? `${exec.name ?? "executive"}-${index}`}
                      className="flex flex-col gap-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="space-y-4 px-6">
                        <div className="mx-auto h-24 w-24 overflow-hidden rounded-full">
                          <Image
                            alt={exec.headshot?.alt || exec.name || "Team member"}
                            src={imageUrl}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          {exec.name ? (
                            <h4 className="font-serif text-xl font-semibold text-[color:var(--foreground)]">
                              {exec.name}
                            </h4>
                          ) : null}
                          {exec.title ? (
                            <span className="inline-flex items-center rounded-full border border-[color:var(--border)] px-3 py-1 text-xs font-semibold text-[color:var(--foreground)]">
                              {exec.title}
                            </span>
                          ) : null}
                          {exec.credential ? (
                            <p className="text-xs text-[color:var(--muted-foreground)]">
                              {exec.credential}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      {exec.bio ? (
                        <p className="px-6 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                          {exec.bio}
                        </p>
                      ) : null}

                      {(linkedInCta || emailCta) && (
                        <div className="flex justify-center gap-3 px-6">
                          {renderActionButton(
                            linkedInCta,
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                              aria-hidden
                            >
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6Z" />
                              <rect width="4" height="12" x="2" y="9" />
                              <circle cx="4" cy="4" r="2" />
                            </svg>,
                            "icon",
                            linkedInCta?.label ?? undefined
                          )}
                          {renderActionButton(
                            emailCta,
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                              aria-hidden
                            >
                              <rect width="20" height="16" x="2" y="4" rx="2" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>,
                            "icon",
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

          {advisorItems.length > 0 ? (
            <div className="space-y-8">
              {(advisoryHeading || advisorySubheading) && (
                <div className="text-center">
                  {advisoryHeading ? (
                    <h3 className="mb-4 font-serif text-2xl font-bold text-[color:var(--foreground)] md:text-3xl">
                      {advisoryHeading}
                    </h3>
                  ) : null}
                  {advisorySubheading ? (
                    <p className="text-[color:var(--muted-foreground)]">{advisorySubheading}</p>
                  ) : null}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {advisorItems.map((advisor, index) => (
                  <article
                    key={advisor._key ?? `${advisor.name ?? "advisor"}-${index}`}
                    className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] py-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
                  >
                    <div className="space-y-3 px-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          {advisor.name ? (
                            <h4 className="font-serif text-lg font-semibold text-[color:var(--foreground)]">
                              {advisor.name}
                            </h4>
                          ) : null}
                          {advisor.role ? (
                            <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
                              {advisor.role}
                            </p>
                          ) : null}
                        </div>
                        {advisor.expertise ? (
                          <span className="inline-flex items-center rounded-full border border-[color:var(--border)] px-3 py-1 text-xs font-semibold text-[color:var(--foreground)]">
                            {advisor.expertise}
                          </span>
                        ) : null}
                      </div>

                      {advisor.bio ? (
                        <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                          {advisor.bio}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {ctaCard ? (
            <article className="rounded-xl border-2 border-dashed border-[color:var(--border)] bg-[color:var(--background)] py-8 shadow-sm">
              <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-8 text-center">
                {ctaCard.heading ? (
                  <h3 className="font-serif text-2xl font-bold text-[color:var(--foreground)] md:text-3xl">
                    {ctaCard.heading}
                  </h3>
                ) : null}
                {ctaCard.body ? (
                  <p className="text-lg text-[color:var(--muted-foreground)] leading-relaxed">
                    {ctaCard.body}
                  </p>
                ) : null}
                <div className="flex flex-col gap-4 sm:flex-row">
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
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
