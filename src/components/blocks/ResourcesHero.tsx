import type { CSSProperties } from "react";
import Link from "next/link";
import { stegaClean } from "next-sanity";

import type { PAGE_QUERYResult } from "@/sanity/types";

type ResourcesHeroBlock = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "resourcesHero" }
>;

type Highlight = NonNullable<ResourcesHeroBlock["highlights"]>[number];

type Tone = NonNullable<Highlight["tone"]>;

type IconName = NonNullable<Highlight["icon"]>;

type IconProps = { tone: Tone; name: IconName };

const toneBadge: Record<Tone, string> = {
  primary: "bg-[color:var(--primary)]/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/20 text-accent",
};

const toneShadow: Record<Tone, string> = {
  primary: "shadow-[0_16px_40px_rgba(167,52,56,0.18)]",
  secondary: "shadow-[0_16px_40px_rgba(90,107,79,0.16)]",
  accent: "shadow-[0_16px_40px_rgba(240,230,210,0.28)]",
};

const highlightGridByCount: Record<number, string> = {
  1: "grid grid-cols-1 gap-6 max-w-xl mx-auto",
  2: "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto",
  3: "grid grid-cols-1 md:grid-cols-3 gap-6",
  4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
};

function Icon({ tone, name }: IconProps) {
  const classes = [
    "inline-flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300",
    toneBadge[tone] ?? toneBadge.primary,
    toneShadow[tone] ?? toneShadow.primary,
  ].join(" ");

  const iconProps = {
    className: "h-6 w-6",
    strokeWidth: 2,
    stroke: "currentColor" as const,
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "headphones":
      return (
        <span className={classes}>
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
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

export function ResourcesHero({ heading, tagline, highlights, ctaLabel }: ResourcesHeroBlock) {
  const safeHeading = clean(heading);
  const safeTagline = clean(tagline);
  const highlightCards = Array.isArray(highlights)
    ? highlights.filter((item): item is Highlight => Boolean(item))
    : [];
  const gridClass = highlightGridByCount[highlightCards.length] ?? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
  const ctaText = clean(ctaLabel) || "Start Exploring";
  const ctaHref = "/resources#newsletter";

  const gradientVars: CSSProperties = {
    '--tw-gradient-from': 'var(--background)',
    '--tw-gradient-via': 'color-mix(in oklab, var(--muted) 30%, transparent)',
    '--tw-gradient-to': 'color-mix(in oklab, var(--muted) 60%, var(--background) 40%)',
    '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to)',
  } as CSSProperties;

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br" style={gradientVars}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            {safeHeading ? (
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-[color:var(--foreground)] text-balance">
                {safeHeading}
              </h1>
            ) : null}
            {safeTagline ? (
              <p className="text-xl md:text-2xl text-[color:var(--foreground)]/80 leading-relaxed text-balance">
                {safeTagline}
              </p>
            ) : null}
          </div>

          {highlightCards.length > 0 ? (
            <div className={gridClass}>
              {highlightCards.map((card) => {
                const tone = card.tone ?? 'primary';
                return (
                  <article
                    key={card._key}
                    className="flex flex-col items-center space-y-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] p-6 transition-shadow duration-300 hover:shadow-lg"
                  >
                    <Icon tone={tone} name={card.icon ?? 'book-open'} />
                    {card.title ? (
                      <h3 className="font-serif text-lg font-semibold text-[color:var(--foreground)] text-center">
                        {clean(card.title)}
                      </h3>
                    ) : null}
                    {card.description ? (
                      <p className="text-sm text-[color:var(--foreground)]/80 text-center leading-relaxed">
                        {clean(card.description)}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : null}

          <div className="pt-10">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-4 shrink-0 [&>svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border border-transparent bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-xs hover:bg-[color:var(--primary)]/90 h-10 rounded-md has-[>svg]:px-4 px-8"
            >
              {ctaText}
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
                className="lucide lucide-arrow-right h-5 w-5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}