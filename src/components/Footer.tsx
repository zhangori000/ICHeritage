"use client";

import Image from "next/image";
import Link from "next/link";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";

/* ------------------------------------------------------------------ */
/* Local, explicit types so Footer works even if typegen is stale.     */
/* ------------------------------------------------------------------ */
type Social = {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
};

type QuickLink = {
  _key?: string;
  label: string;
  href: string;
};

type LegalPage = { title: string | null; slug: string | null };

type FooterProps = {
  settings: SITE_SETTINGS_QUERY_RESULT;
  /** Pages with slug "privacy" / "terms" that exist in Sanity. Links render only for these. */
  legalPages?: LegalPage[];
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export function Footer({ settings, legalPages = [] }: FooterProps) {
  const orgName = settings?.orgName ?? "ICHeritage";
  const blurb =
    settings?.footerBlurb ??
    "Dedicated to preserving and promoting cultural heritage through education, community engagement, and innovative programs.";

  const logo = settings?.logo ?? null;
  const logoSrc =
    (logo?.asset?._ref && urlFor(logo).height(80).fit("max").url()) ||
    "/images/logo.png";

  /** helper: coerce `string | null | undefined` -> `string | undefined` */
  const asUndef = (v: string | null | undefined) => v ?? undefined;

  const socials: Social = {
    facebook: asUndef(settings?.social?.facebook),
    twitter: asUndef(settings?.social?.twitter),
    instagram: asUndef(settings?.social?.instagram),
    youtube: asUndef(settings?.social?.youtube),
  };
  const hasSocials = Object.values(socials).some(Boolean);

  const quickLinks: QuickLink[] = (settings?.quickLinks ?? [])
    .filter((l): l is { _key: string; label: string; href: string } => {
      return !!l && !!l.label && !!l.href;
    })
    .map((l) => ({ _key: l._key, label: l.label, href: l.href }));

  const email = settings?.contactEmail ?? undefined;
  const phone = settings?.contactPhone ?? undefined;

  // Privacy / Terms links appear only once those pages exist in Studio.
  const LEGAL_ORDER = ["privacy", "terms"];
  const legalLinks = legalPages
    .filter((page): page is { title: string; slug: string } =>
      Boolean(page?.slug && page?.title)
    )
    .sort((a, b) => LEGAL_ORDER.indexOf(a.slug) - LEGAL_ORDER.indexOf(b.slug));

  const photoCredits = settings?.photoCredits?.trim() || null;

  const newsletterEnabled = settings?.newsletter?.enabled ?? true;
  const newsletterBlurb =
    settings?.newsletter?.blurb ??
    "Stay updated with our latest initiatives and cultural events.";

  const footerLink =
    "text-[15px] text-[color:var(--ink-soft)] transition-colors hover:text-[color:var(--seal)]";

  return (
    <footer className="border-t border-[color:var(--ink)] bg-[color:var(--paper)]">
      <div className="wrap flex flex-col gap-14 pb-10 pt-16">
        <div
          className={[
            "grid grid-cols-1 gap-10 md:grid-cols-2",
            quickLinks.length > 0
              ? "lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]"
              : "lg:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))]",
          ].join(" ")}
        >
          {/* Brand / blurb */}
          <div className="flex max-w-md flex-col gap-5">
            <div className="flex items-center gap-3">
              <Image
                alt={`${orgName} seal`}
                src={logoSrc}
                width={32}
                height={36}
                className="h-8 w-auto object-contain"
              />
              <span className="font-serif text-[22px] font-medium leading-none">
                {orgName}
              </span>
            </div>

            <p className="text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
              {blurb}
            </p>

            {newsletterEnabled ? (
              // Email sign-up is not wired to a mailing service yet, so this is
              // a plain note instead of a dead form.
              <p className="text-sm leading-relaxed text-[color:var(--ink-muted)]">
                {newsletterBlurb} Newsletter sign-up is coming soon
                {email ? (
                  <>
                    . For now, say hello at{" "}
                    <a
                      href={`mailto:${email}`}
                      className="border-b border-[color:var(--hairline)] text-[color:var(--ink)] hover:border-[color:var(--seal)] hover:text-[color:var(--seal)]"
                    >
                      {email}
                    </a>
                  </>
                ) : null}
                .
              </p>
            ) : null}
          </div>

          {/* Quick links (editor-controlled) */}
          {quickLinks.length > 0 ? (
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Explore</span>
              {quickLinks.map((link) => (
                <Link
                  key={link._key ?? `${link.href}-${link.label}`}
                  href={link.href}
                  className={footerLink}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}

          {/* Get involved */}
          <div className="flex flex-col gap-3">
            <span className="eyebrow">Get involved</span>
            <Link href="/start-a-chapter" className={footerLink}>
              Start a chapter
            </Link>
            <Link href="/volunteer" className={footerLink}>
              Volunteer
            </Link>
            {settings?.donateUrl ? (
              <a
                href={settings.donateUrl}
                className={footerLink}
                target={/^https?:/i.test(settings.donateUrl) ? "_blank" : undefined}
                rel="noreferrer"
              >
                Donate
              </a>
            ) : null}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <span className="eyebrow">Contact</span>
            {email ? (
              <a href={`mailto:${email}`} className={footerLink}>
                {email}
              </a>
            ) : null}
            {phone ? (
              <a
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                className={footerLink}
              >
                {phone}
              </a>
            ) : null}

            {hasSocials ? (
              <div className="mt-2 flex gap-3">
                {socials.instagram ? (
                  <SocialIcon href={socials.instagram} label="Instagram">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </SocialIcon>
                ) : null}
                {socials.youtube ? (
                  <SocialIcon href={socials.youtube} label="YouTube">
                    <rect x="2.5" y="5.5" width="19" height="13" rx="3" />
                    <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
                  </SocialIcon>
                ) : null}
                {socials.facebook ? (
                  <SocialIcon href={socials.facebook} label="Facebook">
                    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
                  </SocialIcon>
                ) : null}
                {socials.twitter ? (
                  <SocialIcon href={socials.twitter} label="X (Twitter)">
                    <path d="M4 4l16 16" />
                    <path d="M20 4L4 20" />
                  </SocialIcon>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-[color:var(--hairline)] pt-5">
          {photoCredits ? (
            <p className="text-xs leading-relaxed text-[color:var(--ink-muted)]">
              {photoCredits}
            </p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-[color:var(--ink-muted)]">
              © {new Date().getFullYear()} {orgName}. All rights reserved.
            </p>
            {legalLinks.length > 0 ? (
              <div className="flex gap-6">
                {legalLinks.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/${page.slug}`}
                    className="text-[13px] text-[color:var(--ink-muted)] transition-colors hover:text-[color:var(--seal)]"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Square 44px social button with a hairline border. */
function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      aria-label={label}
      href={href}
      className="inline-flex h-11 w-11 items-center justify-center border border-[color:var(--hairline)] text-[color:var(--ink)] transition-colors hover:border-[color:var(--ink)]"
      target="_blank"
      rel="noreferrer"
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </a>
  );
}
