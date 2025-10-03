import Image from "next/image";
import Link from "next/link";
import { stegaClean } from "next-sanity";

import type { PAGE_QUERYResult } from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";

type ResourcesHeroBlock = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "resourcesHero" }
>;

type Highlight = NonNullable<ResourcesHeroBlock["highlights"]>[number];

type Tone = NonNullable<Highlight["tone"]>;

type IconName = string | null | undefined;

type CTA = { label?: string | null; href?: string | null } | null | undefined;

type ExtendedResourcesHeroBlock = ResourcesHeroBlock & {
  backgroundImage?: Parameters<typeof urlFor>[0] | null;
  overlayOpacity?: number | null;
  primaryCta?: CTA;
  secondaryCta?: CTA;
};

type IconProps = { tone?: Tone | null; name?: IconName };

const toneBadge: Record<Tone, string> = {
  primary: "bg-[color:var(--primary)]/10 text-[color:var(--primary)]",
  secondary: "bg-[color:var(--secondary)]/10 text-[color:var(--secondary)]",
  accent: "bg-[color:var(--accent)]/15 text-[color:var(--accent)]",
};

const highlightGridByCount: Record<number, string> = {
  1: "grid grid-cols-1 gap-6 max-w-xl mx-auto",
  2: "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto",
  3: "grid grid-cols-1 md:grid-cols-3 gap-6",
  4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
};

