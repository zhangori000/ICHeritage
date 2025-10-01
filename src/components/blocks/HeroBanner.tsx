// src/components/blocks/HeroBanner.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { PAGE_QUERYResult } from "@/sanity/types";

/** Color from @sanity/color-input (loose shape) */
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

/** Safely convert Sanity color object to a CSS color string */
function toCssColor(c: ColorLike, fallback = "var(--foreground)"): string {
  if (!c) return fallback;
  if (c.hex) return c.hex;
  if (
    c.rgb &&
    typeof c.rgb.r === "number" &&
    typeof c.rgb.g === "number" &&
    typeof c.rgb.b === "number"
  ) {
    const a = typeof c.rgb.a === "number" ? c.rgb.a : 1;
    return `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${a})`;
  }
  if (
    c.hsl &&
    typeof c.hsl.h === "number" &&
    typeof c.hsl.s === "number" &&
    typeof c.hsl.l === "number"
  ) {
    const a = typeof c.hsl.a === "number" ? c.hsl.a : 1;
    return `hsla(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%, ${a})`;
  }
  return fallback;
}

/** Narrow the block type to your heroBanner block from PAGE_QUERYResult */
type HeroBannerBlock = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["content"]>[number],
  { _type: "heroBanner" }
>;

export function HeroBanner({
  background,
  overlayOpacity, // 0..100 (schema default 0)
  title,
  titleColor,
  kicker,
  kickerColor,
  body,
  bodyColor,
  primaryCta,
  secondaryCta,
}: HeroBannerBlock) {
  // --- IMAGE-ONLY OVERLAY (never dims the text) -----------------------------
  const overlay = Math.max(0, Math.min(100, overlayOpacity ?? 0)) / 100;

  // Resolve text colors (fallbacks use your CSS variables)
  const titleCss = toCssColor(titleColor, "var(--foreground)");
  const kickerCss = toCssColor(kickerColor, "var(--primary)");
  const bodyCss = toCssColor(bodyColor, "var(--muted-foreground)");

  // Gentle text shadow for readability on busy images
  const textShadow = "[text-shadow:2px_2px_8px_rgba(0,0,0,0.2)]";

  // --- CTA buttons: same size; left red, right green ------------------------
  const baseCta =
    "inline-flex items-center justify-center whitespace-nowrap transition-all " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "[&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-5 " +
    "shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
    "h-11 rounded-md px-8 text-base font-medium";

  const ctaSolidRed =
    baseCta +
    " bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs " +
    "hover:bg-[color-mix(in_oklab,var(--primary)_90%,black)]";

  const ctaSolidGreen =
    baseCta +
    " bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-xs " +
    "hover:bg-[color-mix(in_oklab,var(--secondary)_90%,black)]";

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* BACKGROUND LAYERS */}
      <div className="absolute inset-0" aria-hidden>
        {/* z-0: image */}
        {background ? (
          <Image
            alt=""
            fill
            priority
            className="object-cover z-0"
            src={urlFor(background).width(2400).height(1200).url()}
          />
        ) : null}

        {/* z-10: overlay BETWEEN image and content; dims only the image */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ backgroundColor: "var(--background)", opacity: overlay }}
        />
      </div>

      {/* CONTENT (z-20) */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            {/* Larger mobile title so it reads like the reference site */}
            {title ? (
              <h1
                className={[
                  "font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance",
                  textShadow,
                ].join(" ")}
                style={{ color: titleCss }}
              >
                {title}
              </h1>
            ) : null}

            {kicker ? (
              <p
                className={[
                  "font-serif text-xl md:text-2xl font-medium text-balance",
                  textShadow,
                ].join(" ")}
                style={{ color: kickerCss }}
              >
                {kicker}
              </p>
            ) : null}

            {body ? (
              <p
                className={[
                  "text-lg md:text-xl leading-relaxed text-pretty mx-auto",
                  textShadow,
                ].join(" ")}
                style={{ color: bodyCss, maxWidth: "48rem" }} // ~max-w-3xl
              >
                {body}
              </p>
            ) : null}
          </div>

          {/* CTAs — left red, right green; identical sizing */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {primaryCta?.href && primaryCta?.label ? (
              <Link href={primaryCta.href} className={ctaSolidRed}>
                {primaryCta.label}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="lucide lucide-arrow-right h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            ) : null}

            {secondaryCta?.href && secondaryCta?.label ? (
              <Link href={secondaryCta.href} className={ctaSolidGreen}>
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
