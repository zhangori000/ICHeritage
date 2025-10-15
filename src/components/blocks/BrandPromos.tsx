"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { stegaClean } from "next-sanity";

import { urlFor } from "@/sanity/lib/image";

type SanityColor = {
  hex?: string | null;
} | null;

type BrandCTA = {
  label?: string | null;
  href?: string | null;
} | null;

type BrandLink = {
  href?: string | null;
  label?: string | null;
} | null;

type BrandImage = {
  asset?: {
    _ref?: string | null;
    _type?: string | null;
  } | null;
  alt?: string | null;
} | null;

type BrandPromo = {
  _id: string;
  title?: string | null;
  kicker?: string | null;
  headline?: string | null;
  subhead?: string | null;
  footnote?: string | null;
  themeColor?: SanityColor;
  textColor?: SanityColor;
  imageOverlayStrength?: number | null;
  primaryCta?: BrandCTA;
  secondaryCta?: BrandCTA;
  promoLink?: BrandLink;
  heroImage?: BrandImage;
  logo?: BrandImage;
};

type BrandPromosBlock = {
  sectionId?: string | null;
  heading?: string | null;
  intro?: string | null;
  brands?: BrandPromo[] | null;
};

const defaultImage = "/Gemini_Generated_Image_Default_Brand.png";

const clean = (value?: string | null) => (value ? stegaClean(value) : "");

