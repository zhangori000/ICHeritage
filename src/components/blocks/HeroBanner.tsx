// src/components/blocks/HeroBanner.tsx
"use client";

import Link from "next/link";
import { BlurUpImage } from "@/components/BlurUpImage";
import { urlFor } from "@/sanity/lib/image";
import type { PAGE_QUERY_RESULT } from "@/sanity/types";

/** Narrow the block type to the heroBanner block from PAGE_QUERY_RESULT */
type HeroBannerBlock = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["content"]>[number],
  { _type: "heroBanner" }
>;

/**
 * Split "Keep it Alive, Help it Thrive" into ["Keep it Alive, Help it", "Thrive"]
 * so the last word can be set in light italic red. Short titles stay whole.
 */
function splitLastWord(title: string): [string, string | null] {
  const trimmed = title.trim();
  const words = trimmed.split(/\s+/);
  if (words.length < 3) return [trimmed, null];
  const last = words.pop() as string;
  return [words.join(" "), last];
}

/**
 * Editorial hero: copy on paper to the left, the photo to the right running
 * off the edge of the page. The text no longer sits on top of the image, so
 * the overlay and per-field colour pickers from the Studio are not needed
 * here; they are kept in the schema for the older layout.
 */
export function HeroBanner({
  background,
  title,
  kicker,
  body,
  primaryCta,
  secondaryCta,
  backgroundLqip,
}: HeroBannerBlock) {
  const [titleHead, titleTail] = title ? splitLastWord(title) : ["", null];

  // A short kicker is set as a small-caps label above the title; a full
  // sentence would not read at that size, so it joins the body copy instead.
  const kickerText = kicker?.trim() ?? "";
  const kickerIsLabel = kickerText.length > 0 && kickerText.length <= 64;
  const paragraphs = [
    kickerIsLabel ? null : kickerText || null,
    body?.trim() || null,
  ].filter((text): text is string => Boolean(text));

  return (
    <section className="relative overflow-x-clip border-b border-[color:var(--ink)]">
      <div className="wrap lg:pr-0">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
          {/* ------------------ Copy ------------------ */}
          <div className="rise flex flex-col gap-8 pb-4 pt-14 lg:gap-9 lg:py-24 lg:pr-10">
            {kickerIsLabel ? (
              <p className="eyebrow eyebrow-rule m-0">{kickerText}</p>
            ) : null}

            {title ? (
              <h1 className="display m-0 text-[clamp(2.75rem,8vw,5rem)] leading-[0.94] lg:text-[clamp(3.5rem,6.6vw,7rem)]">
                {titleHead}
                {titleTail ? (
                  <>
                    {" "}
                    <em className="display-em">{titleTail}</em>
                  </>
                ) : null}
              </h1>
            ) : null}

            {paragraphs.map((text, index) => (
              <p
                key={index}
                className="m-0 max-w-[32rem] text-lg leading-relaxed text-[color:var(--ink-soft)] text-pretty md:text-xl"
              >
                {text}
              </p>
            ))}

            {(primaryCta?.href && primaryCta?.label) ||
            (secondaryCta?.href && secondaryCta?.label) ? (
              <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                {primaryCta?.href && primaryCta?.label ? (
                  <Link href={primaryCta.href} className="btn btn-primary">
                    {primaryCta.label}
                  </Link>
                ) : null}
                {secondaryCta?.href && secondaryCta?.label ? (
                  <Link href={secondaryCta.href} className="textlink">
                    {secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* ------------------ Photo ------------------ */}
          {background ? (
            <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-stretch gap-2 pb-12 lg:grid-cols-[3.5rem_minmax(0,1fr)] lg:pb-0 lg:[margin-right:calc((100vw-min(100vw,1360px))/-2)]">
              {/* 薪火相传: "pass the torch from generation to generation" */}
              <span
                aria-hidden="true"
                className="font-sc justify-self-center pt-2 text-[2rem] leading-none tracking-[0.26em] text-[color:var(--ink)] [writing-mode:vertical-rl] lg:text-[2.5rem]"
              >
                薪火相传
              </span>
              <figure className="unveil relative m-0 aspect-[4/3] min-h-0 sm:aspect-[3/2] lg:aspect-auto lg:min-h-[40rem]">
                <div className="absolute inset-0 overflow-hidden border-l border-t border-[color:var(--ink)] lg:border-b-0">
                  <BlurUpImage
                    alt=""
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    lqip={backgroundLqip}
                    hotspot={background.hotspot}
                    className="object-cover"
                    src={urlFor(background).width(1800).height(2000).url()}
                  />
                </div>
              </figure>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
