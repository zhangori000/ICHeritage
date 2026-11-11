import Link from "next/link";
import * as React from "react";
import { stegaClean } from "next-sanity";

import type { PAGE_QUERY_RESULT } from "@/sanity/types";
import { BlurUpImage } from "@/components/BlurUpImage";
import { urlFor } from "@/sanity/lib/image";

type ColorLike =
  | {
      _type?: "color";
      hex?: string;
      alpha?: number | null;
      rgb?: { r?: number; g?: number; b?: number; a?: number | null };
      hsl?: { h?: number; s?: number; l?: number; a?: number | null };
    }
  | null
  | undefined;

type ResourcesHeroBlock = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["content"]>[number],
  { _type: "resourcesHero" }
>;

type Highlight = NonNullable<ResourcesHeroBlock["highlights"]>[number];

type CTA = { label?: string | null; href?: string | null } | null | undefined;

type ExtendedResourcesHeroBlock = ResourcesHeroBlock & {
  backgroundImage?: Parameters<typeof urlFor>[0] | null;
  backgroundLqip?: string | null;
  overlayOpacity?: number | null;
  primaryCta?: CTA;
  secondaryCta?: CTA;
  headingColor?: ColorLike;
  taglineColor?: ColorLike;
  highlightTitleColor?: ColorLike;
  highlightBodyColor?: ColorLike;
  enablePetalAnimation?: boolean | null;
};

function clean(value: string | null | undefined) {
  return typeof value === "string" ? stegaClean(value) : value ?? "";
}

const PETAL_COUNT = 36;
const PETAL_COLORS = [
  "rgba(255,240,246,0.9)",
  "rgba(255,220,235,0.75)",
  "rgba(255,228,240,0.85)",
  "rgba(255,255,255,0.9)",
];

/**
 * Resources page opener. Paper background, two columns: copy and buttons on
 * the left, the Studio "background image" shown as a framed portrait photo on
 * the right. Highlights render as a hairline list under the copy.
 *
 * The Studio colour overrides (headingColor, taglineColor, highlight colours)
 * existed to keep text legible over the old full-bleed photo; now that the
 * text sits on paper they are not applied.
 */
export function ResourcesHero(block: ExtendedResourcesHeroBlock) {
  const {
    heading,
    tagline,
    highlights,
    ctaLabel,
    backgroundImage,
    backgroundLqip,
    primaryCta,
    secondaryCta,
    enablePetalAnimation,
  } = block;

  const safeHeading = clean(heading);
  const safeTagline = clean(tagline);
  const highlightItems = Array.isArray(highlights)
    ? highlights.filter((item): item is Highlight => Boolean(item))
    : [];

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

  const hasImage = Boolean(
    backgroundImage && (backgroundImage as { asset?: { _ref?: string } }).asset?._ref
  );

  const petalRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const petals = React.useMemo(() => Array.from({ length: PETAL_COUNT }, (_, index) => index), []);

  React.useEffect(() => {
    if (!enablePetalAnimation) return undefined;
    let ctx: { revert(): void } | undefined;
    let cancelled = false;

    const init = async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const randomize = (petal: HTMLElement) => {
        const startX = Math.random() * 120 - 10;
        const startY = -20 - Math.random() * 20;
        const scale = 0.5 + Math.random() * 0.7;
        gsap.set(petal, {
          x: `${startX}vw`,
          y: `${startY}vh`,
          opacity: 0,
          rotation: Math.random() * 360,
          scale,
          filter: `blur(${Math.random() * 1.4}px)`,
        });
      };

      ctx = gsap.context(() => {
        petalRefs.current.forEach((petal) => {
          if (!petal) return;
          randomize(petal);
          const drift = 20 + Math.random() * 60;
          const horizontalDirection = Math.random() > 0.5 ? 1 : -1;
          const duration = 18 + Math.random() * 8;
          gsap.to(petal, {
            y: "110vh",
            x: `+=${horizontalDirection * drift}vw`,
            opacity: 0.55 + Math.random() * 0.4,
            rotation: "+=220",
            ease: "sine.inOut",
            duration,
            delay: Math.random() * 6,
            repeat: -1,
            repeatDelay: Math.random() * 2,
            onRepeat: () => {
              if (!petal) return;
              randomize(petal);
            },
          });
        });
      });
    };

    init();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [enablePetalAnimation]);

  const renderButton = (cta: { label: string; href: string }, variant: "primary" | "secondary") => {
    const classes = variant === "primary" ? "btn btn-primary" : "btn";
    const href = cta.href.trim();
    const isExternal = /^(https?:\/\/|mailto:|tel:)/i.test(href);

    if (isExternal) {
      return (
        <a key={`${variant}-${href}`} href={href} className={classes}>
          {cta.label}
        </a>
      );
    }

    return (
      <Link key={`${variant}-${href}`} href={href} className={classes} prefetch={false}>
        {cta.label}
      </Link>
    );
  };

  return (
    <section className="relative overflow-hidden bg-[color:var(--paper)] py-20 md:py-28">
      {enablePetalAnimation ? (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {petals.map((index) => (
            <span
              key={index}
              ref={(el) => {
                petalRefs.current[index] = el;
              }}
              className="absolute left-0 top-0 h-10 w-6 origin-center rounded-full opacity-0"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${PETAL_COLORS[index % PETAL_COLORS.length]} 0%, rgba(255,255,255,0) 70%)`,
              }}
            />
          ))}
        </div>
      ) : null}

      <div className="wrap relative z-20">
        <div
          className={[
            "grid gap-12 lg:gap-16",
            hasImage ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start" : "",
          ].join(" ")}
        >
          <div className="rise">
            {safeHeading ? (
              <h1 className="display text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
                {safeHeading}
              </h1>
            ) : null}

            {safeTagline ? (
              <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-[color:var(--ink-soft)] md:text-xl">
                {safeTagline}
              </p>
            ) : null}

            {primaryButton || secondaryButton ? (
              <div className="mt-10 flex flex-wrap gap-3">
                {primaryButton ? renderButton(primaryButton, "primary") : null}
                {secondaryButton ? renderButton(secondaryButton, "secondary") : null}
              </div>
            ) : null}

            {highlightItems.length > 0 ? (
              <ul className="mt-14 border-t border-[color:var(--ink)]">
                {highlightItems.map((item, index) => {
                  const title = clean(item.title);
                  const description = clean(item.description);
                  if (!title && !description) return null;
                  return (
                    <li
                      key={item._key ?? `${item.title ?? "highlight"}-${index}`}
                      className="grid gap-1 border-b border-[color:var(--hairline)] py-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6"
                    >
                      {title ? (
                        <h3 className="font-serif text-xl leading-snug text-[color:var(--ink)]">
                          {title}
                        </h3>
                      ) : (
                        <span aria-hidden />
                      )}
                      {description ? (
                        <p className="text-[15px] leading-relaxed text-[color:var(--ink-muted)]">
                          {description}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {hasImage && backgroundImage ? (
            <figure className="lg:pt-2">
              <div className="relative aspect-[4/5] overflow-hidden border border-[color:var(--ink)] bg-[color:var(--paper-slot)]">
                <BlurUpImage
                  src={urlFor(backgroundImage).width(1200).height(1500).fit("crop").url()}
                  alt={clean((backgroundImage as { alt?: string }).alt) || ""}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  lqip={backgroundLqip}
                  hotspot={(backgroundImage as { hotspot?: { x?: number; y?: number } }).hotspot}
                  className="object-cover"
                  priority
                />
              </div>
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}