const isInternalHref = (href?: string | null) => {
  if (!href) return false;
  return href.startsWith("/") || href.startsWith("#");
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function sanitizeColor(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeHex(hex?: string | null) {
  const sanitized = sanitizeColor(hex);
  if (!sanitized) return null;
  const withoutHash = sanitized.startsWith("#")
    ? sanitized.slice(1)
    : sanitized;
  if (!(withoutHash.length === 3 || withoutHash.length === 6)) {
    return null;
  }
  if (!/^[0-9a-fA-F]+$/.test(withoutHash)) {
    return null;
  }
  if (withoutHash.length === 3) {
    return withoutHash
      .split("")
      .map((char) => char + char)
      .join("")
      .toLowerCase();
  }
  return withoutHash.toLowerCase();
}

function hexToRgba(hex?: string | null, alpha = 1) {
  const normalized = normalizeHex(hex);
  if (!normalized) return undefined;
  const value = Number.parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hexToRgb(hex?: string | null) {
  const normalized = normalizeHex(hex);
  if (!normalized) return undefined;
  const value = Number.parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function relativeLuminance(hex?: string | null) {
  const rgb = hexToRgb(hex);
  if (!rgb) return undefined;
  const srgb = [rgb.r, rgb.g, rgb.b].map((channel) => channel / 255);
  const linear = srgb.map((channel) =>
    channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  );
  const [r, g, b] = linear;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function pickTextColor(
  backgroundHex?: string | null,
  light = "#ffffff",
  dark = "#0f172a"
) {
  const luminance = relativeLuminance(backgroundHex);
  if (typeof luminance !== "number") return light;
  return luminance > 0.55 ? dark : light;
}

function colorWithAlpha(hex: string | null, alpha: number, fallback: string) {
  const rgba = hexToRgba(hex, alpha);
  return rgba ?? fallback;
}

function imageSrc(
  image: BrandImage | undefined,
  { width, height }: { width: number; height: number }
) {
  if (image?.asset?._ref) {
    return urlFor(image).width(width).height(height).fit("max").quality(85).url();
  }
  return null;
}

function renderCTA(
  cta: BrandCTA | undefined,
  intent: "primary" | "secondary",
  accentColor?: string | null,
  textColor?: string | null,
  secondaryBackgroundColor?: string | null
) {
  const label = clean(cta?.label);
  const href = cta?.href?.trim();
  if (!label || !href) return null;

  const baseClasses =
    "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]";

  if (intent === "primary") {
    const accent = accentColor ?? "var(--primary)";
    const text = textColor ?? (accentColor ? "#ffffff" : "var(--primary-foreground)");
    const style: React.CSSProperties = {
      backgroundColor: accent,
      color: text,
    };
    if (isInternalHref(href)) {
      return (
        <Link href={href} className={baseClasses} style={style}>
          {label}
        </Link>
      );
    }
    return (
      <a href={href} className={baseClasses} style={style}>
        {label}
      </a>
    );
  }

  const style: React.CSSProperties = {
    borderColor: accentColor ?? "var(--border)",
    color: textColor ?? accentColor ?? "var(--foreground)",
    backgroundColor: secondaryBackgroundColor ?? "transparent",
  };
  const className = `${baseClasses} border`;

  if (isInternalHref(href)) {
    return (
      <Link href={href} className={className} style={style}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className={className} style={style}>
      {label}
    </a>
  );
}

export function BrandPromos({
  sectionId,
  heading,
  intro,
  brands,
}: BrandPromosBlock) {
  const safeBrands = Array.isArray(brands)
    ? brands.filter((brand): brand is BrandPromo => Boolean(brand && brand._id))
    : [];

  if (safeBrands.length === 0) {
    return null;
  }

  return (
    <section
      id={sectionId ? clean(sectionId) : undefined}
      className="bg-[color:var(--background)] py-16 sm:py-24"
    >
      <div className="mx-auto w-full space-y-16">
        {(heading || intro) && (
          <div className="mx-auto max-w-3xl space-y-3 px-4 text-center">
            {heading ? (
              <h2 className="font-serif text-3xl font-bold text-[color:var(--foreground)] md:text-4xl">
                {clean(heading)}
              </h2>
            ) : null}
            {intro ? (
              <p className="text-lg text-[color:var(--muted-foreground)]">
                {clean(intro)}
              </p>
            ) : null}
          </div>
        )}

        <div className="px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-6">
            {safeBrands.map((brand) => {
              const kicker = clean(brand.kicker);
              const headline = clean(brand.headline) || clean(brand.title);
              const subhead = clean(brand.subhead);
              const footnote = clean(brand.footnote);
              const promoLinkHref = brand.promoLink?.href?.trim();
              const promoLinkLabel =
                clean(brand.promoLink?.label) ||
                `Learn more about ${headline || "this brand"}`;
              const heroSrc =
                imageSrc(brand.heroImage, { width: 2000, height: 2000 }) ??
                defaultImage;
              const heroAlt =
                clean(brand.heroImage?.alt) || headline || "Brand image";
              const logoSrc = imageSrc(brand.logo, { width: 320, height: 140 });
              const logoAlt =
                clean(brand.logo?.alt) || headline || "Brand logo";
              const accentHex = sanitizeColor(brand.themeColor?.hex);
              const explicitTextHex = sanitizeColor(brand.textColor?.hex);
              const textColor =
                explicitTextHex ??
                (accentHex ? pickTextColor(accentHex) : "#ffffff");
              const ctaAccentColor = accentHex ?? "var(--primary)";
              const secondaryBackgroundColor = colorWithAlpha(
                accentHex,
                0.16,
                accentHex ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.08)"
              );
              const secondaryTextColor = accentHex ?? textColor;
              const overlayStrengthValue =
                typeof brand.imageOverlayStrength === "number"
                  ? brand.imageOverlayStrength
                  : null;
              const overlayStrength = clamp(overlayStrengthValue ?? 0.35, 0, 1);
              const baseAlpha = 0.18 + overlayStrength * 0.35;
              const fadeAlpha = 0.04 + overlayStrength * 0.18;
              const gradientBase = accentHex
                ? hexToRgba(accentHex, baseAlpha) ??
                  `rgba(15, 23, 42, ${baseAlpha})`
                : `rgba(15, 23, 42, ${baseAlpha})`;
              const gradientFade = accentHex
                ? hexToRgba(accentHex, fadeAlpha) ??
                  `rgba(15, 23, 42, ${fadeAlpha})`
                : `rgba(15, 23, 42, ${fadeAlpha})`;
              const overlayVeilAlpha = 0.025 + overlayStrength * 0.06;
              const cardStyle: React.CSSProperties = {
                color: textColor,
              };
              const gradientStyle: React.CSSProperties = {
                backgroundImage: `linear-gradient(180deg, ${gradientFade} 0%, ${gradientBase} 100%)`,
              };
              const overlayVeilStyle: React.CSSProperties = {
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, ${overlayVeilAlpha}) 0%, rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, ${overlayVeilAlpha}) 100%)`,
                mixBlendMode: "overlay",
              };
              const mutedTextStyle: React.CSSProperties = {
                color: textColor,
                opacity: 0.9,
              };
              const footnoteStyle: React.CSSProperties = {
                color: textColor,
                opacity: 0.75,
              };
              const kickerStyle: React.CSSProperties = {
                color: textColor,
                opacity: 0.8,
              };

              return (
                <article
                  key={brand._id}
                  className="relative aspect-square overflow-hidden rounded-2xl"
                  style={cardStyle}
                >
                  {promoLinkHref ? (
                    isInternalHref(promoLinkHref) ? (
                      <Link
                        href={promoLinkHref}
                        aria-label={promoLinkLabel}
                        className="absolute inset-0 z-10"
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                    ) : (
                      <a
                        href={promoLinkHref}
                        aria-label={promoLinkLabel}
                        className="absolute inset-0 z-10"
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                    )
                  ) : null}

                  <Image
                    src={heroSrc}
                    alt={heroAlt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                style={gradientStyle}
              />

              <div className="relative z-20 flex h-full flex-col items-center justify-center gap-6 px-6 text-center sm:px-10">
                <div className="flex flex-col items-center gap-4">
                      {logoSrc ? (
                        <Image
                          src={logoSrc}
                          alt={logoAlt}
                          width={200}
                          height={72}
                          className="h-12 w-auto object-contain sm:h-16"
                        />
                      ) : null}
                      <div className="space-y-3">
                        {kicker ? (
                          <p
                            className="text-xs font-semibold uppercase tracking-[0.28em]"
                            style={kickerStyle}
                          >
                            {kicker}
                          </p>
                        ) : null}
                        {headline ? (
                          <h3 className="font-serif text-3xl font-medium md:text-4xl">
                            {headline}
                          </h3>
                        ) : null}
                        {subhead ? (
                          <p className="text-base leading-relaxed" style={mutedTextStyle}>
                            {subhead}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {renderCTA(
                        brand.primaryCta,
                        "primary",
                        ctaAccentColor,
                        textColor
                      )}
                      {renderCTA(
                        brand.secondaryCta,
                        "secondary",
                        ctaAccentColor,
                        secondaryTextColor,
                        secondaryBackgroundColor
                      )}
                    </div>

                    {footnote ? (
                      <p className="text-sm" style={footnoteStyle}>
                        {footnote}
                      </p>
                    ) : null}
                  </div>

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={overlayVeilStyle}
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