function Icon({ tone, name }: IconProps) {
  const safeTone = (tone ?? "primary") as Tone;
  const safeName = name ?? "book-open";
  const classes = [
    "inline-flex h-12 w-12 items-center justify-center rounded-full",
    toneBadge[safeTone] ?? toneBadge.primary,
  ].join(" ");

  const iconProps = {
    className: "h-6 w-6",
    strokeWidth: 2,
    stroke: "currentColor" as const,
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (safeName) {
    case "headphones":
      return (
        <span className={classes}>
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
          </svg>
        </span>
      );
    case "sparkles":
      return (
        <span className={classes}>
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="m12 3 1.9 5.8 6.1.2-4.9 3.7 1.8 5.8-5-3.5-5 3.5 1.8-5.8L4 9l6.1-.2Z" />
            <path d="M5 3v4" />
            <path d="M3 5h4" />
            <path d="M19 17v4" />
            <path d="M17 19h4" />
          </svg>
        </span>
      );
    case "users":
      return (
        <span className={classes}>
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 1 1 0 7.75" />
          </svg>
        </span>
      );
    case "globe":
      return (
        <span className={classes}>
          <svg viewBox="0 0 24 24" {...iconProps}>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 0 20" />
            <path d="M12 2a15.3 15.3 0 0 0 0 20" />
          </svg>
        </span>
      );
    case "heart":
      return (
        <span className={classes}>
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3a4.9 4.9 0 0 0-4.5 2A4.9 4.9 0 0 0 7.5 3 5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z" />
          </svg>
        </span>
      );
    case "award":
      return (
        <span className={classes}>
          <svg viewBox="0 0 24 24" {...iconProps}>
            <circle cx="12" cy="8" r="6" />
            <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
          </svg>
        </span>
      );
    case "lightbulb":
      return (
        <span className={classes}>
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2-.6.4-1 1-1 1.8V16H10v-1c0-.8-.4-1.4-1-1.8-1.8-1.1-3-3-3-5.2a6 6 0 0 1 6-6Z" />
          </svg>
        </span>
      );
    case "file-text":
      return (
        <span className={classes}>
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
        </span>
      );
    case "archive":
      return (
        <span className={classes}>
          <svg viewBox="0 0 24 24" {...iconProps}>
            <rect width="20" height="5" x="2" y="3" rx="1" />
            <path d="M5 8v13h14V8" />
            <path d="M10 12h4" />
          </svg>
        </span>
      );
    case "star":
      return (
        <span className={classes}>
          <svg viewBox="0 0 24 24" {...iconProps}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </span>
      );
    case "book-open":
    default:
      return (
        <span className={classes}>
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M12 7v14" />
            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
          </svg>
        </span>
      );
  }
}

function clean(value: string | null | undefined) {
  return typeof value === "string" ? stegaClean(value) : value ?? "";
}

export function ResourcesHero(block: ExtendedResourcesHeroBlock) {
  const {
    heading,
    tagline,
    highlights,
    ctaLabel,
    backgroundImage,
    overlayOpacity,
    primaryCta,
    secondaryCta,
  } = block;

  const safeHeading = clean(heading);
  const safeTagline = clean(tagline);
  const highlightCards = Array.isArray(highlights)
    ? highlights.filter((item): item is Highlight => Boolean(item))
    : [];
  const gridClass =
    highlightGridByCount[highlightCards.length] ?? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  const fallbackPrimaryLabel = clean(ctaLabel);
  const primaryButton =
    primaryCta && primaryCta.label && primaryCta.href
      ? { label: clean(primaryCta.label), href: clean(primaryCta.href) }
      : fallbackPrimaryLabel
      ? { label: fallbackPrimaryLabel, href: "/resources#newsletter" }
      : null;

  const secondaryButton =
    secondaryCta && secondaryCta.label && secondaryCta.href
      ? { label: clean(secondaryCta.label), href: clean(secondaryCta.href) }
      : null;

  const hasBackgroundImage = Boolean(backgroundImage && (backgroundImage as { asset?: { _ref?: string } }).asset?._ref);
  const overlay = Math.max(0, Math.min(100, (overlayOpacity ?? (hasBackgroundImage ? 85 : 0)))) / 100;

  const renderButton = (cta: { label: string; href: string }, variant: "primary" | "secondary") => {
    const classes =
      variant === "primary"
        ? "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-4 shrink-0 [&>svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] border border-transparent bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-xs hover:bg-[color:var(--primary)]/90 h-11 rounded-md px-8"
        : "inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-4 shrink-0 [&>svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] border border-[color:var(--border)] bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--accent)]/10 h-11 rounded-md px-8";

    const href = cta.href.trim();
    const content = (
      <>
        {cta.label}
        {variant === "primary" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
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
        ) : null}
      </>
    );

    const isExternal = /^(https?:\/\/|mailto:|tel:)/i.test(href);

    if (isExternal) {
      return (
        <a key={`${variant}-${href}`} href={href} className={classes}>
          {content}
        </a>
      );
    }

    return (
      <Link key={`${variant}-${href}`} href={href} className={classes} prefetch={false}>
        {content}
      </Link>
    );
  };

  return (
    <section className="relative overflow-hidden bg-[color:var(--background)] py-20 lg:py-32">
      {hasBackgroundImage && backgroundImage ? (
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={urlFor(backgroundImage).width(2400).height(1350).fit("crop").url()}
            alt={clean((backgroundImage as { alt?: string }).alt) || ""}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ backgroundColor: "var(--background)", opacity: overlay }} />
        </div>
      ) : null}

      <div className="relative z-10">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-5xl flex-col text-center">
            <div className="space-y-6">
              {safeHeading ? (
                <h1 className="font-serif text-4xl font-bold text-[color:var(--foreground)] text-balance md:text-5xl lg:text-6xl">
                  {safeHeading}
                </h1>
              ) : null}
              {safeTagline ? (
                <p className="text-xl text-[color:var(--muted-foreground)] leading-relaxed text-pretty md:text-2xl">
                  {safeTagline}
                </p>
              ) : null}
            </div>

            {highlightCards.length > 0 ? (
              <div className={["mt-12", gridClass].join(" ")}>
                {highlightCards.map((card, index) => (
                  <article
                    key={card._key ?? `${card.title ?? "highlight"}-${index}`}
                    className="flex flex-col items-center space-y-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]/90 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Icon tone={card.tone} name={card.icon} />
                    {card.title ? (
                      <h3 className="font-serif text-lg font-semibold text-[color:var(--foreground)]">
                        {clean(card.title)}
                      </h3>
                    ) : null}
                    {card.description ? (
                      <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                        {clean(card.description)}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}

            {(primaryButton || secondaryButton) && (
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {primaryButton ? renderButton(primaryButton, "primary") : null}
                {secondaryButton ? renderButton(secondaryButton, "secondary") : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
