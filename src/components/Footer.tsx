"use client";

import Image from "next/image";
import Link from "next/link";
// If/when your typegen is updated, you can re-enable this import.
import type { SITE_SETTINGS_QUERYResult } from "@/sanity/types";
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

/* If you want to be strict later:
type FooterProps = { settings: SITE_SETTINGS_QUERYResult }
*/
type FooterProps = { settings: SITE_SETTINGS_QUERYResult };

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export function Footer({ settings }: FooterProps) {
  // Safe fallbacks so UI never crashes if a field is missing
  const orgName = settings?.orgName ?? "ICHeritage";
  const blurb =
    settings?.footerBlurb ??
    "Dedicated to preserving and promoting cultural heritage through education, community engagement, and innovative programs.";

  const logo = settings?.logo ?? null;

  /** helper: coerce `string | null | undefined` -> `string | undefined` */
  const asUndef = (v: string | null | undefined) => v ?? undefined;

  // Normalize socials (null -> undefined) to match `Social`
  const socials: Social = {
    facebook: asUndef(settings?.social?.facebook),
    twitter: asUndef(settings?.social?.twitter),
    instagram: asUndef(settings?.social?.instagram),
    youtube: asUndef(settings?.social?.youtube),
  };

  // Normalize quickLinks (drop items missing label/href, and narrow to string)
  const quickLinks: QuickLink[] = (settings?.quickLinks ?? [])
    .filter((l): l is { _key: string; label: string; href: string } => {
      return !!l && !!l.label && !!l.href;
    })
    .map((l) => ({ _key: l._key, label: l.label, href: l.href }));

  // Other simple fields (leave as optional where appropriate)
  const email = settings?.contactEmail ?? undefined;
  const phone = settings?.contactPhone ?? undefined;

  // Address lines as safe string[]
  const addressLines: string[] = (settings?.address ?? []).filter(
    (line): line is string => typeof line === "string" && line.length > 0
  );

  const newsletterEnabled = settings?.newsletter?.enabled ?? true;
  const newsletterBlurb =
    settings?.newsletter?.blurb ??
    "Stay updated with our latest initiatives and cultural events.";

  return (
    <footer className="bg-[color-mix(in_oklab,var(--muted)_30%,transparent)] border-t border-[var(--border)] font-normal">
      <div className="container mx-auto px-4 py-12">
        {/* Top 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand / blurb / socials */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {logo?.asset?._ref ? (
                <Image
                  alt={`${orgName} Logo`}
                  src={urlFor(logo).width(40).height(40).fit("crop").url()}
                  width={40}
                  height={40}
                />
              ) : (
                <Image
                  alt={`${orgName} Logo`}
                  src="/images/logo.png"
                  width={40}
                  height={40}
                />
              )}
              <span className="font-serif text-xl font-semibold">
                {orgName}
              </span>
            </div>

            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed font-normal">
              {blurb}
            </p>

            <div className="flex gap-3">
              {socials.facebook && (
                <SocialIcon href={socials.facebook} label="Facebook">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </SocialIcon>
              )}
              {socials.twitter && (
                <SocialIcon href={socials.twitter} label="Twitter">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </SocialIcon>
              )}
              {socials.instagram && (
                <SocialIcon href={socials.instagram} label="Instagram">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </SocialIcon>
              )}
              {socials.youtube && (
                <SocialIcon href={socials.youtube} label="YouTube">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                </SocialIcon>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium tracking-tight text-[var(--foreground)]">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link: QuickLink) => (
                <li key={link._key ?? `${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm font-normal text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium tracking-tight text-[var(--foreground)]">
              Contact
            </h3>
            <div className="space-y-3">
              {email && (
                <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[var(--primary)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>{email}</span>
                </div>
              )}

              {phone && (
                <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[var(--primary)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{phone}</span>
                </div>
              )}

              {addressLines.length > 0 && (
                <div className="flex items-start gap-3 text-sm text-[var(--muted-foreground)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[var(--primary)] mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    {addressLines.map((line: string, i: number) => (
                      <div key={`${i}-${line}`}>{line}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium tracking-tight text-[var(--foreground)]">
              Follow Us
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {newsletterBlurb}
            </p>

            {newsletterEnabled && (
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-[var(--background)]
                             focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
                <button
                  className="w-full px-3 py-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)]
                             rounded-md hover:bg-[color-mix(in_oklab,var(--primary)_90%,black)] transition-colors"
                >
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--muted-foreground)]">
              © {new Date().getFullYear()} {orgName}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-[var(--muted-foreground)] font-normal">
              <Link
                href="/privacy"
                className="hover:text-[var(--primary)] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-[var(--primary)] transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Small helper for square social buttons with hover styles */
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
      className="flex items-center justify-center w-9 h-9 rounded-md
                 bg-[var(--background)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]
                 transition-colors"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
